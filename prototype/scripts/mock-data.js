const mockData = {
  users: [
    { id: 'ADMIN001', firstName: 'Alice', lastName: 'Administrator', password: 'ADMIN001', type: 'A', typeLabel: 'Admin' },
    { id: 'ADMIN002', firstName: 'Bob', lastName: 'Manager', password: 'PASS0002', type: 'A', typeLabel: 'Admin' },
    { id: 'USER0001', firstName: 'Carol', lastName: 'Smith', password: 'PASS0001', type: 'U', typeLabel: 'User' },
    { id: 'USER0002', firstName: 'David', lastName: 'Johnson', password: 'PASS0002', type: 'U', typeLabel: 'User' },
    { id: 'USER0003', firstName: 'Emma', lastName: 'Williams', password: 'PASS0003', type: 'U', typeLabel: 'User' },
    { id: 'USER0004', firstName: 'Frank', lastName: 'Brown', password: 'PASS0004', type: 'U', typeLabel: 'User' },
    { id: 'USER0005', firstName: 'Grace', lastName: 'Jones', password: 'PASS0005', type: 'U', typeLabel: 'User' },
    { id: 'USER0006', firstName: 'Henry', lastName: 'Davis', password: 'PASS0006', type: 'U', typeLabel: 'User' },
    { id: 'USER0007', firstName: 'Iris', lastName: 'Miller', password: 'PASS0007', type: 'U', typeLabel: 'User' },
    { id: 'USER0008', firstName: 'Jack', lastName: 'Wilson', password: 'PASS0008', type: 'U', typeLabel: 'User' },
    { id: 'USER0009', firstName: 'Karen', lastName: 'Moore', password: 'PASS0009', type: 'U', typeLabel: 'User' },
    { id: 'USER0010', firstName: 'Leo', lastName: 'Taylor', password: 'PASS0010', type: 'U', typeLabel: 'User' },
    { id: 'USER0011', firstName: 'Mia', lastName: 'Anderson', password: 'PASS0011', type: 'U', typeLabel: 'User' },
    { id: 'USER0012', firstName: 'Noah', lastName: 'Thomas', password: 'PASS0012', type: 'U', typeLabel: 'User' },
    { id: 'USER0013', firstName: 'Olivia', lastName: 'Jackson', password: 'PASS0013', type: 'U', typeLabel: 'User' },
    { id: 'USER0014', firstName: 'Paul', lastName: 'White', password: 'PASS0014', type: 'U', typeLabel: 'User' },
    { id: 'USER0015', firstName: 'Quinn', lastName: 'Harris', password: 'PASS0015', type: 'U', typeLabel: 'User' },
    { id: 'USER0016', firstName: 'Rachel', lastName: 'Martin', password: 'PASS0016', type: 'U', typeLabel: 'User' },
    { id: 'USER0017', firstName: 'Sam', lastName: 'Garcia', password: 'PASS0017', type: 'U', typeLabel: 'User' },
    { id: 'USER0018', firstName: 'Tina', lastName: 'Martinez', password: 'PASS0018', type: 'U', typeLabel: 'User' },
    { id: 'USER0019', firstName: 'Uma', lastName: 'Robinson', password: 'PASS0019', type: 'U', typeLabel: 'User' },
    { id: 'USER0020', firstName: 'Victor', lastName: 'Clark', password: 'PASS0020', type: 'U', typeLabel: 'User' }
  ],
  accounts: [
    { id: '00000000001', customerId: '000000001', activeStatus: 'Y', currBal: 1250.75, creditLimit: 5000.00, cashCreditLimit: 1000.00, openDate: '2020-01-15', expirationDate: '2026-01-15', reissueDate: '2023-01-15', currCycCredit: 500.00, currCycDebit: 1750.75, addrZip: '10001', groupId: 'PREMIUM' },
    { id: '00000000002', customerId: '000000002', activeStatus: 'Y', currBal: 3420.50, creditLimit: 10000.00, cashCreditLimit: 2000.00, openDate: '2019-03-20', expirationDate: '2026-03-20', reissueDate: '2023-03-20', currCycCredit: 0.00, currCycDebit: 3420.50, addrZip: '90210', groupId: 'GOLD' },
    { id: '00000000003', customerId: '000000003', activeStatus: 'Y', currBal: 750.25, creditLimit: 2500.00, cashCreditLimit: 500.00, openDate: '2021-06-10', expirationDate: '2027-06-10', reissueDate: '2024-06-10', currCycCredit: 100.00, currCycDebit: 850.25, addrZip: '60601', groupId: 'STANDARD' },
    { id: '00000000004', customerId: '000000004', activeStatus: 'N', currBal: 0.00, creditLimit: 7500.00, cashCreditLimit: 1500.00, openDate: '2018-09-05', expirationDate: '2025-09-05', reissueDate: '2022-09-05', currCycCredit: 0.00, currCycDebit: 0.00, addrZip: '77001', groupId: 'GOLD' },
    { id: '00000000005', customerId: '000000005', activeStatus: 'Y', currBal: 8900.00, creditLimit: 15000.00, cashCreditLimit: 3000.00, openDate: '2017-11-12', expirationDate: '2025-11-12', reissueDate: '2022-11-12', currCycCredit: 200.00, currCycDebit: 9100.00, addrZip: '33101', groupId: 'PLATINUM' },
    { id: '00000000006', customerId: '000000006', activeStatus: 'Y', currBal: 245.80, creditLimit: 3000.00, cashCreditLimit: 600.00, openDate: '2022-02-28', expirationDate: '2028-02-28', reissueDate: '2025-02-28', currCycCredit: 50.00, currCycDebit: 295.80, addrZip: '98101', groupId: 'STANDARD' },
    { id: '00000000007', customerId: '000000007', activeStatus: 'Y', currBal: 5670.15, creditLimit: 8000.00, cashCreditLimit: 1600.00, openDate: '2020-07-22', expirationDate: '2026-07-22', reissueDate: '2023-07-22', currCycCredit: 0.00, currCycDebit: 5670.15, addrZip: '02101', groupId: 'GOLD' },
    { id: '00000000008', customerId: '000000008', activeStatus: 'Y', currBal: 1890.45, creditLimit: 4000.00, cashCreditLimit: 800.00, openDate: '2021-04-18', expirationDate: '2027-04-18', reissueDate: '2024-04-18', currCycCredit: 300.00, currCycDebit: 2190.45, addrZip: '30301', groupId: 'PREMIUM' },
    { id: '00000000009', customerId: '000000009', activeStatus: 'Y', currBal: 4230.60, creditLimit: 6000.00, cashCreditLimit: 1200.00, openDate: '2019-08-14', expirationDate: '2025-08-14', reissueDate: '2022-08-14', currCycCredit: 0.00, currCycDebit: 4230.60, addrZip: '48201', groupId: 'GOLD' },
    { id: '00000000010', customerId: '000000010', activeStatus: 'Y', currBal: 330.90, creditLimit: 1500.00, cashCreditLimit: 300.00, openDate: '2023-01-01', expirationDate: '2029-01-01', reissueDate: '2026-01-01', currCycCredit: 0.00, currCycDebit: 330.90, addrZip: '85001', groupId: 'STANDARD' },
    { id: '00000000011', customerId: '000000011', activeStatus: 'Y', currBal: 2100.00, creditLimit: 5000.00, cashCreditLimit: 1000.00, openDate: '2020-05-15', expirationDate: '2026-05-15', reissueDate: '2023-05-15', currCycCredit: 400.00, currCycDebit: 2500.00, addrZip: '19101', groupId: 'PREMIUM' },
    { id: '00000000012', customerId: '000000012', activeStatus: 'N', currBal: 0.00, creditLimit: 2000.00, cashCreditLimit: 400.00, openDate: '2016-12-01', expirationDate: '2023-12-01', reissueDate: '2020-12-01', currCycCredit: 0.00, currCycDebit: 0.00, addrZip: '80201', groupId: 'STANDARD' },
    { id: '00000000013', customerId: '000000013', activeStatus: 'Y', currBal: 7800.25, creditLimit: 12000.00, cashCreditLimit: 2400.00, openDate: '2018-06-30', expirationDate: '2025-06-30', reissueDate: '2022-06-30', currCycCredit: 100.00, currCycDebit: 7900.25, addrZip: '37201', groupId: 'PLATINUM' },
    { id: '00000000014', customerId: '000000014', activeStatus: 'Y', currBal: 980.55, creditLimit: 3500.00, cashCreditLimit: 700.00, openDate: '2022-09-09', expirationDate: '2028-09-09', reissueDate: '2025-09-09', currCycCredit: 200.00, currCycDebit: 1180.55, addrZip: '46201', groupId: 'GOLD' },
    { id: '00000000015', customerId: '000000015', activeStatus: 'Y', currBal: 3340.70, creditLimit: 6000.00, cashCreditLimit: 1200.00, openDate: '2019-02-14', expirationDate: '2026-02-14', reissueDate: '2023-02-14', currCycCredit: 0.00, currCycDebit: 3340.70, addrZip: '40201', groupId: 'GOLD' },
    { id: '00000000016', customerId: '000000016', activeStatus: 'Y', currBal: 150.00, creditLimit: 1000.00, cashCreditLimit: 200.00, openDate: '2023-11-01', expirationDate: '2029-11-01', reissueDate: '2026-11-01', currCycCredit: 0.00, currCycDebit: 150.00, addrZip: '64101', groupId: 'STANDARD' },
    { id: '00000000017', customerId: '000000017', activeStatus: 'Y', currBal: 6100.80, creditLimit: 10000.00, cashCreditLimit: 2000.00, openDate: '2017-04-20', expirationDate: '2025-04-20', reissueDate: '2022-04-20', currCycCredit: 500.00, currCycDebit: 6600.80, addrZip: '53201', groupId: 'PLATINUM' },
    { id: '00000000018', customerId: '000000018', activeStatus: 'Y', currBal: 2650.35, creditLimit: 5500.00, cashCreditLimit: 1100.00, openDate: '2020-10-10', expirationDate: '2026-10-10', reissueDate: '2023-10-10', currCycCredit: 0.00, currCycDebit: 2650.35, addrZip: '73101', groupId: 'PREMIUM' },
    { id: '00000000019', customerId: '000000019', activeStatus: 'Y', currBal: 4450.90, creditLimit: 7000.00, cashCreditLimit: 1400.00, openDate: '2018-03-25', expirationDate: '2025-03-25', reissueDate: '2022-03-25', currCycCredit: 250.00, currCycDebit: 4700.90, addrZip: '68101', groupId: 'GOLD' },
    { id: '00000000020', customerId: '000000020', activeStatus: 'Y', currBal: 875.15, creditLimit: 2500.00, cashCreditLimit: 500.00, openDate: '2022-07-04', expirationDate: '2028-07-04', reissueDate: '2025-07-04', currCycCredit: 75.00, currCycDebit: 950.15, addrZip: '99501', groupId: 'STANDARD' }
  ],
  customers: [
    { id: '000000001', firstName: 'Carol', middleName: 'A', lastName: 'Smith', addrLine1: '123 Main St', addrLine2: 'Apt 4B', addrLine3: '', addrState: 'NY', addrCountry: 'USA', addrZip: '10001', phone1: '(212)555-1234', phone2: '(212)555-5678', ssn: '123456789', govtId: 'DL123456789', dob: '1985-03-15', eftAccountId: 'EFT001', primaryCardHolder: 'Y', ficoScore: 750 },
    { id: '000000002', firstName: 'David', middleName: 'B', lastName: 'Johnson', addrLine1: '456 Sunset Blvd', addrLine2: '', addrLine3: '', addrState: 'CA', addrCountry: 'USA', addrZip: '90210', phone1: '(310)555-9876', phone2: '', ssn: '234567890', govtId: 'DL234567890', dob: '1978-07-22', eftAccountId: 'EFT002', primaryCardHolder: 'Y', ficoScore: 820 },
    { id: '000000003', firstName: 'Emma', middleName: '', lastName: 'Williams', addrLine1: '789 Lake Shore Dr', addrLine2: 'Suite 12', addrLine3: '', addrState: 'IL', addrCountry: 'USA', addrZip: '60601', phone1: '(312)555-4321', phone2: '(312)555-8765', ssn: '345678901', govtId: 'DL345678901', dob: '1992-11-30', eftAccountId: 'EFT003', primaryCardHolder: 'Y', ficoScore: 680 },
    { id: '000000004', firstName: 'Frank', middleName: 'C', lastName: 'Brown', addrLine1: '321 Texas Ave', addrLine2: '', addrLine3: '', addrState: 'TX', addrCountry: 'USA', addrZip: '77001', phone1: '(713)555-1111', phone2: '', ssn: '456789012', govtId: 'DL456789012', dob: '1965-05-10', eftAccountId: 'EFT004', primaryCardHolder: 'Y', ficoScore: 720 },
    { id: '000000005', firstName: 'Grace', middleName: 'D', lastName: 'Jones', addrLine1: '654 Ocean Dr', addrLine2: '', addrLine3: '', addrState: 'FL', addrCountry: 'USA', addrZip: '33101', phone1: '(305)555-2222', phone2: '(305)555-3333', ssn: '567890123', govtId: 'DL567890123', dob: '1973-09-18', eftAccountId: 'EFT005', primaryCardHolder: 'Y', ficoScore: 790 },
    { id: '000000006', firstName: 'Henry', middleName: '', lastName: 'Davis', addrLine1: '987 Pike St', addrLine2: '', addrLine3: '', addrState: 'WA', addrCountry: 'USA', addrZip: '98101', phone1: '(206)555-4444', phone2: '', ssn: '678901234', govtId: 'DL678901234', dob: '1990-01-25', eftAccountId: 'EFT006', primaryCardHolder: 'Y', ficoScore: 640 },
    { id: '000000007', firstName: 'Iris', middleName: 'E', lastName: 'Miller', addrLine1: '147 Beacon St', addrLine2: 'Unit 3', addrLine3: '', addrState: 'MA', addrCountry: 'USA', addrZip: '02101', phone1: '(617)555-5555', phone2: '', ssn: '789012345', govtId: 'DL789012345', dob: '1982-06-05', eftAccountId: 'EFT007', primaryCardHolder: 'Y', ficoScore: 770 },
    { id: '000000008', firstName: 'Jack', middleName: 'F', lastName: 'Wilson', addrLine1: '258 Peachtree St', addrLine2: '', addrLine3: '', addrState: 'GA', addrCountry: 'USA', addrZip: '30301', phone1: '(404)555-6666', phone2: '(404)555-7777', ssn: '890123456', govtId: 'DL890123456', dob: '1970-12-12', eftAccountId: 'EFT008', primaryCardHolder: 'Y', ficoScore: 800 },
    { id: '000000009', firstName: 'Karen', middleName: '', lastName: 'Moore', addrLine1: '369 Woodward Ave', addrLine2: '', addrLine3: '', addrState: 'MI', addrCountry: 'USA', addrZip: '48201', phone1: '(313)555-8888', phone2: '', ssn: '901234567', govtId: 'DL901234567', dob: '1987-04-08', eftAccountId: 'EFT009', primaryCardHolder: 'Y', ficoScore: 710 },
    { id: '000000010', firstName: 'Leo', middleName: 'G', lastName: 'Taylor', addrLine1: '741 Central Ave', addrLine2: '', addrLine3: '', addrState: 'AZ', addrCountry: 'USA', addrZip: '85001', phone1: '(602)555-9999', phone2: '', ssn: '012345678', govtId: 'DL012345678', dob: '1995-08-20', eftAccountId: 'EFT010', primaryCardHolder: 'Y', ficoScore: 620 },
    { id: '000000011', firstName: 'Mia', middleName: 'H', lastName: 'Anderson', addrLine1: '852 Market St', addrLine2: '', addrLine3: '', addrState: 'PA', addrCountry: 'USA', addrZip: '19101', phone1: '(215)555-1212', phone2: '', ssn: '111223344', govtId: 'DL111223344', dob: '1988-05-20', eftAccountId: 'EFT011', primaryCardHolder: 'Y', ficoScore: 760 },
    { id: '000000012', firstName: 'Noah', middleName: 'I', lastName: 'Thomas', addrLine1: '963 16th St', addrLine2: '', addrLine3: '', addrState: 'CO', addrCountry: 'USA', addrZip: '80201', phone1: '(720)555-2323', phone2: '', ssn: '222334455', govtId: 'DL222334455', dob: '1975-02-10', eftAccountId: 'EFT012', primaryCardHolder: 'Y', ficoScore: 580 },
    { id: '000000013', firstName: 'Olivia', middleName: 'J', lastName: 'Jackson', addrLine1: '174 Broadway', addrLine2: '', addrLine3: '', addrState: 'TN', addrCountry: 'USA', addrZip: '37201', phone1: '(615)555-3434', phone2: '', ssn: '333445566', govtId: 'DL333445566', dob: '1980-08-30', eftAccountId: 'EFT013', primaryCardHolder: 'Y', ficoScore: 810 },
    { id: '000000014', firstName: 'Paul', middleName: 'K', lastName: 'White', addrLine1: '285 Washington St', addrLine2: '', addrLine3: '', addrState: 'IN', addrCountry: 'USA', addrZip: '46201', phone1: '(317)555-4545', phone2: '', ssn: '444556677', govtId: 'DL444556677', dob: '1993-12-01', eftAccountId: 'EFT014', primaryCardHolder: 'Y', ficoScore: 695 },
    { id: '000000015', firstName: 'Quinn', middleName: 'L', lastName: 'Harris', addrLine1: '396 Fourth St', addrLine2: '', addrLine3: '', addrState: 'KY', addrCountry: 'USA', addrZip: '40201', phone1: '(502)555-5656', phone2: '', ssn: '555667788', govtId: 'DL555667788', dob: '1977-03-22', eftAccountId: 'EFT015', primaryCardHolder: 'Y', ficoScore: 745 },
    { id: '000000016', firstName: 'Rachel', middleName: 'M', lastName: 'Martin', addrLine1: '407 Oak St', addrLine2: '', addrLine3: '', addrState: 'MO', addrCountry: 'USA', addrZip: '64101', phone1: '(816)555-6767', phone2: '', ssn: '666778899', govtId: 'DL666778899', dob: '1997-07-07', eftAccountId: 'EFT016', primaryCardHolder: 'Y', ficoScore: 610 },
    { id: '000000017', firstName: 'Sam', middleName: 'N', lastName: 'Garcia', addrLine1: '518 Pine Ave', addrLine2: '', addrLine3: '', addrState: 'WI', addrCountry: 'USA', addrZip: '53201', phone1: '(414)555-7878', phone2: '', ssn: '777889900', govtId: 'DL777889900', dob: '1972-10-15', eftAccountId: 'EFT017', primaryCardHolder: 'Y', ficoScore: 798 },
    { id: '000000018', firstName: 'Tina', middleName: 'O', lastName: 'Martinez', addrLine1: '629 Elm St', addrLine2: '', addrLine3: '', addrState: 'OK', addrCountry: 'USA', addrZip: '73101', phone1: '(405)555-8989', phone2: '', ssn: '888990011', govtId: 'DL888990011', dob: '1984-01-28', eftAccountId: 'EFT018', primaryCardHolder: 'Y', ficoScore: 726 },
    { id: '000000019', firstName: 'Uma', middleName: 'P', lastName: 'Robinson', addrLine1: '730 Maple Rd', addrLine2: '', addrLine3: '', addrState: 'NE', addrCountry: 'USA', addrZip: '68101', phone1: '(402)555-9090', phone2: '', ssn: '999001122', govtId: 'DL999001122', dob: '1969-06-14', eftAccountId: 'EFT019', primaryCardHolder: 'Y', ficoScore: 755 },
    { id: '000000020', firstName: 'Victor', middleName: 'Q', lastName: 'Clark', addrLine1: '841 Birch Ln', addrLine2: '', addrLine3: '', addrState: 'AK', addrCountry: 'USA', addrZip: '99501', phone1: '(907)555-0101', phone2: '', ssn: '100112233', govtId: 'DL100112233', dob: '1991-11-11', eftAccountId: 'EFT020', primaryCardHolder: 'Y', ficoScore: 663 }
  ],
  creditCards: [
    { id: '4111111111111001', acctId: '00000000001', cvv: 123, embossedName: 'CAROL A SMITH', expirationDate: '2026-01-31', activeStatus: 'Y' },
    { id: '4111111111111002', acctId: '00000000002', cvv: 456, embossedName: 'DAVID B JOHNSON', expirationDate: '2026-03-31', activeStatus: 'Y' },
    { id: '4111111111111003', acctId: '00000000003', cvv: 789, embossedName: 'EMMA WILLIAMS', expirationDate: '2027-06-30', activeStatus: 'Y' },
    { id: '4111111111111004', acctId: '00000000004', cvv: 321, embossedName: 'FRANK C BROWN', expirationDate: '2025-09-30', activeStatus: 'N' },
    { id: '4111111111111005', acctId: '00000000005', cvv: 654, embossedName: 'GRACE D JONES', expirationDate: '2025-11-30', activeStatus: 'Y' },
    { id: '5111111111111006', acctId: '00000000005', cvv: 987, embossedName: 'GRACE D JONES', expirationDate: '2025-11-30', activeStatus: 'Y' },
    { id: '4111111111111007', acctId: '00000000006', cvv: 111, embossedName: 'HENRY DAVIS', expirationDate: '2028-02-28', activeStatus: 'Y' },
    { id: '4111111111111008', acctId: '00000000007', cvv: 222, embossedName: 'IRIS E MILLER', expirationDate: '2026-07-31', activeStatus: 'Y' },
    { id: '4111111111111009', acctId: '00000000008', cvv: 333, embossedName: 'JACK F WILSON', expirationDate: '2027-04-30', activeStatus: 'Y' },
    { id: '4111111111111010', acctId: '00000000009', cvv: 444, embossedName: 'KAREN MOORE', expirationDate: '2025-08-31', activeStatus: 'Y' },
    { id: '4111111111111011', acctId: '00000000010', cvv: 555, embossedName: 'LEO G TAYLOR', expirationDate: '2029-01-31', activeStatus: 'Y' },
    { id: '4111111111111012', acctId: '00000000011', cvv: 666, embossedName: 'MIA ANDERSON', expirationDate: '2026-05-31', activeStatus: 'Y' },
    { id: '4111111111111013', acctId: '00000000012', cvv: 777, embossedName: 'NOAH THOMAS', expirationDate: '2023-12-31', activeStatus: 'N' },
    { id: '4111111111111014', acctId: '00000000013', cvv: 888, embossedName: 'OLIVIA JACKSON', expirationDate: '2025-06-30', activeStatus: 'Y' },
    { id: '4111111111111015', acctId: '00000000014', cvv: 999, embossedName: 'PAUL WHITE', expirationDate: '2028-09-30', activeStatus: 'Y' },
    { id: '4111111111111016', acctId: '00000000015', cvv: 147, embossedName: 'QUINN HARRIS', expirationDate: '2026-02-28', activeStatus: 'Y' },
    { id: '4111111111111017', acctId: '00000000016', cvv: 258, embossedName: 'RACHEL MARTIN', expirationDate: '2029-11-30', activeStatus: 'Y' },
    { id: '4111111111111018', acctId: '00000000017', cvv: 369, embossedName: 'SAM GARCIA', expirationDate: '2025-04-30', activeStatus: 'Y' },
    { id: '4111111111111019', acctId: '00000000018', cvv: 741, embossedName: 'TINA MARTINEZ', expirationDate: '2026-10-31', activeStatus: 'Y' },
    { id: '4111111111111020', acctId: '00000000019', cvv: 852, embossedName: 'UMA ROBINSON', expirationDate: '2025-03-31', activeStatus: 'Y' },
    { id: '4111111111111021', acctId: '00000000020', cvv: 963, embossedName: 'VICTOR CLARK', expirationDate: '2028-07-31', activeStatus: 'Y' }
  ],
  transactions: [
    { id: '0000000000000001', typeCode: '01', catCode: '0001', source: 'POS TERM', desc: 'AMAZON.COM PURCHASE', amount: -125.99, merchantId: 123456789, merchantName: 'Amazon.com', merchantCity: 'Seattle', merchantZip: '98101', cardNum: '4111111111111001', origTs: '2026-04-01 10:23:45.000000', procTs: '2026-04-01 10:23:45.000000' },
    { id: '0000000000000002', typeCode: '01', catCode: '0002', source: 'POS TERM', desc: 'WALMART PURCHASE', amount: -87.45, merchantId: 234567890, merchantName: 'Walmart', merchantCity: 'Bentonville', merchantZip: '72712', cardNum: '4111111111111001', origTs: '2026-04-02 14:30:00.000000', procTs: '2026-04-02 14:30:00.000000' },
    { id: '0000000000000003', typeCode: '02', catCode: '0002', source: 'POS TERM', desc: 'BILL PAYMENT - ONLINE', amount: 500.00, merchantId: 999999999, merchantName: 'BILL PAYMENT', merchantCity: 'N/A', merchantZip: 'N/A', cardNum: '4111111111111001', origTs: '2026-04-03 09:00:00.000000', procTs: '2026-04-03 09:00:00.000000' },
    { id: '0000000000000004', typeCode: '01', catCode: '0003', source: 'ONLINE', desc: 'NETFLIX SUBSCRIPTION', amount: -15.99, merchantId: 345678901, merchantName: 'Netflix', merchantCity: 'Los Gatos', merchantZip: '95032', cardNum: '4111111111111002', origTs: '2026-04-01 00:00:01.000000', procTs: '2026-04-01 00:00:01.000000' },
    { id: '0000000000000005', typeCode: '01', catCode: '0001', source: 'POS TERM', desc: 'TARGET PURCHASE', amount: -234.56, merchantId: 456789012, merchantName: 'Target', merchantCity: 'Minneapolis', merchantZip: '55403', cardNum: '4111111111111002', origTs: '2026-04-03 16:45:00.000000', procTs: '2026-04-03 16:45:00.000000' },
    { id: '0000000000000006', typeCode: '01', catCode: '0004', source: 'POS TERM', desc: 'SHELL GAS STATION', amount: -65.80, merchantId: 567890123, merchantName: 'Shell', merchantCity: 'Houston', merchantZip: '77001', cardNum: '4111111111111003', origTs: '2026-04-04 08:15:00.000000', procTs: '2026-04-04 08:15:00.000000' },
    { id: '0000000000000007', typeCode: '01', catCode: '0005', source: 'POS TERM', desc: 'MCDONALDS RESTAURANT', amount: -12.50, merchantId: 678901234, merchantName: 'McDonalds', merchantCity: 'Chicago', merchantZip: '60601', cardNum: '4111111111111003', origTs: '2026-04-04 12:30:00.000000', procTs: '2026-04-04 12:30:00.000000' },
    { id: '0000000000000008', typeCode: '03', catCode: '0001', source: 'ONLINE', desc: 'AMAZON RETURN CREDIT', amount: 45.99, merchantId: 123456789, merchantName: 'Amazon.com', merchantCity: 'Seattle', merchantZip: '98101', cardNum: '4111111111111005', origTs: '2026-04-05 11:00:00.000000', procTs: '2026-04-05 11:00:00.000000' },
    { id: '0000000000000009', typeCode: '01', catCode: '0006', source: 'POS TERM', desc: 'CVS PHARMACY', amount: -38.75, merchantId: 789012345, merchantName: 'CVS Pharmacy', merchantCity: 'Woonsocket', merchantZip: '02895', cardNum: '4111111111111005', origTs: '2026-04-05 15:00:00.000000', procTs: '2026-04-05 15:00:00.000000' },
    { id: '0000000000000010', typeCode: '01', catCode: '0001', source: 'POS TERM', desc: 'BEST BUY ELECTRONICS', amount: -899.99, merchantId: 890123456, merchantName: 'Best Buy', merchantCity: 'Richfield', merchantZip: '55423', cardNum: '4111111111111008', origTs: '2026-04-06 13:00:00.000000', procTs: '2026-04-06 13:00:00.000000' },
    { id: '0000000000000011', typeCode: '01', catCode: '0002', source: 'POS TERM', desc: 'WHOLE FOODS MARKET', amount: -156.40, merchantId: 901234567, merchantName: 'Whole Foods', merchantCity: 'Austin', merchantZip: '78701', cardNum: '4111111111111008', origTs: '2026-04-07 10:00:00.000000', procTs: '2026-04-07 10:00:00.000000' },
    { id: '0000000000000012', typeCode: '02', catCode: '0002', source: 'POS TERM', desc: 'BILL PAYMENT - ONLINE', amount: 300.00, merchantId: 999999999, merchantName: 'BILL PAYMENT', merchantCity: 'N/A', merchantZip: 'N/A', cardNum: '4111111111111008', origTs: '2026-04-08 09:00:00.000000', procTs: '2026-04-08 09:00:00.000000' },
    { id: '0000000000000013', typeCode: '01', catCode: '0007', source: 'ONLINE', desc: 'AMERICAN AIRLINES', amount: -450.00, merchantId: 112233445, merchantName: 'American Airlines', merchantCity: 'Fort Worth', merchantZip: '76101', cardNum: '4111111111111014', origTs: '2026-04-08 14:00:00.000000', procTs: '2026-04-08 14:00:00.000000' },
    { id: '0000000000000014', typeCode: '01', catCode: '0008', source: 'POS TERM', desc: 'HILTON HOTELS', amount: -320.00, merchantId: 223344556, merchantName: 'Hilton Hotels', merchantCity: 'McLean', merchantZip: '22102', cardNum: '4111111111111014', origTs: '2026-04-09 15:00:00.000000', procTs: '2026-04-09 15:00:00.000000' },
    { id: '0000000000000015', typeCode: '01', catCode: '0003', source: 'ONLINE', desc: 'SPOTIFY SUBSCRIPTION', amount: -9.99, merchantId: 334455667, merchantName: 'Spotify', merchantCity: 'New York', merchantZip: '10001', cardNum: '4111111111111015', origTs: '2026-04-09 00:00:01.000000', procTs: '2026-04-09 00:00:01.000000' },
    { id: '0000000000000016', typeCode: '01', catCode: '0001', source: 'POS TERM', desc: 'HOME DEPOT', amount: -278.50, merchantId: 445566778, merchantName: 'Home Depot', merchantCity: 'Atlanta', merchantZip: '30301', cardNum: '4111111111111018', origTs: '2026-04-10 09:30:00.000000', procTs: '2026-04-10 09:30:00.000000' },
    { id: '0000000000000017', typeCode: '03', catCode: '0001', source: 'POS TERM', desc: 'HOME DEPOT RETURN', amount: 55.00, merchantId: 445566778, merchantName: 'Home Depot', merchantCity: 'Atlanta', merchantZip: '30301', cardNum: '4111111111111018', origTs: '2026-04-11 10:00:00.000000', procTs: '2026-04-11 10:00:00.000000' },
    { id: '0000000000000018', typeCode: '01', catCode: '0002', source: 'POS TERM', desc: 'COSTCO WHOLESALE', amount: -345.60, merchantId: 556677889, merchantName: 'Costco', merchantCity: 'Issaquah', merchantZip: '98027', cardNum: '4111111111111019', origTs: '2026-04-11 11:00:00.000000', procTs: '2026-04-11 11:00:00.000000' },
    { id: '0000000000000019', typeCode: '01', catCode: '0004', source: 'POS TERM', desc: 'EXXON GAS STATION', amount: -72.00, merchantId: 667788990, merchantName: 'ExxonMobil', merchantCity: 'Irving', merchantZip: '75039', cardNum: '4111111111111020', origTs: '2026-04-12 07:45:00.000000', procTs: '2026-04-12 07:45:00.000000' },
    { id: '0000000000000020', typeCode: '02', catCode: '0002', source: 'POS TERM', desc: 'BILL PAYMENT - ONLINE', amount: 250.00, merchantId: 999999999, merchantName: 'BILL PAYMENT', merchantCity: 'N/A', merchantZip: 'N/A', cardNum: '4111111111111020', origTs: '2026-04-12 09:00:00.000000', procTs: '2026-04-12 09:00:00.000000' },
    { id: '0000000000000021', typeCode: '01', catCode: '0005', source: 'POS TERM', desc: 'STARBUCKS COFFEE', amount: -8.75, merchantId: 778899001, merchantName: 'Starbucks', merchantCity: 'Seattle', merchantZip: '98101', cardNum: '4111111111111021', origTs: '2026-04-13 08:00:00.000000', procTs: '2026-04-13 08:00:00.000000' },
    { id: '0000000000000022', typeCode: '01', catCode: '0001', source: 'ONLINE', desc: 'APPLE STORE PURCHASE', amount: -1299.00, merchantId: 889900112, merchantName: 'Apple Store', merchantCity: 'Cupertino', merchantZip: '95014', cardNum: '4111111111111005', origTs: '2026-04-13 14:00:00.000000', procTs: '2026-04-13 14:00:00.000000' }
  ],
  payments: [
    { id: 'PAY001', acctId: '00000000001', amount: 500.00, tranId: '0000000000000003', date: '2026-04-03', status: 'Posted', confirmedBy: 'USER0001' },
    { id: 'PAY002', acctId: '00000000008', amount: 300.00, tranId: '0000000000000012', date: '2026-04-08', status: 'Posted', confirmedBy: 'USER0008' },
    { id: 'PAY003', acctId: '00000000020', amount: 250.00, tranId: '0000000000000020', date: '2026-04-12', status: 'Posted', confirmedBy: 'USER0020' },
    { id: 'PAY004', acctId: '00000000002', amount: 3420.50, tranId: '0000000000000023', date: '2026-04-14', status: 'Pending', confirmedBy: 'USER0002' },
    { id: 'PAY005', acctId: '00000000009', amount: 4230.60, tranId: '0000000000000024', date: '2026-04-15', status: 'Posted', confirmedBy: 'USER0009' }
  ],
  reports: [
    { id: 'RPT001', type: 'Monthly', startDate: '2026-03-01', endDate: '2026-03-31', status: 'Completed', jobId: 'TRANREPT1', submittedBy: 'ADMIN001', submittedAt: '2026-04-01 06:00:00', outputFile: 'TRANREPT.G001V00' },
    { id: 'RPT002', type: 'Yearly', startDate: '2025-01-01', endDate: '2025-12-31', status: 'Completed', jobId: 'TRANREPT2', submittedBy: 'ADMIN001', submittedAt: '2026-01-02 07:00:00', outputFile: 'TRANREPT.G002V00' },
    { id: 'RPT003', type: 'Custom', startDate: '2026-01-01', endDate: '2026-04-14', status: 'Running', jobId: 'TRANREPT3', submittedBy: 'ADMIN002', submittedAt: '2026-04-14 08:00:00', outputFile: '' },
    { id: 'RPT004', type: 'Monthly', startDate: '2026-02-01', endDate: '2026-02-28', status: 'Completed', jobId: 'TRANREPT4', submittedBy: 'ADMIN001', submittedAt: '2026-03-01 06:00:00', outputFile: 'TRANREPT.G003V00' },
    { id: 'RPT005', type: 'Custom', startDate: '2026-04-01', endDate: '2026-04-10', status: 'Failed', jobId: 'TRANREPT5', submittedBy: 'ADMIN002', submittedAt: '2026-04-11 05:00:00', outputFile: '' }
  ],
  batchJobs: [
    { id: 'JOB001', name: 'POSTTRAN', program: 'CBTRN02C', function: 'Post daily transactions', lastRun: '2026-04-13 23:30:00', nextRun: '2026-04-14 23:30:00', status: 'Completed', rc: 0, records: 2500, rejects: 0 },
    { id: 'JOB002', name: 'INTCALC', program: 'CBACT04C', function: 'Monthly interest calculation', lastRun: '2026-04-01 02:00:00', nextRun: '2026-05-01 02:00:00', status: 'Completed', rc: 0, records: 10000, rejects: 0 },
    { id: 'JOB003', name: 'CREASTMT', program: 'CBSTM03A', function: 'Generate account statements', lastRun: '2026-04-01 04:00:00', nextRun: '2026-05-01 04:00:00', status: 'Completed', rc: 0, records: 20, rejects: 0 },
    { id: 'JOB004', name: 'TRANREPT', program: 'CBTRN03C', function: 'Transaction detail report', lastRun: '2026-04-14 08:00:00', nextRun: '2026-04-15 08:00:00', status: 'Running', rc: null, records: null, rejects: null },
    { id: 'JOB005', name: 'COMBTRAN', program: 'CBTRN02C', function: 'Combine transaction files', lastRun: '2026-04-01 03:00:00', nextRun: '2026-05-01 03:00:00', status: 'Completed', rc: 0, records: 5000, rejects: 0 },
    { id: 'JOB006', name: 'CBIMPORT', program: 'CBIMPORT', function: 'Import branch migration data', lastRun: '2026-01-15 01:00:00', nextRun: 'Manual', status: 'Completed', rc: 0, records: 8500, rejects: 12 },
    { id: 'JOB007', name: 'CBEXPORT', program: 'CBEXPORT', function: 'Export for branch migration', lastRun: '2026-04-10 23:00:00', nextRun: 'Manual', status: 'Completed', rc: 0, records: 8512, rejects: 0 },
    { id: 'JOB008', name: 'CLOSEFIL', program: 'SDSF', function: 'Close CICS VSAM files', lastRun: '2026-04-13 23:00:00', nextRun: '2026-04-14 23:00:00', status: 'Completed', rc: 0, records: null, rejects: null },
    { id: 'JOB009', name: 'OPENFIL', program: 'SDSF', function: 'Open CICS VSAM files', lastRun: '2026-04-14 00:30:00', nextRun: '2026-04-15 00:30:00', status: 'Completed', rc: 0, records: null, rejects: null },
    { id: 'JOB010', name: 'WAITSTEP', program: 'COBSWAIT', function: 'Delay between batch steps', lastRun: '2026-04-13 23:15:00', nextRun: '2026-04-14 23:15:00', status: 'Completed', rc: 0, records: null, rejects: null }
  ],
  authorizations: [
    { id: 'AUTH0001', cardNum: '4111111111111001', acctId: '00000000001', authType: 'AUTH', amount: 125.99, approvedAmount: 125.99, respCode: '00', respReason: 'APPROVED', merchantId: '123456789', merchantName: 'Amazon.com', matchStatus: 'M', fraud: 'N', authDate: '2026-04-01', authTime: '10:23:45', expiryDate: '2601' },
    { id: 'AUTH0002', cardNum: '4111111111111002', acctId: '00000000002', authType: 'AUTH', amount: 234.56, approvedAmount: 234.56, respCode: '00', respReason: 'APPROVED', merchantId: '456789012', merchantName: 'Target', matchStatus: 'M', fraud: 'N', authDate: '2026-04-03', authTime: '16:45:00', expiryDate: '2603' },
    { id: 'AUTH0003', cardNum: '4111111111111004', acctId: '00000000004', authType: 'AUTH', amount: 500.00, approvedAmount: 0.00, respCode: '05', respReason: 'ACCOUNT-CLOSED', merchantId: '567890123', merchantName: 'Target', matchStatus: 'D', fraud: 'N', authDate: '2026-04-05', authTime: '09:00:00', expiryDate: '2509' },
    { id: 'AUTH0004', cardNum: '4111111111111005', acctId: '00000000005', authType: 'AUTH', amount: 1299.00, approvedAmount: 1299.00, respCode: '00', respReason: 'APPROVED', merchantId: '889900112', merchantName: 'Apple Store', matchStatus: 'P', fraud: 'N', authDate: '2026-04-13', authTime: '14:00:00', expiryDate: '2511' },
    { id: 'AUTH0005', cardNum: '4111111111111014', acctId: '00000000013', authType: 'AUTH', amount: 450.00, approvedAmount: 450.00, respCode: '00', respReason: 'APPROVED', merchantId: '112233445', merchantName: 'American Airlines', matchStatus: 'M', fraud: 'N', authDate: '2026-04-08', authTime: '14:00:00', expiryDate: '2506' },
    { id: 'AUTH0006', cardNum: '4111111111111018', acctId: '00000000017', authType: 'AUTH', amount: 8500.00, approvedAmount: 0.00, respCode: '51', respReason: 'INSUFFICIENT-FUND', merchantId: '999111222', merchantName: 'Luxury Cars LLC', matchStatus: 'D', fraud: 'F', authDate: '2026-04-12', authTime: '20:00:00', expiryDate: '2504' },
    { id: 'AUTH0007', cardNum: '4111111111111008', acctId: '00000000007', authType: 'AUTH', amount: 156.40, approvedAmount: 156.40, respCode: '00', respReason: 'APPROVED', merchantId: '901234567', merchantName: 'Whole Foods', matchStatus: 'M', fraud: 'N', authDate: '2026-04-07', authTime: '10:00:00', expiryDate: '2607' },
    { id: 'AUTH0008', cardNum: '4111111111111021', acctId: '00000000020', authType: 'AUTH', amount: 8.75, approvedAmount: 8.75, respCode: '00', respReason: 'APPROVED', merchantId: '778899001', merchantName: 'Starbucks', matchStatus: 'P', fraud: 'N', authDate: '2026-04-13', authTime: '08:00:00', expiryDate: '2807' }
  ],
  transactionTypes: [
    { code: '01', description: 'PURCHASE', categories: [{code:'0001',desc:'General Merchandise'},{code:'0002',desc:'Grocery/Food'},{code:'0003',desc:'Digital/Subscriptions'},{code:'0004',desc:'Gas/Fuel'},{code:'0005',desc:'Dining/Restaurant'},{code:'0006',desc:'Healthcare/Pharmacy'},{code:'0007',desc:'Travel/Airline'},{code:'0008',desc:'Lodging/Hotel'}] },
    { code: '02', description: 'PAYMENT', categories: [{code:'0001',desc:'Full Balance Payment'},{code:'0002',desc:'Online Payment'}] },
    { code: '03', description: 'CREDIT', categories: [{code:'0001',desc:'Merchandise Return'},{code:'0002',desc:'Billing Adjustment'}] },
    { code: '04', description: 'AUTHORIZATION', categories: [{code:'0001',desc:'Pre-Authorization'},{code:'0002',desc:'Incremental Auth'}] },
    { code: '05', description: 'REFUND', categories: [{code:'0001',desc:'Merchant Refund'},{code:'0002',desc:'System Refund'}] },
    { code: '06', description: 'REVERSAL', categories: [{code:'0001',desc:'Auth Reversal'},{code:'0002',desc:'Post Reversal'}] },
    { code: '07', description: 'ADJUSTMENT', categories: [{code:'0001',desc:'Fee Adjustment'},{code:'0002',desc:'Interest Adjustment'},{code:'0003',desc:'Statement Adjustment'}] }
  ],
  currentUser: null
};

