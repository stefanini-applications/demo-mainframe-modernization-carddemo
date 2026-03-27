# DMMC-1 — Plano de Execução: Modernização do CardDemo para Microserviços

**Versão:** 2026-03-27  
**Padrão:** Strangler Fig + DDD  
**Abordagem:** Incremental, orientada a risco  
**Sistema de origem:** CardDemo — COBOL/CICS/VSAM no mainframe z/OS

---

## 1. Visão Geral

O objetivo é migrar o CardDemo do mainframe (COBOL + CICS + VSAM) para uma arquitetura moderna de microserviços de forma **incremental e sem big-bang**. Cada fase extrai um domínio de negócio isolado, valida em produção paralela e desativa o módulo legado somente após confirmação de estabilidade.

### Stack-alvo

| Camada           | Tecnologia                                  |
|------------------|---------------------------------------------|
| Backend          | .NET 10 · ASP.NET Core · Controllers        |
| Frontend         | Angular 18 · Standalone Components · Signals · HttpClient + interceptors |
| Comunicação sync | REST (JSON over HTTPS)                      |
| Comunicação async | Kafka (eventos de domínio)                 |
| Banco de dados   | PostgreSQL — um banco por serviço           |
| Infra            | Docker · Docker Compose                     |
| API Gateway      | NGINX                                       |
| Observabilidade  | OpenTelemetry · Prometheus · Grafana        |

---

## 2. Decomposição de Domínios (DDD)

### 2.1 Contextos Delimitados (Bounded Contexts)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        API Gateway (NGINX)                          │
└──────┬──────────┬──────────┬───────────┬──────────┬────────────────┘
       │          │          │           │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼───┐ ┌───▼──────────┐
  │Identity│ │Account │ │  Card  │ │ Txn   │ │   Billing    │
  │& Access│ │ Mgmt   │ │  Mgmt  │ │Process│ │  & Reports   │
  └────────┘ └────────┘ └────────┘ └───────┘ └──────────────┘
       │          │          │           │          │
  ┌────▼──────────▼──────────▼───────────▼──────────▼────────┐
  │                   Kafka (Event Bus)                        │
  └────────────────────────────────────────────────────────────┘
```

### 2.2 Mapeamento VSAM → Serviço → Banco

| VSAM File    | Bounded Context       | Serviço               | Tabela PostgreSQL      |
|--------------|-----------------------|-----------------------|------------------------|
| `USRSEC`     | Identity & Access     | `identity-service`    | `users`                |
| `ACCTFILE`   | Account Management    | `account-service`     | `accounts`             |
| `CUSTFILE`   | Account Management    | `account-service`     | `customers`            |
| `DISCGRP`    | Account Management    | `account-service`     | `disclosure_groups`    |
| `CARDFILE`   | Card Management       | `card-service`        | `cards`                |
| `XREFFILE`   | Card Management       | `card-service`        | `card_xrefs`           |
| `TRANFILE`   | Transaction Processing| `transaction-service` | `transactions`         |
| `TCATBALF`   | Transaction Processing| `transaction-service` | `transaction_cat_bals` |

### 2.3 Aggregates e Raízes de Agregado

```
Identity & Access
  └─ User (root)  ← SEC-USER-DATA

Account Management
  └─ Account (root)  ← ACCOUNT-RECORD
       └─ Customer   ← CUSTOMER-RECORD

Card Management
  └─ Card (root)  ← CARD-RECORD
       └─ CardXref ← CARD-XREF-RECORD

Transaction Processing
  └─ Transaction (root)  ← TRAN-RECORD
       └─ TransactionCategoryBalance ← TRAN-CAT-BAL-RECORD

Billing
  └─ BillingCycle (root)
       └─ Statement
       └─ Payment
