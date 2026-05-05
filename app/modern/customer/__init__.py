"""
Modern Customer Registration Module
Migrated from COBOL/CICS/VSAM (CBCUS01C, COACTUPC, CVCUS01Y)
"""
from .model import Customer
from .validator import CustomerValidator, ValidationError
from .repository import CustomerRepository
from .service import CustomerService

__all__ = ["Customer", "CustomerValidator", "ValidationError",
           "CustomerRepository", "CustomerService"]
