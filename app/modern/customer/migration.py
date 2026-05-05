#!/usr/bin/env python3
import argparse
import sys
from datetime import datetime
from typing import List, Tuple

from .model import Customer
from .repository import CustomerRepository
from .validator import CustomerValidator, ValidationError


def _parse_args(argv=None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Migrate CUSTFILE fixed-width records to SQLite"
    )
    parser.add_argument(
        "--input", "-i",
        default="app/data/ASCII/custdata.txt",
        help="Path to the fixed-width CUSTFILE ASCII export",
    )
    parser.add_argument(
        "--output", "-o",
        default="custfile.db",
        help="Path to the target SQLite database",
    )
    parser.add_argument(
        "--report", "-r",
        default=None,
        help="Path for the migration run report (default: stdout only)",
    )
    parser.add_argument(
        "--skip-validation",
        action="store_true",
        help="Load records without field validation (not recommended for production)",
    )
    return parser.parse_args(argv)


class MigrationStats:
    def __init__(self) -> None:
        self.total_processed: int = 0
        self.total_migrated: int = 0
        self.total_rejected: int = 0
        self.rejected_records: List[Tuple[int, int, str]] = []
        self.started_at: datetime = datetime.now()
        self.finished_at: datetime | None = None

    def record_success(self) -> None:
        self.total_processed += 1
        self.total_migrated += 1

    def record_rejection(self, line_no: int, cust_id: int, reason: str) -> None:
        self.total_processed += 1
        self.total_rejected += 1
        self.rejected_records.append((line_no, cust_id, reason))

    def finish(self) -> None:
        self.finished_at = datetime.now()

    def report_lines(self) -> List[str]:
        lines = [
            "=" * 72,
            "CUSTOMER MIGRATION RUN REPORT",
            f"Started  : {self.started_at.strftime('%Y-%m-%d %H:%M:%S')}",
            f"Finished : {self.finished_at.strftime('%Y-%m-%d %H:%M:%S') if self.finished_at else 'N/A'}",
            "-" * 72,
            f"Total Records Processed  : {self.total_processed:>9}",
            f"Records Successfully Migrated : {self.total_migrated:>9}",
            f"Records Rejected         : {self.total_rejected:>9}",
            "-" * 72,
        ]
        if self.rejected_records:
            lines.append("REJECTED RECORDS:")
            lines.append(f"{'Line':>6}  {'CUST-ID':>9}  Reason")
            lines.append("-" * 72)
            for line_no, cust_id, reason in self.rejected_records:
                lines.append(f"{line_no:>6}  {cust_id:>9}  {reason}")
        else:
            lines.append("No records were rejected.")
        lines.append("=" * 72)
        return lines


def run_migration(
    input_path: str,
    output_path: str,
    skip_validation: bool = False,
) -> MigrationStats:
    validator = CustomerValidator()
    stats = MigrationStats()

    with CustomerRepository(output_path) as repo:
        try:
            with open(input_path, "r", encoding="utf-8", errors="replace") as fh:
                for line_no, raw_line in enumerate(fh, start=1):
                    line = raw_line.rstrip("\n")
                    cust_id = 0
                    try:
                        customer = Customer.from_fixed_width(line)
                        cust_id = customer.cust_id

                        if not skip_validation:
                            validator.validate(customer)

                        if repo.read_by_id(customer.cust_id) is not None:
                            raise ValueError(
                                f"Duplicate cust_id={customer.cust_id}"
                            )

                        repo.create(customer)
                        stats.record_success()

                    except ValidationError as exc:
                        stats.record_rejection(line_no, cust_id, str(exc))
                    except (ValueError, IndexError) as exc:
                        stats.record_rejection(line_no, cust_id, str(exc))

        except OSError as exc:
            raise RuntimeError(f"Cannot open input file '{input_path}': {exc}") from exc

    stats.finish()
    return stats


def main(argv=None) -> int:
    args = _parse_args(argv)

    try:
        stats = run_migration(
            input_path=args.input,
            output_path=args.output,
            skip_validation=args.skip_validation,
        )
    except RuntimeError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    report_lines = stats.report_lines()

    for line in report_lines:
        print(line)

    if args.report:
        try:
            with open(args.report, "w", encoding="utf-8") as fh:
                fh.write("\n".join(report_lines) + "\n")
            print(f"\nReport written to: {args.report}")
        except OSError as exc:
            print(f"WARNING: Could not write report file: {exc}", file=sys.stderr)

    return 1 if stats.total_rejected > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
