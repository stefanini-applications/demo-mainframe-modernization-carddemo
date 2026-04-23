# Modern Customer Registration Module

Migration of the **Cadastro** (customer registration) module from COBOL/CICS/VSAM to Python + SQLite.

## Legacy components replaced

| Legacy | Modern |
|---|---|
| `CVCUS01Y.cpy` — CUSTOMER-RECORD (RECLN=500) | `customer/model.py` — `Customer` dataclass |
| `COACTUPC.cbl` — field validation paragraphs | `customer/validator.py` — `CustomerValidator` |
| CUSTFILE VSAM KSDS + SSN alt-index | `customer/repository.py` — `CustomerRepository` (SQLite) |
| CICS screen COACTVWC/COACTUPC R/W | `customer/service.py` — `CustomerService` |
| CBIMPORT/CBEXPORT batch migration | `customer/migration.py` — `run_migration()` |

## Validation rules (from `COACTUPC.cbl`)

| Field | Rule |
|---|---|
| `phone_num_1` / `phone_num_2` | `(NNN)NNN-NNNN` — optional; when supplied area code and prefix must be non-zero |
| `ssn` | 9-digit numeric, non-zero |
| `dob` | `YYYY-MM-DD`, must be in the past |
| `fico_credit_score` | Integer 300–850 (COACTUPC lines 848-849) |
| `first_name` / `last_name` | Required, alphabetic |
| `addr_line_1` | Required |
| `addr_state_cd` | Required, 2-char alpha |
| `addr_country_cd` | Required, 3-char alpha |
| `addr_zip` | Required, numeric |
| `eft_account_id` | Required, numeric |
| `pri_card_holder_ind` | `Y` or `N` |

## Running the migration

```bash
# From the repo root
python3 -m app.modern.customer.migration \
    --input  app/data/ASCII/custdata.txt \
    --output custfile.db \
    --report migration_report.txt
```

Exit code `0` = all records migrated; `1` = some records rejected (see report); `2` = I/O error.

## Running the tests

```bash
python3 -m pytest app/modern/tests/test_customer.py -v
```

## Data model (AC1)

All 19 fields from `CVCUS01Y.cpy` are preserved:

```
CUST-ID                  -> cust_id               int (9-digit PK)
CUST-FIRST-NAME          -> first_name            str (max 25)
CUST-MIDDLE-NAME         -> middle_name           str (max 25)
CUST-LAST-NAME           -> last_name             str (max 25)
CUST-ADDR-LINE-1         -> addr_line_1           str (max 50)
CUST-ADDR-LINE-2         -> addr_line_2           str (max 50)
CUST-ADDR-LINE-3         -> addr_line_3           str (max 50)
CUST-ADDR-STATE-CD       -> addr_state_cd         str (2)
CUST-ADDR-COUNTRY-CD     -> addr_country_cd       str (3)
CUST-ADDR-ZIP            -> addr_zip              str (max 10)
CUST-PHONE-NUM-1         -> phone_num_1           str (max 15)
CUST-PHONE-NUM-2         -> phone_num_2           str (max 15)
CUST-SSN                 -> ssn                   int (UNIQUE index)
CUST-GOVT-ISSUED-ID      -> govt_issued_id        str (max 20)
CUST-DOB-YYYY-MM-DD      -> dob                   str (YYYY-MM-DD)
CUST-EFT-ACCOUNT-ID      -> eft_account_id        str (max 10)
CUST-PRI-CARD-HOLDER-IND -> pri_card_holder_ind   str (Y/N)
CUST-FICO-CREDIT-SCORE   -> fico_credit_score     int (300-850)
```

> **Security note:** SSN is stored as a plain integer in this demo. A production
> deployment should encrypt or tokenise PII fields (SSN, DOB, govt_issued_id,
> eft_account_id) to address the known security gap in the legacy system.
