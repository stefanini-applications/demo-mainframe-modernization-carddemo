from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Customer:
    cust_id: int
    first_name: str
    last_name: str
    addr_line_1: str
    addr_state_cd: str
    addr_country_cd: str
    addr_zip: str
    ssn: int
    dob: str
    eft_account_id: str
    pri_card_holder_ind: str
    fico_credit_score: int
    middle_name: str = ""
    addr_line_2: str = ""
    addr_line_3: str = ""
    phone_num_1: str = ""
    phone_num_2: str = ""
    govt_issued_id: str = ""

    FIELD_LENGTHS: dict = field(default_factory=lambda: {}, init=False, repr=False, compare=False)
    RECORD_LENGTH: int = field(default=500, init=False, repr=False, compare=False)

    def to_dict(self) -> dict:
        return {
            "cust_id": self.cust_id,
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "last_name": self.last_name,
            "addr_line_1": self.addr_line_1,
            "addr_line_2": self.addr_line_2,
            "addr_line_3": self.addr_line_3,
            "addr_state_cd": self.addr_state_cd,
            "addr_country_cd": self.addr_country_cd,
            "addr_zip": self.addr_zip,
            "phone_num_1": self.phone_num_1,
            "phone_num_2": self.phone_num_2,
            "ssn": self.ssn,
            "govt_issued_id": self.govt_issued_id,
            "dob": self.dob,
            "eft_account_id": self.eft_account_id,
            "pri_card_holder_ind": self.pri_card_holder_ind,
            "fico_credit_score": self.fico_credit_score,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Customer":
        return cls(
            cust_id=int(data["cust_id"]),
            first_name=data["first_name"],
            middle_name=data.get("middle_name", ""),
            last_name=data["last_name"],
            addr_line_1=data["addr_line_1"],
            addr_line_2=data.get("addr_line_2", ""),
            addr_line_3=data.get("addr_line_3", ""),
            addr_state_cd=data["addr_state_cd"],
            addr_country_cd=data["addr_country_cd"],
            addr_zip=data["addr_zip"],
            phone_num_1=data.get("phone_num_1", ""),
            phone_num_2=data.get("phone_num_2", ""),
            ssn=int(data["ssn"]),
            govt_issued_id=data.get("govt_issued_id", ""),
            dob=data["dob"],
            eft_account_id=data["eft_account_id"],
            pri_card_holder_ind=data["pri_card_holder_ind"],
            fico_credit_score=int(data["fico_credit_score"]),
        )

    @classmethod
    def from_fixed_width(cls, record: str) -> "Customer":
        if len(record) < 332:
            raise ValueError(f"Record too short: {len(record)} < 332")
        pos = 0

        def read(length: int) -> str:
            nonlocal pos
            value = record[pos: pos + length].strip()
            pos += length
            return value

        cust_id = int(read(9)) if record[0:9].strip() else 0
        first_name = read(25)
        middle_name = read(25)
        last_name = read(25)
        addr_line_1 = read(50)
        addr_line_2 = read(50)
        addr_line_3 = read(50)
        addr_state_cd = read(2)
        addr_country_cd = read(3)
        addr_zip = read(10)
        phone_num_1 = read(15)
        phone_num_2 = read(15)
        ssn_raw = record[pos: pos + 9].strip()
        ssn = int(ssn_raw) if ssn_raw.isdigit() else 0
        pos += 9
        govt_issued_id = read(20)
        dob = read(10)
        eft_account_id = read(10)
        pri_card_holder_ind = read(1)
        fico_raw = record[pos: pos + 3].strip()
        fico_credit_score = int(fico_raw) if fico_raw.isdigit() else 0

        return cls(
            cust_id=cust_id,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            addr_line_1=addr_line_1,
            addr_line_2=addr_line_2,
            addr_line_3=addr_line_3,
            addr_state_cd=addr_state_cd,
            addr_country_cd=addr_country_cd,
            addr_zip=addr_zip,
            phone_num_1=phone_num_1,
            phone_num_2=phone_num_2,
            ssn=ssn,
            govt_issued_id=govt_issued_id,
            dob=dob,
            eft_account_id=eft_account_id,
            pri_card_holder_ind=pri_card_holder_ind,
            fico_credit_score=fico_credit_score,
        )