```

### 2.4 Eventos de Domínio (Kafka Topics)

| Tópico                          | Producer              | Consumers                          |
|---------------------------------|-----------------------|------------------------------------|
| `identity.user.created`         | identity-service      | —                                  |
| `account.account.updated`       | account-service       | billing-service, reporting-service |
| `card.card.activated`           | card-service          | transaction-service                |
| `card.card.deactivated`         | card-service          | transaction-service                |
| `transaction.posted`            | transaction-service   | account-service, billing-service   |
| `transaction.batch.interest-calc` | billing-service     | transaction-service, account-service |
| `billing.payment.received`      | billing-service       | transaction-service, account-service |
| `billing.statement.generated`   | billing-service       | reporting-service                  |

---

## 3. Estratégia Strangler Fig

### Princípio de Roteamento

O NGINX atua como o ponto único de entrada. As rotas são migradas progressivamente — cada novo serviço extrai um prefixo de path do legado:

```nginx
# Estado inicial (Fase 0): tudo vai para o mainframe
location / {
    proxy_pass http://mainframe-adapter;
}

# Após Fase 1: /api/auth/* e /api/users/* vão para o novo serviço
location /api/auth/ {
    proxy_pass http://identity-service;
}
location /api/users/ {
    proxy_pass http://identity-service;
}
# demais rotas: mainframe-adapter
```

A cada fase:
1. Novo serviço entra em produção atrás do NGINX  
2. Tráfego é migrado gradualmente (canary → 100%)  
3. Validação de equivalência funcional com o legado  
4. Rota legada é desativada

### Adapter de Mainframe

Durante a transição, um **Mainframe Adapter** (.NET) expõe o legado como REST, mantendo o contrato de API estável para o frontend Angular enquanto os serviços são migrados.

---

## 4. Fases de Execução

### Fase 0 — Fundação de Infraestrutura (Semanas 1–3)

**Objetivo:** Criar a base que sustenta todas as fases seguintes sem alterar nada do legado.

**Entregas:**

1. **Docker Compose base** com todos os containers declarados:
   - NGINX (API Gateway)
   - Kafka + Zookeeper
   - PostgreSQL (instâncias isoladas por serviço)
   - OpenTelemetry Collector
   - Prometheus + Grafana
   - Mainframe Adapter (stub inicial)

2. **NGINX com roteamento passthrough:** todo tráfego vai para o Mainframe Adapter.

3. **Pipeline CI/CD** (GitHub Actions ou equivalente):
   - Build, test, lint para .NET
   - Build para Angular
   - Docker image push

4. **Template de microserviço .NET 10:**
   ```
   src/
     ServiceName.Api/       ← Controllers, Program.cs
     ServiceName.Application/ ← Use Cases, Commands, Queries
     ServiceName.Domain/    ← Entities, Value Objects, Domain Events
     ServiceName.Infrastructure/ ← EF Core, Kafka, Outbox
   tests/
     ServiceName.UnitTests/
     ServiceName.IntegrationTests/
   ```

5. **Outbox Pattern** (base reutilizável para todos os serviços):
   ```sql
   CREATE TABLE outbox_messages (
     id          UUID PRIMARY KEY,
     topic       VARCHAR(255) NOT NULL,
     payload     JSONB NOT NULL,
     created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
     processed_at TIMESTAMPTZ
   );
   ```

6. **Padrão de Idempotência** (base reutilizável):
   ```sql
   CREATE TABLE idempotency_keys (
     idempotency_key UUID PRIMARY KEY,
     endpoint        VARCHAR(255) NOT NULL,
     response_code   INT NOT NULL,
     response_body   JSONB,
     created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   ```

7. **Observabilidade base:**
   - OpenTelemetry SDK configurado no template
   - Dashboards Grafana para RED metrics (Rate, Errors, Duration)
   - Alertas básicos: error rate > 1%, latência p99 > 2s

**Critério de saída:** Infraestrutura local funcional, pipeline CI/CD verde, template de serviço com testes passando.

---

### Fase 1 — Identity & Access (Semanas 4–7)

**Risco:** 🟢 BAIXO — Contexto mais isolado. USRSEC é independente de outros VSAM files.

**Objetivo:** Migrar autenticação (COSGN00C) e gestão de usuários (COUSR*) para o `identity-service`.

**Módulos legados substituídos:**
- `COSGN00C.cbl` — Signon
- `COUSR00C.cbl`, `COUSR01C.cbl`, `COUSR02C.cbl`, `COUSR03C.cbl` — CRUD de usuários

**Schema PostgreSQL (`identity-db`):**
```sql
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id    CHAR(8) UNIQUE NOT NULL,   -- SEC-USR-ID
  first_name   VARCHAR(20) NOT NULL,
  last_name    VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,    -- bcrypt, nunca plain text
  user_type    CHAR(1) NOT NULL CHECK (user_type IN ('A', 'U')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**API Endpoints (.NET 10 Controller):**
```
POST   /api/auth/login          → JWT (access + refresh token)
POST   /api/auth/refresh        → Novo access token
POST   /api/auth/logout         → Invalidar refresh token

GET    /api/users               → Listar (admin only)
POST   /api/users               → Criar (admin only)
GET    /api/users/{id}          → Detalhe
PUT    /api/users/{id}          → Atualizar
DELETE /api/users/{id}          → Excluir (admin only)
```

**Segurança:**
- Senhas: bcrypt (cost=12) — elimina plain text do USRSEC
- Autenticação: JWT Bearer (HS256 ou RS256)
- Autorização: Policy-based (`RequireAdminRole`)
- Rate limiting no endpoint de login: 5 tentativas / 15 min por IP

**Migração de dados:**
```bash
# Script de migração única: USRSEC → PostgreSQL
# Senhas: hash bcrypt do valor plain text (comunicar reset obrigatório após go-live)
dotnet run --project tools/MigrateUsrsec -- \
  --vsam-export data/usrsec.csv \
  --connection "Host=localhost;Database=identity-db"
```

**Frontend Angular 18:**
- `LoginComponent` standalone com Signals para estado de loading/erro
- `AuthInterceptor` adiciona `Authorization: Bearer <token>` em todas requisições
- `AuthGuard` protege rotas que requerem autenticação
- `AdminGuard` protege rotas de administração

**Critério de saída:**
- Login funcional com JWT
- Usuários admin conseguem gerenciar outros usuários
- Testes de integração cobrindo todos os endpoints
- Migração de USRSEC validada (contagem de registros, spot-check manual)

---

### Fase 2 — Reporting (Semanas 8–10)

**Risco:** 🟢 BAIXO — Somente leitura. Nenhum efeito colateral.

**Objetivo:** Migrar `CORPT00C.cbl` para o `reporting-service`, que opera sobre réplicas de dados.

**Estratégia:**
- Reporting-service consome eventos Kafka dos outros serviços para manter uma **read model** desnormalizada.
- Durante a transição (antes dos outros serviços existirem), ETL periódico exporta VSAM → PostgreSQL.

**Schema PostgreSQL (`reporting-db`):**
```sql
-- Tabela desnormalizada para relatório de transações
CREATE TABLE transaction_report_view (
  tran_id          CHAR(16) PRIMARY KEY,
  tran_date        DATE NOT NULL,
  tran_amount      NUMERIC(12,2) NOT NULL,
  tran_type_cd     CHAR(2),
  tran_cat_cd      INT,
  tran_desc        VARCHAR(100),
  card_num         CHAR(16),
  acct_id          BIGINT,
  merchant_name    VARCHAR(50),
  merchant_city    VARCHAR(50),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trv_acct_date ON transaction_report_view(acct_id, tran_date);
CREATE INDEX idx_trv_card_date ON transaction_report_view(card_num, tran_date);
```

**API Endpoints:**
```
GET /api/reports/transactions?accountId=&startDate=&endDate=&page=&pageSize=
GET /api/reports/transactions/{tranId}
GET /api/reports/accounts/{accountId}/summary
```

**Critério de saída:** Relatórios equivalentes ao CORPT00C com dados sincronizados, latência < 500ms no p95.

---

### Fase 3 — Account Management (Semanas 11–16)

**Risco:** 🟡 MÉDIO — Entidade central do sistema. Muitos consumidores dependem de conta e cliente.

**Objetivo:** Migrar `COACTVWC.cbl`, `COACTUPC.cbl` e todos os `CBACT*.cbl` para o `account-service`.

**Módulos legados substituídos:**
- `COACTVWC.cbl` — Visualização de conta
- `COACTUPC.cbl` — Atualização de conta (com locking otimista)
- `CBACT01C.cbl`, `CBACT02C.cbl`, `CBACT03C.cbl` — Batch de validação
- `CBACT04C.cbl` — Cálculo de juros mensal (migrado para job agendado)

**Schema PostgreSQL (`account-db`):**
```sql
CREATE TABLE customers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id        INT UNIQUE NOT NULL,    -- CUST-ID
  first_name       VARCHAR(25) NOT NULL,
  middle_name      VARCHAR(25),
  last_name        VARCHAR(25) NOT NULL,
  ssn              CHAR(9),               -- PII — criptografado em repouso
  date_of_birth    DATE,
  fico_score       SMALLINT CHECK (fico_score BETWEEN 0 AND 850),
  address_line1    VARCHAR(50),
  address_line2    VARCHAR(50),
  address_line3    VARCHAR(50),
  state_code       CHAR(2),
  country_code     CHAR(3),
  zip_code         VARCHAR(10),
  phone1           VARCHAR(15),
  phone2           VARCHAR(15),
  eft_account_id   VARCHAR(10),
  primary_holder   BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE disclosure_groups (
  group_id         VARCHAR(10) PRIMARY KEY,  -- ACCT-GROUP-ID / DIS-GROUP-KEY
  description      VARCHAR(100),
  interest_rate    NUMERIC(6,4) NOT NULL
);

CREATE TABLE accounts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id        BIGINT UNIQUE NOT NULL,   -- ACCT-ID
  customer_id      UUID NOT NULL REFERENCES customers(id),
  active           BOOLEAN NOT NULL DEFAULT true,
  current_balance  NUMERIC(12,2) NOT NULL DEFAULT 0,
  credit_limit     NUMERIC(12,2) NOT NULL,
  cash_credit_limit NUMERIC(12,2) NOT NULL,
  open_date        DATE NOT NULL,
  expiration_date  DATE,
  reissue_date     DATE,
  curr_cycle_credit NUMERIC(12,2) NOT NULL DEFAULT 0,
  curr_cycle_debit  NUMERIC(12,2) NOT NULL DEFAULT 0,
  zip_code         VARCHAR(10),
  group_id         VARCHAR(10) REFERENCES disclosure_groups(group_id),
  version          INT NOT NULL DEFAULT 0,  -- Para locking otimista (substitui ACUP-OLD-*)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**API Endpoints:**
```
GET    /api/accounts/{id}                → Detalhe (substitui COACTVWC)
PUT    /api/accounts/{id}                → Atualizar (substitui COACTUPC — requer If-Match: version)
GET    /api/accounts/{id}/customer       → Cliente vinculado
PUT    /api/accounts/{id}/customer       → Atualizar dados do cliente

GET    /api/customers/{id}
```

**Locking Otimista (substitui ACUP-OLD-*):**
```
GET /api/accounts/42 → ETag: "5"
PUT /api/accounts/42 + If-Match: "5" → 200 OK se version=5, 409 Conflict se divergiu
```

**Consistência com Kafka:**
Após commit em PostgreSQL, o serviço publica via Outbox:
```json
{
  "eventId": "uuid",
  "eventType": "account.account.updated",
  "accountId": "uuid",
  "legacyId": 12345678901,
  "occurredAt": "2026-03-27T11:00:00Z",
  "payload": { "currentBalance": -1500.00, "active": true }
}
```

**Job de Cálculo de Juros (substitui CBACT04C):**
- Scheduled job (Quartz.NET ou Hangfire) executado mensalmente
- Lê `accounts` + `disclosure_groups` + `transaction_cat_bals` (do transaction-service via Kafka read model)
- Publica evento `transaction.batch.interest-calc` no Kafka
- Idempotente: verifica se já foi executado no período corrente

**Critério de saída:**
- Equivalência funcional com COACTVWC e COACTUPC validada
- Locking otimista testado com cenário de concorrência
- Migração de ACCTFILE e CUSTFILE validada
- Evento `account.account.updated` sendo consumido pelo reporting-service

---

### Fase 4 — Card Management (Semanas 17–21)

**Risco:** 🟡 MÉDIO — Depende de Account (account-service já disponível).

**Objetivo:** Migrar `COCRDSLC.cbl`, `COCRDLIC.cbl`, `COCRDUPC.cbl` para o `card-service`.

**Schema PostgreSQL (`card-db`):**
```sql
CREATE TABLE cards (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number      CHAR(16) UNIQUE NOT NULL,   -- PAN — tokenizar em prod
  account_legacy_id BIGINT NOT NULL,            -- FK lógica para account-service
  cvv_code         CHAR(3),                    -- armazenar hash
  embossed_name    VARCHAR(50),
  expiration_date  DATE,
  active           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE card_xrefs (
  card_number      CHAR(16) PRIMARY KEY REFERENCES cards(card_number),
  account_legacy_id BIGINT NOT NULL,
  customer_legacy_id INT NOT NULL
);
```

**API Endpoints:**
```
GET    /api/cards?accountId=              → Listar cartões da conta (substitui COCRDLIC)
GET    /api/cards/{cardNumber}            → Detalhe (substitui COCRDSLC)
POST   /api/cards                         → Criar cartão
PUT    /api/cards/{cardNumber}            → Atualizar (substitui COCRDUPC)
POST   /api/cards/{cardNumber}/activate
POST   /api/cards/{cardNumber}/deactivate
```

**Critério de saída:**
- Lookup card → account funcional (XREFFILE migrado)
- Eventos `card.card.activated` / `card.card.deactivated` publicados no Kafka
- Tela Angular de listagem/detalhe de cartão funcional

---

### Fase 5 — Transaction Processing (Semanas 22–29)

**Risco:** 🔴 ALTO — Núcleo financeiro. Consistência de dados e idempotência são críticas.

**Objetivo:** Migrar `COTRN00C.cbl`, `COTRN01C.cbl`, `COTRN02C.cbl` e batch `CBTRN*.cbl` para o `transaction-service`.

**Pré-requisitos:** Fases 3 e 4 completas e estáveis.

**Schema PostgreSQL (`transaction-db`):**
```sql
CREATE TABLE transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id        CHAR(16) UNIQUE,            -- TRAN-ID (legado)
  idempotency_key  UUID UNIQUE NOT NULL,       -- Chave de idempotência obrigatória
  card_number      CHAR(16) NOT NULL,
  account_legacy_id BIGINT NOT NULL,
  type_code        CHAR(2) NOT NULL,
  category_code    INT NOT NULL,
  source           VARCHAR(10),
  description      VARCHAR(100),
  amount           NUMERIC(12,2) NOT NULL,     -- positivo=crédito, negativo=débito
  merchant_id      BIGINT,
  merchant_name    VARCHAR(50),
  merchant_city    VARCHAR(50),
  merchant_zip     VARCHAR(10),
  originated_at    TIMESTAMPTZ NOT NULL,
  processed_at     TIMESTAMPTZ,
  status           VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                   CHECK (status IN ('PENDING', 'POSTED', 'REVERSED', 'FAILED')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE transaction_cat_bals (
  account_legacy_id BIGINT NOT NULL,
  type_code        CHAR(2) NOT NULL,
  category_code    INT NOT NULL,
  balance          NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (account_legacy_id, type_code, category_code)
);

CREATE INDEX idx_tran_card_date ON transactions(card_number, originated_at);
CREATE INDEX idx_tran_account ON transactions(account_legacy_id);
```

**Idempotência (padrão obrigatório):**
```
POST /api/transactions
Headers:
  Idempotency-Key: <UUID gerado pelo cliente>

Comportamento:
  1. Verificar se idempotency_key já existe
  2. Se sim: retornar resposta original (sem reprocessar)
  3. Se não: processar e armazenar resultado com a chave
```

**API Endpoints:**
```
GET    /api/transactions?cardNumber=&startDate=&endDate=  → Listar (substitui COTRN00C)
GET    /api/transactions/{id}                              → Detalhe (substitui COTRN01C)
POST   /api/transactions                                   → Postar transação (requer Idempotency-Key)
GET    /api/accounts/{accountId}/transactions
```

**Saga de Posting de Transação (substitui POSTTRAN JCL batch):**
```
1. Receber POST /api/transactions (idempotency check)
2. Validar cartão ativo (call card-service)
3. Validar conta ativa com limite disponível (call account-service)
4. Inserir transaction (status=PENDING) + outbox_message
5. Commit local
6. Kafka publisher: transaction.posted
7. account-service: debitar/creditar balanço
8. transaction-service: marcar status=POSTED
9. Em caso de falha: compensar com reversão (status=FAILED)
```

**Batch CBTRN (migração para eventos Kafka):**
- `CBTRN01C.cbl` → Consumer Kafka `transaction.posted` que valida/processa
- `CBTRN02C.cbl` → Job agendado diário de reconciliação
- `CBTRN03C.cbl` → Consumer que atualiza `transaction_cat_bals`

**Critério de saída:**
- Transações postadas de forma idempotente (testar duplo-submit)
- Saga com compensação validada em cenário de falha injetada
- `transaction_cat_bals` consistente com legado após migração
- CBTRN equivalentes funcionando via Kafka

---

### Fase 6 — Billing (Semanas 30–34)

**Risco:** 🟡 MÉDIO — Depende de transactions e accounts, ambos já migrados.

**Objetivo:** Migrar `COBIL00C.cbl` e batch `CBSTM03A/B.CBL` para o `billing-service`.

**Schema PostgreSQL (`billing-db`):**
```sql
CREATE TABLE billing_cycles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_legacy_id BIGINT NOT NULL,
  period_start     DATE NOT NULL,
  period_end       DATE NOT NULL,
  opening_balance  NUMERIC(12,2) NOT NULL,
  closing_balance  NUMERIC(12,2) NOT NULL,
  total_debits     NUMERIC(12,2) NOT NULL,
  total_credits    NUMERIC(12,2) NOT NULL,
  interest_charged NUMERIC(12,2) NOT NULL DEFAULT 0,
  minimum_payment  NUMERIC(12,2),
  due_date         DATE,
  generated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key  UUID UNIQUE NOT NULL,
  account_legacy_id BIGINT NOT NULL,
  amount           NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payment_date     DATE NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**API Endpoints:**
```
POST   /api/billing/payments               → Registrar pagamento (requer Idempotency-Key)
GET    /api/accounts/{accountId}/billing-cycles
GET    /api/accounts/{accountId}/billing-cycles/current
```

**Geração de Extrato (substitui CBSTM03A/B):**
- Job agendado mensal disparado via evento Kafka `billing.cycle.close`
- Consome transações do period via `transaction-service`
- Publica `billing.statement.generated` para reporting-service

**Critério de saída:**
- Pagamentos idempotentes (rejeitar duplo-submit)
- Extrato equivalente ao CBSTM com dados corretos
- Cálculo de juros integrado com account-service

---

### Fase 7 — Batch Jobs Residuais → Event-Driven (Semanas 35–38)

**Objetivo:** Eliminar dependência de JCL batch jobs que ainda operam sobre VSAM.

| JCL / COBOL         | Substituição                                              |
|---------------------|-----------------------------------------------------------|
| `POSTTRAN.jcl`      | Consumer Kafka `transaction.posted` (Fase 5)              |
| `INTCALC.jcl`       | Job agendado mensal no account-service (Fase 3)           |
| `CREASTMT.JCL`      | Job agendado mensal no billing-service (Fase 6)           |
| `DALYREJS.jcl`      | Job agendado diário no transaction-service                |
| `CBIMPORT.cbl`      | API de importação REST com idempotência                   |
| `CBEXPORT.cbl`      | Endpoint de exportação REST ou job de relatório           |
| `REPROCT.ctl`       | reporting-service                                         |
| `CLOSEFIL/OPENFIL`  | Não necessário — PostgreSQL disponível continuamente      |

---

### Fase 8 — Descomissionamento do Legado (Semanas 39–42)

**Objetivo:** Remover roteamento NGINX para o mainframe e validar operação 100% nos microserviços.

**Checklist de descomissionamento:**
- [ ] Todos os módulos CICS sem tráfego por ≥ 30 dias (métricas NGINX)
- [ ] Nenhum job JCL em execução
- [ ] Migração de dados auditada e validada (contagens, somas financeiras)
- [ ] Backup final de todos os VSAM files
- [ ] Runbook de rollback documentado e testado
- [ ] Aprovação formal do responsável financeiro

---

## 5. Estratégia de Migração de Dados

### Princípios
1. **Migração incremental por fase:** cada serviço migra apenas seus VSAM files
2. **Dual-write transitório:** durante coexistência, gravações vão para ambos (legado + novo)
3. **Validação de consistência:** comparar contagens e checksums antes de cortar

### Sequência de migração por VSAM

```
Fase 1: USRSEC      → users (identity-db)
Fase 3: CUSTFILE    → customers (account-db)
        ACCTFILE    → accounts (account-db)
        DISCGRP     → disclosure_groups (account-db)
Fase 4: CARDFILE    → cards (card-db)
        XREFFILE    → card_xrefs (card-db)
Fase 5: TRANFILE    → transactions (transaction-db)
        TCATBALF    → transaction_cat_bals (transaction-db)
```

### Script de validação (executar após cada migração)
```sql
-- Exemplo para accounts
SELECT
  'mainframe_count' AS source, :vsam_count AS count
UNION ALL
SELECT 'postgres_count', COUNT(*) FROM accounts;

-- Soma financeira (balanços)
SELECT SUM(current_balance) FROM accounts;
-- Comparar com soma de ACCT-CURR-BAL do VSAM export
```

---

## 6. Frontend Angular 18

### Estrutura de Módulos (Standalone)
```
src/app/
  core/
    interceptors/
      auth.interceptor.ts       ← Adiciona JWT header
      idempotency.interceptor.ts ← Gera e adiciona Idempotency-Key
      error.interceptor.ts      ← Trata 401/403/5xx
    guards/
      auth.guard.ts
      admin.guard.ts
    services/
      auth.service.ts           ← Signals: currentUser, isLoggedIn
  features/
    auth/
      login/login.component.ts  ← Standalone
    accounts/
      account-detail/           ← Standalone
      account-update/           ← Standalone
    cards/
      card-list/                ← Standalone
      card-detail/              ← Standalone
    transactions/
      transaction-list/         ← Standalone
      transaction-detail/       ← Standalone
    billing/
      payment/                  ← Standalone
    reports/
      transaction-report/       ← Standalone
    users/ (admin only)
      user-list/                ← Standalone
      user-form/                ← Standalone
  shared/
    components/
    pipes/
    directives/
```

### Uso de Signals (Angular 18)
```typescript
// auth.service.ts
export class AuthService {
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.userType === 'A');
}
```

### Idempotency Interceptor
```typescript
// idempotency.interceptor.ts
export const idempotencyInterceptor: HttpInterceptorFn = (req, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req = req.clone({
      setHeaders: { 'Idempotency-Key': crypto.randomUUID() }
    });
  }
  return next(req);
};
```

---

## 7. Observabilidade

### OpenTelemetry (todos os serviços)
```csharp
// Program.cs — configuração padrão no template
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddKafkaInstrumentation()
        .AddOtlpExporter())
    .WithMetrics(m => m
        .AddAspNetCoreInstrumentation()
        .AddOtlpExporter());
```

### Dashboards Grafana
| Dashboard         | Métricas-chave                                          |
|-------------------|---------------------------------------------------------|
| RED por serviço   | Rate, Error Rate, Duration (p50/p95/p99)               |
| Kafka             | Consumer lag, throughput por tópico                     |
| PostgreSQL        | Conexões ativas, QPS, slow queries                      |
| Negócio           | Transações/min, pagamentos/hora, erros de auth/hora     |

### Alertas críticos
| Alerta                            | Threshold | Severidade |
|-----------------------------------|-----------|------------|
| Error rate serviço > 1%           | 5 min     | P1         |
| Latência p99 > 2s                 | 5 min     | P1         |
| Consumer Kafka lag > 10k msgs     | 10 min    | P2         |
| Falha de idempotência (duplo-post)| imediato  | P1         |
| Job de juros não executou         | dia D+1   | P1         |

---

## 8. Matriz de Riscos

| Risco                                          | Probabilidade | Impacto | Mitigação                                          |
|------------------------------------------------|---------------|---------|---------------------------------------------------|
| Divergência de dados durante migração          | Média         | Alto    | Dual-write + validação de checksum pré-cutover    |
| Falha na saga de transação (fundo financeiro)  | Baixa         | Alto    | Compensação automática + alertas + rollback manual|
| Performance do PostgreSQL vs. VSAM             | Média         | Médio   | Índices otimizados, connection pooling, benchmarks|
| Kafka indisponível (mensagens perdidas)         | Baixa         | Alto    | Outbox pattern garante at-least-once delivery     |
| Resistência a mudança / treinamento da equipe  | Alta          | Médio   | Fases pequenas, documentação, pair programming    |
| Dados PII sem conformidade (SSN plain text)    | Alta          | Alto    | Criptografia em repouso desde a Fase 3            |

---

## 9. Critérios Globais de Sucesso

- [ ] 100% das funcionalidades do mainframe replicadas nos microserviços
- [ ] Zero perda de dados financeiros (validado por auditoria)
- [ ] Latência p99 ≤ 2s para todas as operações online
- [ ] Disponibilidade ≥ 99,9% medida em produção por 30 dias
- [ ] Idempotência comprovada em 100% dos endpoints de mutação
- [ ] Nenhum tráfego residual para o mainframe por 30 dias consecutivos

---

## 10. Cronograma Resumido

| Fase | Descrição                         | Semanas  | Risco   |
|------|-----------------------------------|----------|---------|
| 0    | Fundação de Infraestrutura        | 1–3      | 🟢      |
| 1    | Identity & Access                 | 4–7      | 🟢      |
| 2    | Reporting (read-only)             | 8–10     | 🟢      |
| 3    | Account Management                | 11–16    | 🟡      |
| 4    | Card Management                   | 17–21    | 🟡      |
| 5    | Transaction Processing            | 22–29    | 🔴      |
| 6    | Billing                           | 30–34    | 🟡      |
| 7    | Batch Jobs → Event-Driven         | 35–38    | 🟡      |
| 8    | Descomissionamento                | 39–42    | 🟢      |

**Total estimado: ~42 semanas (~10 meses) com equipe de 3–4 engenheiros.**

---

## Referências

- Sistema de origem: [CardDemo README](../README.md)
- Visão geral do sistema: [system-overview.md](./system-overview.md)
- Mapa de módulos: [module-file-map.md](./module-file-map.md)
- Padrão Strangler Fig: [martinfowler.com/bliki/StranglerFigApplication.html](https://martinfowler.com/bliki/StranglerFigApplication.html)
- Outbox Pattern: [microservices.io/patterns/data/transactional-outbox.html](https://microservices.io/patterns/data/transactional-outbox.html)
