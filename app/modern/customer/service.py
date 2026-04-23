"""
Customer service layer.

Combines validation (CustomerValidator) with persistence (CustomerRepository)
to provide the same create / read / update semantics that the legacy
COACTUPC / COACTVWC CICS programs exposed through BMS screens.
"""
from typing import Optional

from .model import Customer
from .repository import CustomerRepository
from .validator import CustomerValidator, ValidationError


class CustomerService:
    """Business-logic facade for customer registration operations."""

    def __init__(self, repository: CustomerRepository) -> None:
        self._repo = repository
        self._validator = CustomerValidator()

    # ------------------------------------------------------------------
    # Write operations
    # ------------------------------------------------------------------

    def create_customer(self, customer: Customer) -> None:
        """Validate then persist a new customer.

        Raises :exc:`ValidationError` if any field is invalid.
        Raises :exc:`ValueError` if the cust_id already exists.
        """
        self._validator.validate(customer)
        if self._repo.read_by_id(customer.cust_id) is not None:
            raise ValueError(f"Customer with cust_id={customer.cust_id} already exists")
        self._repo.create(customer)

    def update_customer(self, customer: Customer) -> None:
        """Validate then update an existing customer.

        Raises :exc:`ValidationError` if any field is invalid.
        Raises :exc:`ValueError` if the cust_id does not exist.
        """
        self._validator.validate(customer)
        if not self._repo.update(customer):
            raise ValueError(f"Customer with cust_id={customer.cust_id} not found")

    # ------------------------------------------------------------------
    # Read operations
    # ------------------------------------------------------------------

    def get_by_id(self, cust_id: int) -> Optional[Customer]:
        """Retrieve a customer by primary key."""
        return self._repo.read_by_id(cust_id)

    def get_by_ssn(self, ssn: int) -> Optional[Customer]:
        """Retrieve a customer via the SSN alternate index."""
        return self._repo.read_by_ssn(ssn)
