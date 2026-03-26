# Module File Map

<!-- MODULE_FILE_MAP_START -->
app/cbl/COSGN00C.cbl = authentication
app/bms/COSGN00.bms = authentication
app/cpy/CSUSR01Y.cpy = authentication, user-management
app/cpy/COCOM01Y.cpy = authentication, accounts, credit-cards, transactions, billing, reports, user-management

app/cbl/COACTVWC.cbl = accounts
app/cbl/COACTUPC.cbl = accounts
app/cbl/CBACT01C.cbl = accounts, batch-processing
app/cbl/CBACT02C.cbl = accounts, batch-processing
app/cbl/CBACT03C.cbl = accounts, batch-processing
app/cbl/CBACT04C.cbl = accounts, batch-processing
app/bms/COACTVW.bms = accounts
app/bms/COACTUP.bms = accounts
app/cpy/CVACT01Y.cpy = accounts
app/cpy/CVACT02Y.cpy = accounts, credit-cards
app/cpy/CVACT03Y.cpy = accounts, credit-cards

app/cbl/COCRDLIC.cbl = credit-cards
app/cbl/COCRDSLC.cbl = credit-cards
app/cbl/COCRDUPC.cbl = credit-cards
app/bms/COCRDLI.bms = credit-cards
app/bms/COCRDSL.bms = credit-cards
app/bms/COCRDUP.bms = credit-cards
app/cpy/CVCRD01Y.cpy = credit-cards

app/cbl/COTRN00C.cbl = transactions
app/cbl/COTRN01C.cbl = transactions
app/cbl/COTRN02C.cbl = transactions
app/cbl/CBTRN01C.cbl = transactions, batch-processing
app/cbl/CBTRN02C.cbl = transactions, batch-processing
app/cbl/CBTRN03C.cbl = transactions, reports, batch-processing
app/cbl/CBSTM03A.CBL = transactions, reports, batch-processing
app/cbl/CBSTM03B.CBL = transactions, reports, batch-processing
app/bms/COTRN00.bms = transactions
app/bms/COTRN01.bms = transactions
app/bms/COTRN02.bms = transactions
app/cpy/CVTRA05Y.cpy = transactions
app/cpy/CVTRA01Y.cpy = transactions, accounts
app/cpy/CVTRA02Y.cpy = transactions, accounts
app/cpy/CVTRA03Y.cpy = transactions
app/cpy/CVTRA04Y.cpy = transactions
app/cpy/CVTRA06Y.cpy = transactions
app/cpy/CVTRA07Y.cpy = transactions, reports

app/cbl/COBIL00C.cbl = billing
app/bms/COBIL00.bms = billing

app/cbl/CORPT00C.cbl = reports
app/bms/CORPT00.bms = reports

app/cbl/COADM01C.cbl = user-management
app/cbl/COUSR00C.cbl = user-management
app/cbl/COUSR01C.cbl = user-management
app/cbl/COUSR02C.cbl = user-management
app/cbl/COUSR03C.cbl = user-management
app/bms/COADM01.bms = user-management
app/bms/COUSR00.bms = user-management
app/bms/COUSR01.bms = user-management
app/bms/COUSR02.bms = user-management
app/bms/COUSR03.bms = user-management