// Normalize data on load: add computed/alias fields for UI compatibility
(function normalizeMockData() {
  // cards alias (creditCards with cardNum field)
  mockData.cards = mockData.creditCards.map(c => Object.assign({}, c, { cardNum: c.id, currentBal: (mockData.accounts.find(a => a.id === c.acctId) || {}).currBal || 0 }));

  // normalize reports: add period, generated, records
  mockData.reports = mockData.reports.map(r => Object.assign({ period: r.startDate + ' to ' + r.endDate, generated: (r.submittedAt || '').split(' ')[0] || r.startDate, records: r.records || Math.floor(Math.random() * 200) + 20 }, r));

  // normalize batchJobs: jobName, startTime, duration, rc as string
  mockData.batchJobs = mockData.batchJobs.map(j => Object.assign({ jobName: j.name || j.jobName, startTime: j.lastRun || j.startTime, duration: j.duration || '00:00:45', rc: j.rc != null ? String(j.rc).padStart(4, '0') : '', parameter: j.parameter || new Date().toISOString().split('T')[0].replace(/-/g,''), steps: j.steps || ['INIT','EXECUTE','FINALIZE'] }, j));

  // normalize authorizations: status, responseCode, responseMsg, timestamp, fraudFlag
  mockData.authorizations = mockData.authorizations.map(a => Object.assign({ status: a.respCode === '00' ? 'Approved' : 'Declined', responseCode: a.respCode, responseMsg: a.respReason, timestamp: (a.authDate || '') + ' ' + (a.authTime || ''), merchantCity: a.merchantCity || 'N/A', fraudFlag: a.fraud === 'F' }, a));

  // normalize payments: transactionId, method
  mockData.payments = mockData.payments.map(p => Object.assign({ transactionId: p.tranId || p.transactionId, method: p.method || 'Online' }, p));

  // normalize transactionTypes: add id, fix categories description field
  mockData.transactionTypes = mockData.transactionTypes.map(t => Object.assign({ id: t.id || ('TT' + t.code), categories: (t.categories || []).map(c => ({ code: c.code, description: c.description || c.desc || '' })) }, t));
})();

function getData(type) { return mockData[type] ? [...mockData[type]] : []; }
function getById(type, id) { const items = mockData[type] || []; return items.find(item => item.id === id || item.id === String(id)) || null; }
function createItem(type, item) { if (!mockData[type]) mockData[type] = []; mockData[type].push(item); return item; }
function updateItem(type, id, updates) { const items = mockData[type] || []; const idx = items.findIndex(item => item.id === id || item.id === String(id)); if (idx !== -1) { mockData[type][idx] = { ...items[idx], ...updates }; return mockData[type][idx]; } return null; }
function deleteItem(type, id) { const items = mockData[type] || []; const idx = items.findIndex(item => item.id === id || item.id === String(id)); if (idx !== -1) { mockData[type].splice(idx, 1); return true; } return false; }
function paginate(items, page, perPage) { const start = (page - 1) * perPage; return { items: items.slice(start, start + perPage), total: items.length, page, perPage, totalPages: Math.ceil(items.length / perPage) }; }
function filterItems(items, query, fields) { if (!query) return items; const q = query.toLowerCase(); return items.filter(item => fields.some(f => String(item[f] || '').toLowerCase().includes(q))); }