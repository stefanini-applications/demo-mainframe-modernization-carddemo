"""
Unit tests for the modern customer registration module.

Covers:
  * Customer.from_fixed_width  (AC1 – field mapping)
  * CustomerValidator          (AC3 – validation rules)
  * CustomerRepository         (AC2 – CRUD + SSN alt-index)
  * CustomerService            (AC4 – integrated behaviour)
  * run_migration              (AC5 – migration report)
"""
import os
import sqlite3
import tempfile
import textwrap
from datetime import date, timedelta

import pytest

from app.modern.customer.model import Customer
from app.modern.customer.validator import CustomerValidator, ValidationError
from app.modern.customer.repository import CustomerRepository
from app.modern.customer.service import CustomerService
from app.modern.customer.migration import run_migration, MigrationStats


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _valid_customer(**overrides) -> Customer:
    defaults = dict(
        cust_id=1,
        first_name="John",
        middle_name="M",
        last_name="Doe",
        addr_line_1="123 Main St",
        addr_line_2="Apt 4",
        addr_line_3="Springfield",
        addr_state_cd="IL",
        addr_country_cd="USA",
        addr_zip="62701",
        phone_num_1="(217)555-1234",
        phone_num_2="(217)555-5678",
        ssn=123456789,
        govt_issued_id="DL123456789",
        dob="1985-06-15",
        eft_account_id="1234567890",
        pri_card_holder_ind="Y",
        fico_credit_score=720,
    )
    defaults.update(overrides)
    return Customer(**defaults)


# ---------------------------------------------------------------------------
# Customer.from_fixed_width (AC1)
# ---------------------------------------------------------------------------