app/cbl/CBCUS01C.cbl = batch-processing
app/cbl/CBIMPORT.cbl = batch-processing
app/cbl/CBEXPORT.cbl = batch-processing
app/cbl/COBSWAIT.cbl = batch-processing
app/cbl/CSUTLDTC.cbl = batch-processing, accounts, transactions
app/jcl/** = batch-processing
app/scripts/** = batch-processing
scripts/** = batch-processing

app/cbl/COMEN01C.cbl = authentication, accounts
app/bms/COMEN01.bms = authentication, accounts
app/cpy/COMEN02Y.cpy = authentication, accounts
app/cpy/CODATECN.cpy = batch-processing, accounts
app/cpy/COADM02Y.cpy = user-management
app/cpy/COTTL01Y.cpy = authentication, accounts, transactions
app/cpy/CSDAT01Y.cpy = authentication, accounts, transactions, billing
app/cpy/CSMSG01Y.cpy = authentication, accounts, credit-cards, transactions, billing, reports, user-management
app/cpy/CSMSG02Y.cpy = authentication, accounts, credit-cards, transactions, billing, reports, user-management
app/cpy/CSSETATY.cpy = authentication, accounts, credit-cards, transactions, billing, reports, user-management
app/cpy/CSSTRPFY.cpy = authentication, accounts, credit-cards, transactions
app/cpy/CSUTLDPY.cpy = batch-processing, accounts
app/cpy/CSUTLDWY.cpy = batch-processing, accounts
app/cpy/CUSTREC.cpy = accounts
app/cpy/CSLKPCDY.cpy = accounts, credit-cards

app/app-authorization-ims-db2-mq/README.md = authorization
app/app-authorization-ims-db2-mq/cbl/COPAUA0C.cbl = authorization
app/app-authorization-ims-db2-mq/cbl/COPAUS0C.cbl = authorization
app/app-authorization-ims-db2-mq/cbl/COPAUS1C.cbl = authorization
app/app-authorization-ims-db2-mq/cbl/COPAUS2C.cbl = authorization
app/app-authorization-ims-db2-mq/cbl/CBPAUP0C.cbl = authorization, batch-processing
app/app-authorization-ims-db2-mq/cbl/DBUNLDGS.CBL = authorization, batch-processing
app/app-authorization-ims-db2-mq/cbl/PAUDBLOD.CBL = authorization, batch-processing
app/app-authorization-ims-db2-mq/cbl/PAUDBUNL.CBL = authorization, batch-processing
app/app-authorization-ims-db2-mq/bms/COPAU00.bms = authorization
app/app-authorization-ims-db2-mq/bms/COPAU01.bms = authorization
app/app-authorization-ims-db2-mq/cpy-bms/COPAU00.cpy = authorization
app/app-authorization-ims-db2-mq/cpy-bms/COPAU01.cpy = authorization
app/app-authorization-ims-db2-mq/cpy/CIPAUSMY.cpy = authorization
app/app-authorization-ims-db2-mq/cpy/CIPAUDTY.cpy = authorization
app/app-authorization-ims-db2-mq/cpy/CCPAURQY.cpy = authorization
app/app-authorization-ims-db2-mq/cpy/CCPAURLY.cpy = authorization
app/app-authorization-ims-db2-mq/cpy/CCPAUERY.cpy = authorization
app/app-authorization-ims-db2-mq/cpy/IMSFUNCS.cpy = authorization
app/app-authorization-ims-db2-mq/cpy/PADFLPCB.CPY = authorization
app/app-authorization-ims-db2-mq/cpy/PASFLPCB.CPY = authorization
app/app-authorization-ims-db2-mq/cpy/PAUTBPCB.CPY = authorization
app/app-authorization-ims-db2-mq/jcl/CBPAUP0J.jcl = authorization, batch-processing
app/app-authorization-ims-db2-mq/jcl/DBPAUTP0.jcl = authorization, batch-processing
app/app-authorization-ims-db2-mq/jcl/LOADPADB.JCL = authorization, batch-processing
app/app-authorization-ims-db2-mq/jcl/UNLDGSAM.JCL = authorization, batch-processing
app/app-authorization-ims-db2-mq/jcl/UNLDPADB.JCL = authorization, batch-processing
app/app-authorization-ims-db2-mq/ims/DBPAUTP0.dbd = authorization
app/app-authorization-ims-db2-mq/ims/DBPAUTX0.dbd = authorization
app/app-authorization-ims-db2-mq/ims/PADFLDBD.DBD = authorization
app/app-authorization-ims-db2-mq/ims/PASFLDBD.DBD = authorization
app/app-authorization-ims-db2-mq/ims/PSBPAUTB.psb = authorization
app/app-authorization-ims-db2-mq/ims/PSBPAUTL.psb = authorization
app/app-authorization-ims-db2-mq/ims/PAUTBUNL.PSB = authorization
app/app-authorization-ims-db2-mq/ims/DLIGSAMP.PSB = authorization
app/app-authorization-ims-db2-mq/ddl/AUTHFRDS.ddl = authorization
app/app-authorization-ims-db2-mq/ddl/XAUTHFRD.ddl = authorization
app/app-authorization-ims-db2-mq/dcl/AUTHFRDS.dcl = authorization
app/app-authorization-ims-db2-mq/csd/CRDDEMO2.csd = authorization

app/app-transaction-type-db2/cbl/** = transaction-types
app/app-transaction-type-db2/bms/** = transaction-types
app/app-transaction-type-db2/cpy/** = transaction-types
app/app-transaction-type-db2/jcl/** = transaction-types, batch-processing
app/app-transaction-type-db2/dcl/** = transaction-types
app/app-transaction-type-db2/ddl/** = transaction-types

app/app-vsam-mq/cbl/** = authorization
<!-- MODULE_FILE_MAP_END -->
