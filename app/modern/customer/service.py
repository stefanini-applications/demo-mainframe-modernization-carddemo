from typing import Optional

from .model import Customer
from .repository import CustomerRepository
from .validator import CustomerValidator, ValidationError


class CustomerService:
    def __init__(self, repository: CustomerRepository) -> None:
        self._repo = repository
        self._validator = CustomerValidator()

    def create_customer(self, customer: Customer) -> None:
        self._validator.validate(customer)
        if self._repo.read_by_id(customer.cust_id) is not None:
            raise ValueError(f"Customer with cust_id={customer.cust_id} already exists")
        self._repo.create(customer)

    def update_customer(self, customer: Customer) -> None:
        self._validator.validate(customer)
        if not self._repo.update(customer):
            raise ValueError(f"Customer with cust_id={customer.cust_id} not found")

    def get_by_id(self, cust_id: int) -> Optional[Customer]:
        return self._repo.read_by_id(cust_id)

    def get_by_ssn(self, ssn: int) -> Optional[Customer]:
        return self._repo.read_by_ssn(ssn)
