import sqlite3
from typing import List, Optional

from .model import Customer


_DDL = """
CREATE TABLE IF NOT EXISTS customers (
    cust_id             INTEGER PRIMARY KEY,
    first_name          TEXT    NOT NULL,
    middle_name         TEXT    NOT NULL DEFAULT '',
    last_name           TEXT    NOT NULL,
    addr_line_1         TEXT    NOT NULL,
    addr_line_2         TEXT    NOT NULL DEFAULT '',
    addr_line_3         TEXT    NOT NULL DEFAULT '',
    addr_state_cd       TEXT    NOT NULL,
    addr_country_cd     TEXT    NOT NULL,
    addr_zip            TEXT    NOT NULL,
    phone_num_1         TEXT    NOT NULL DEFAULT '',
    phone_num_2         TEXT    NOT NULL DEFAULT '',
    ssn                 INTEGER NOT NULL UNIQUE,
    govt_issued_id      TEXT    NOT NULL DEFAULT '',
    dob                 TEXT    NOT NULL,
    eft_account_id      TEXT    NOT NULL,
    pri_card_holder_ind TEXT    NOT NULL,
    fico_credit_score   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_customers_ssn ON customers (ssn);
"""


def _row_to_customer(row: sqlite3.Row) -> Customer:
    return Customer(
        cust_id=row["cust_id"],
        first_name=row["first_name"],
        middle_name=row["middle_name"],
        last_name=row["last_name"],
        addr_line_1=row["addr_line_1"],
        addr_line_2=row["addr_line_2"],
        addr_line_3=row["addr_line_3"],
        addr_state_cd=row["addr_state_cd"],
        addr_country_cd=row["addr_country_cd"],
        addr_zip=row["addr_zip"],
        phone_num_1=row["phone_num_1"],
        phone_num_2=row["phone_num_2"],
        ssn=row["ssn"],
        govt_issued_id=row["govt_issued_id"],
        dob=row["dob"],
        eft_account_id=row["eft_account_id"],
        pri_card_holder_ind=row["pri_card_holder_ind"],
        fico_credit_score=row["fico_credit_score"],
    )


class CustomerRepository:
    def __init__(self, db_path: str = "custfile.db") -> None:
        self._db_path = db_path
        self._conn: Optional[sqlite3.Connection] = None

    def open(self) -> None:
        self._conn = sqlite3.connect(self._db_path)
        self._conn.row_factory = sqlite3.Row
        self._conn.executescript(_DDL)
        self._conn.commit()

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None

    def __enter__(self) -> "CustomerRepository":
        self.open()
        return self

    def __exit__(self, *_) -> None:
        self.close()

    def create(self, customer: Customer) -> None:
        self._conn.execute(
            """
            INSERT INTO customers
              (cust_id, first_name, middle_name, last_name,
               addr_line_1, addr_line_2, addr_line_3,
               addr_state_cd, addr_country_cd, addr_zip,
               phone_num_1, phone_num_2,
               ssn, govt_issued_id, dob,
               eft_account_id, pri_card_holder_ind, fico_credit_score)
            VALUES
              (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                customer.cust_id, customer.first_name, customer.middle_name,
                customer.last_name, customer.addr_line_1, customer.addr_line_2,
                customer.addr_line_3, customer.addr_state_cd, customer.addr_country_cd,
                customer.addr_zip, customer.phone_num_1, customer.phone_num_2,
                customer.ssn, customer.govt_issued_id, customer.dob,
                customer.eft_account_id, customer.pri_card_holder_ind,
                customer.fico_credit_score,
            ),
        )
        self._conn.commit()

    def read_by_id(self, cust_id: int) -> Optional[Customer]:
        row = self._conn.execute(
            "SELECT * FROM customers WHERE cust_id = ?", (cust_id,)
        ).fetchone()
        return _row_to_customer(row) if row else None

    def read_by_ssn(self, ssn: int) -> Optional[Customer]:
        row = self._conn.execute(
            "SELECT * FROM customers WHERE ssn = ?", (ssn,)
        ).fetchone()
        return _row_to_customer(row) if row else None

    def update(self, customer: Customer) -> bool:
        cursor = self._conn.execute(
            """
            UPDATE customers SET
              first_name=?, middle_name=?, last_name=?,
              addr_line_1=?, addr_line_2=?, addr_line_3=?,
              addr_state_cd=?, addr_country_cd=?, addr_zip=?,
              phone_num_1=?, phone_num_2=?,
              ssn=?, govt_issued_id=?, dob=?,
              eft_account_id=?, pri_card_holder_ind=?, fico_credit_score=?
            WHERE cust_id=?
            """,
            (
                customer.first_name, customer.middle_name, customer.last_name,
                customer.addr_line_1, customer.addr_line_2, customer.addr_line_3,
                customer.addr_state_cd, customer.addr_country_cd, customer.addr_zip,
                customer.phone_num_1, customer.phone_num_2,
                customer.ssn, customer.govt_issued_id, customer.dob,
                customer.eft_account_id, customer.pri_card_holder_ind,
                customer.fico_credit_score, customer.cust_id,
            ),
        )
        self._conn.commit()
        return cursor.rowcount > 0

    def list_all(self) -> List[Customer]:
        rows = self._conn.execute(
            "SELECT * FROM customers ORDER BY cust_id"
        ).fetchall()
        return [_row_to_customer(r) for r in rows]

    def count(self) -> int:
        return self._conn.execute("SELECT COUNT(*) FROM customers").fetchone()[0]