class TestFromFixedWidth:
    """Verify all 19 CVCUS01Y fields are correctly parsed (AC1)."""

    # First line from app/data/ASCII/custdata.txt
    _SAMPLE = (
        "000000001"
        "Immanuel                 "  # first name  25
        "Madeline                 "  # middle name 25
        "Kessler                  "  # last name   25
        "618 Deshaun Route                                 "  # addr1 50
        "Apt. 802                                          "  # addr2 50
        "Altenworthshire                                   "  # addr3 50
        "NC"                          # state  2
        "USA"                         # country 3
        "12546     "                  # zip 10
        "(908)119-8310  "             # phone1 15
        "(373)693-8684  "             # phone2 15
        "020973888"                   # ssn 9
        "000000000004936843"          # govt id 18 (padded to 20 below)
        "  "                          # 2 more for govt id = 20 total
        "1961-06-08"                  # dob 10
        "0053581756"                  # eft 10
        "Y"                           # pri_card 1
        "274"                         # fico 3
        + " " * 168                   # filler
    )

    def test_cust_id(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert c.cust_id == 1

    def test_names(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert c.first_name == "Immanuel"
        assert c.middle_name == "Madeline"
        assert c.last_name == "Kessler"

    def test_address(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert "618 Deshaun" in c.addr_line_1
        assert c.addr_state_cd == "NC"
        assert c.addr_country_cd == "USA"

    def test_phone(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert c.phone_num_1 == "(908)119-8310"

    def test_ssn(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert c.ssn == 20973888

    def test_dob(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert c.dob == "1961-06-08"

    def test_fico(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert c.fico_credit_score == 274

    def test_pri_card(self):
        c = Customer.from_fixed_width(self._SAMPLE)
        assert c.pri_card_holder_ind == "Y"


# ---------------------------------------------------------------------------
# CustomerValidator (AC3)
# ---------------------------------------------------------------------------

class TestCustomerValidator:
    _v = CustomerValidator()

    def test_valid_customer_passes(self):
        self._v.validate(_valid_customer())  # no exception

    def test_invalid_phone_format(self):
        with pytest.raises(ValidationError) as exc_info:
            self._v.validate(_valid_customer(phone_num_1="9175551234"))
        assert "phone_num_1" in str(exc_info.value)

    def test_phone_area_code_zero(self):
        with pytest.raises(ValidationError):
            self._v.validate(_valid_customer(phone_num_1="(000)555-1234"))

    def test_phone_optional_blank_ok(self):
        self._v.validate(_valid_customer(phone_num_1="", phone_num_2=""))

    def test_fico_below_range(self):
        with pytest.raises(ValidationError) as exc_info:
            self._v.validate(_valid_customer(fico_credit_score=100))
        assert "300 and 850" in str(exc_info.value)

    def test_fico_above_range(self):
        with pytest.raises(ValidationError):
            self._v.validate(_valid_customer(fico_credit_score=900))

    def test_fico_boundary_low(self):
        self._v.validate(_valid_customer(fico_credit_score=300))

    def test_fico_boundary_high(self):
        self._v.validate(_valid_customer(fico_credit_score=850))

    def test_dob_future(self):
        future = (date.today() + timedelta(days=1)).isoformat()
        with pytest.raises(ValidationError) as exc_info:
            self._v.validate(_valid_customer(dob=future))
        assert "future" in str(exc_info.value)

    def test_dob_bad_format(self):
        with pytest.raises(ValidationError):
            self._v.validate(_valid_customer(dob="15/06/1985"))

    def test_dob_today_rejected(self):
        with pytest.raises(ValidationError):
            self._v.validate(_valid_customer(dob=date.today().isoformat()))

    def test_ssn_zero_rejected(self):
        with pytest.raises(ValidationError):
            self._v.validate(_valid_customer(ssn=0))

    def test_first_name_required(self):
        with pytest.raises(ValidationError):
            self._v.validate(_valid_customer(first_name=""))

    def test_pri_card_invalid(self):
        with pytest.raises(ValidationError):
            self._v.validate(_valid_customer(pri_card_holder_ind="X"))

    def test_format_ssn(self):
        assert CustomerValidator.format_ssn(123456789) == "123-45-6789"

    def test_multiple_errors_returned(self):
        with pytest.raises(ValidationError) as exc_info:
            self._v.validate(_valid_customer(first_name="", last_name="", fico_credit_score=0))
        assert len(exc_info.value.errors) >= 2


# ---------------------------------------------------------------------------
# CustomerRepository (AC2)
# ---------------------------------------------------------------------------

class TestCustomerRepository:
    def _tmp_repo(self, tmp_path):
        repo = CustomerRepository(str(tmp_path / "test.db"))
        repo.open()
        return repo

    def test_create_and_read_by_id(self, tmp_path):
        with self._tmp_repo(tmp_path) as repo:
            c = _valid_customer(cust_id=42)
            repo.create(c)
            result = repo.read_by_id(42)
            assert result is not None
            assert result.first_name == "John"

    def test_read_by_ssn_alt_index(self, tmp_path):
        """AC2: SSN alternate-index lookup must work."""
        with self._tmp_repo(tmp_path) as repo:
            c = _valid_customer(cust_id=99, ssn=987654321)
            repo.create(c)
            result = repo.read_by_ssn(987654321)
            assert result is not None
            assert result.cust_id == 99

    def test_read_by_id_not_found(self, tmp_path):
        with self._tmp_repo(tmp_path) as repo:
            assert repo.read_by_id(9999) is None

    def test_update(self, tmp_path):
        with self._tmp_repo(tmp_path) as repo:
            c = _valid_customer(cust_id=1)
            repo.create(c)
            c.first_name = "Jane"
            repo.update(c)
            updated = repo.read_by_id(1)
            assert updated.first_name == "Jane"

    def test_list_all(self, tmp_path):
        with self._tmp_repo(tmp_path) as repo:
            for i in range(1, 4):
                repo.create(_valid_customer(cust_id=i, ssn=100000000 + i))
            results = repo.list_all()
            assert len(results) == 3
            assert [r.cust_id for r in results] == [1, 2, 3]

    def test_count(self, tmp_path):
        with self._tmp_repo(tmp_path) as repo:
            for i in range(1, 6):
                repo.create(_valid_customer(cust_id=i, ssn=200000000 + i))
            assert repo.count() == 5

    def test_duplicate_cust_id_raises(self, tmp_path):
        with self._tmp_repo(tmp_path) as repo:
            repo.create(_valid_customer(cust_id=1))
            with pytest.raises(sqlite3.IntegrityError):
                repo.create(_valid_customer(cust_id=1, ssn=999999999))


# ---------------------------------------------------------------------------
# CustomerService (AC4)
# ---------------------------------------------------------------------------

class TestCustomerService:
    def _svc(self, tmp_path):
        repo = CustomerRepository(str(tmp_path / "svc.db"))
        repo.open()
        return CustomerService(repo), repo

    def test_create_and_retrieve(self, tmp_path):
        svc, repo = self._svc(tmp_path)
        with repo:
            svc.create_customer(_valid_customer(cust_id=1))
            result = svc.get_by_id(1)
            assert result.last_name == "Doe"

    def test_create_invalid_raises(self, tmp_path):
        svc, repo = self._svc(tmp_path)
        with repo:
            with pytest.raises(ValidationError):
                svc.create_customer(_valid_customer(fico_credit_score=0))

    def test_create_duplicate_raises(self, tmp_path):
        svc, repo = self._svc(tmp_path)
        with repo:
            svc.create_customer(_valid_customer(cust_id=5))
            with pytest.raises(ValueError, match="already exists"):
                svc.create_customer(_valid_customer(cust_id=5, ssn=999999991))

    def test_update_customer(self, tmp_path):
        svc, repo = self._svc(tmp_path)
        with repo:
            c = _valid_customer(cust_id=10)
            svc.create_customer(c)
            c.fico_credit_score = 800
            svc.update_customer(c)
            assert svc.get_by_id(10).fico_credit_score == 800

    def test_get_by_ssn(self, tmp_path):
        svc, repo = self._svc(tmp_path)
        with repo:
            svc.create_customer(_valid_customer(cust_id=7, ssn=555000111))
            result = svc.get_by_ssn(555000111)
            assert result is not None
            assert result.cust_id == 7

    def test_get_nonexistent_returns_none(self, tmp_path):
        svc, repo = self._svc(tmp_path)
        with repo:
            assert svc.get_by_id(9999) is None


# ---------------------------------------------------------------------------
# run_migration (AC5)
# ---------------------------------------------------------------------------

class TestRunMigration:
    """Verify migration script against the real custdata.txt file."""

    _CUSTDATA = os.path.join(
        os.path.dirname(__file__), "..", "..", "data", "ASCII", "custdata.txt"
    )

    def test_migration_produces_report(self, tmp_path):
        stats = run_migration(
            input_path=self._CUSTDATA,
            output_path=str(tmp_path / "migrated.db"),
        )
        assert isinstance(stats, MigrationStats)
        assert stats.total_processed > 0
        assert stats.total_migrated > 0
        report = stats.report_lines()
        assert any("Total Records Processed" in line for line in report)
        assert any("Successfully Migrated" in line for line in report)
        assert any("Rejected" in line for line in report)

    def test_migration_zero_loss(self, tmp_path):
        """AC2: reconciliation count – no records should be silently dropped."""
        db_path = str(tmp_path / "migrated.db")
        stats = run_migration(
            input_path=self._CUSTDATA,
            output_path=db_path,
            skip_validation=True,  # count all records regardless of validity
        )
        assert stats.total_migrated + stats.total_rejected == stats.total_processed

    def test_migration_ssn_lookup_works(self, tmp_path):
        """AC2: SSN alt-index lookup on migrated data."""
        db_path = str(tmp_path / "migrated.db")
        run_migration(
            input_path=self._CUSTDATA,
            output_path=db_path,
            skip_validation=True,
        )
        with CustomerRepository(db_path) as repo:
            # First record in custdata.txt has SSN 020973888
            result = repo.read_by_ssn(20973888)
            assert result is not None

    def test_migration_skip_validation_migrates_all(self, tmp_path):
        """All records load when validation is skipped (zero rejections expected)."""
        db_path = str(tmp_path / "migrated.db")
        stats = run_migration(
            input_path=self._CUSTDATA,
            output_path=db_path,
            skip_validation=True,
        )
        assert stats.total_rejected == 0

    def test_missing_input_raises(self, tmp_path):
        with pytest.raises(RuntimeError, match="Cannot open input file"):
            run_migration(
                input_path="/nonexistent/path.txt",
                output_path=str(tmp_path / "out.db"),
            )
