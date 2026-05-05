import re
from datetime import date
from typing import List

from .model import Customer

_PHONE_RE = re.compile(r"^\(\d{3}\)\d{3}-\d{4}$")
_DOB_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class ValidationError(Exception):
    def __init__(self, errors: List[str]) -> None:
        self.errors = errors
        super().__init__("; ".join(errors))


class CustomerValidator:
    def validate(self, customer: Customer) -> None:
        errors: List[str] = []

        errors.extend(self._validate_required_alpha("first_name", customer.first_name))
        errors.extend(self._validate_required_alpha("last_name", customer.last_name))
        errors.extend(self._validate_required("addr_line_1", customer.addr_line_1))
        errors.extend(self._validate_required_alpha("addr_state_cd", customer.addr_state_cd))
        errors.extend(self._validate_required_alpha("addr_country_cd", customer.addr_country_cd))
        errors.extend(self._validate_required_numeric("addr_zip", customer.addr_zip[:5]))
        errors.extend(self._validate_required_numeric("eft_account_id", customer.eft_account_id))
        errors.extend(self._validate_yes_no("pri_card_holder_ind", customer.pri_card_holder_ind))
        errors.extend(self._validate_fico(customer.fico_credit_score))
        errors.extend(self._validate_dob(customer.dob))
        errors.extend(self._validate_phone("phone_num_1", customer.phone_num_1))
        errors.extend(self._validate_phone("phone_num_2", customer.phone_num_2))
        errors.extend(self._validate_ssn(customer.ssn))

        if errors:
            raise ValidationError(errors)

    @staticmethod
    def _validate_required(field: str, value: str) -> List[str]:
        if not value or not value.strip():
            return [f"{field}: is required"]
        return []

    @staticmethod
    def _validate_required_alpha(field: str, value: str) -> List[str]:
        if not value or not value.strip():
            return [f"{field}: is required"]
        if not value.strip().replace("-", "").replace(" ", "").replace("'", "").isalpha():
            return [f"{field}: must contain only alphabetic characters"]
        return []

    @staticmethod
    def _validate_required_numeric(field: str, value: str) -> List[str]:
        stripped = value.strip() if value else ""
        if not stripped:
            return [f"{field}: is required"]
        if not stripped.isdigit():
            return [f"{field}: must be numeric"]
        return []

    @staticmethod
    def _validate_yes_no(field: str, value: str) -> List[str]:
        if value not in ("Y", "N"):
            return [f"{field}: must be 'Y' or 'N'"]
        return []

    @staticmethod
    def _validate_fico(score: int) -> List[str]:
        try:
            n = int(score)
        except (TypeError, ValueError):
            return ["fico_credit_score: must be numeric"]
        if not (300 <= n <= 850):
            return [f"fico_credit_score: should be between 300 and 850, got {n}"]
        return []

    @staticmethod
    def _validate_dob(dob: str) -> List[str]:
        if not dob or not dob.strip():
            return ["dob: is required"]
        if not _DOB_RE.match(dob):
            return [f"dob: must be in YYYY-MM-DD format, got '{dob}'"]
        try:
            dob_date = date.fromisoformat(dob)
        except ValueError:
            return [f"dob: invalid date value '{dob}'"]
        if dob_date >= date.today():
            return ["dob: cannot be in the future"]
        return []

    @staticmethod
    def _validate_phone(field: str, value: str) -> List[str]:
        if not value or not value.strip():
            return []
        cleaned = value.strip()
        if not _PHONE_RE.match(cleaned):
            return [f"{field}: must be in (NNN)NNN-NNNN format, got '{cleaned}'"]
        area = cleaned[1:4]
        prefix = cleaned[5:8]
        if int(area) == 0:
            return [f"{field}: area code cannot be zero"]
        if int(prefix) == 0:
            return [f"{field}: prefix code cannot be zero"]
        return []

    @staticmethod
    def _validate_ssn(ssn: int) -> List[str]:
        try:
            n = int(ssn)
        except (TypeError, ValueError):
            return ["ssn: must be numeric"]
        if n == 0:
            return ["ssn: cannot be zero"]
        if not (0 < n <= 999_999_999):
            return ["ssn: must be a valid 9-digit number"]
        return []

    @staticmethod
    def format_ssn(ssn: int) -> str:
        s = f"{int(ssn):09d}"
        return f"{s[:3]}-{s[3:5]}-{s[5:]}"
