---
name: "opik-backend-standards"
description: "Backend conventions for HTTP APIs and relational databases — RFC 9457 errors, versioning, pagination, idempotency, ID/casing/time/money conventions, schema rules, and production-safe migrations. Use for EVERY task that creates, changes, or reviews API endpoints, routes, handlers, OpenAPI specs, schemas, migrations, indexes, or SQL/ORM queries, in any framework or relational database."
license: "MIT"
---

# Backend Standards

Team conventions and the mistakes that reach production. REST and SQL fundamentals are assumed.

## API

### Errors

- RFC 9457 Problem Details (`application/problem+json`), never an invented envelope. `type` is a stable URI clients switch on; `detail` says what went wrong, why, and how to fix it; per-field validation problems go in an `errors` array.
- Never 200 for a failure. No stack traces or internals in error bodies.

### Contract

- Path versioning `/v1` from day one, internal APIs included.
- Breaking (removing/renaming a field, changing a type or meaning, tightening validation, changing an error `type`) → new version. Deprecate with `Deprecation` + `Sunset` headers and a migration path.
- OpenAPI 3.1+ is the source of truth, updated in the same change as the endpoint. Each endpoint lists schemas, error `type`s, auth, and one example.
- Action endpoints only when an action isn't a state change: `POST /payment-intents/{id}/cancel`.

### Collections

- Every list paginates from day one: default 20, max 100; over the limit → 400 Problem Details.
- Cursor for large or changing data; offset only for small, stable sets. Metadata in `meta`; explicit `ORDER BY` underneath.

### Reliability

- Mutating POSTs accept `Idempotency-Key`; replays return the original result.
- 429 with `Retry-After`; stricter limits on login, password reset, and token endpoints.
- Update-prone resources: `ETag` + `If-Match` → 412 on conflict.
- Timeouts on every upstream call; long work → 202 + a status resource.

### Conventions

- One property casing across the API, chosen once. Same concept, same field name everywhere.
- Timestamps ISO 8601 UTC with `Z`. Money as integer minor units or a decimal string, never float.
- Public IDs: opaque, type-prefixed strings (`usr_abc123`); never expose auto-increment integers.

### Security

- Authorize per resource on every request — the caller owns or was granted this object (prevents IDOR) — not just "logged in".
- Validate every request against the schema server-side; reject or ignore unknown fields deliberately.
- CORS with explicit origins, never `*` with credentials. Secrets never in URLs.

## Database

### Schema

- snake_case; the same attribute has the same name in every table. Prefixes: `pk_`, `fk_`, `uq_`, `idx_`, `chk_`.
- Every table: a generated opaque primary key, and `created_at` + `updated_at` NOT NULL with defaults, as UTC timestamp types.
- Integrity lives in the database: NOT NULL, UNIQUE, CHECK, and declared foreign keys with a deliberately chosen `ON DELETE`.
- Money as integer minor units or decimal; closed value sets as enum or CHECK.
- Soft delete (`deleted_at`) where history matters, with a partial index on live rows where the engine supports it (MySQL doesn't; put `deleted_at` in a composite index).
- Denormalize only after EXPLAIN shows a measured bottleneck.
- Index from real query patterns; each index migration names the query it serves. No extra index on a column that's already unique.

### Migrations

- Versioned, append-only files, committed with the code that needs them. Never edit an applied migration.
- Rename or retype = expand → backfill → switch code → contract, across deploys. Code works with both shapes in between.
- Provide a down migration, or document "irreversible — restore from backup".

### Production-safe DDL

For tables with real data. Read the SQL your ORM generates — a harmless-looking diff can take an exclusive lock.

| Need | PostgreSQL | MySQL 8 |
|---|---|---|
| Add column | Nullable or non-volatile default skips the rewrite (11+); still takes a brief `ACCESS EXCLUSIVE` lock | `ALGORITHM=INSTANT` (any position from 8.0.30; not on `COMPRESSED` tables or tables with a `FULLTEXT` index) |
| Add index | `CREATE INDEX CONCURRENTLY`, outside a transaction | `ALGORITHM=INPLACE, LOCK=NONE` |
| Add FK or CHECK | `NOT VALID`, then `VALIDATE CONSTRAINT` separately | Online schema-change tool on large tables; gh-ost doesn't support foreign keys, so dry-run pt-online-schema-change first |

- Other engines: read the engine's online-DDL docs before running against real data.
- Backfill in batches; keep separate DDL steps in separate transactions so locks release.

### Queries and data safety

- N+1 is the default ORM failure: when a list touches a relation, eager-load or join deliberately and check the query count.
- Every list query has an explicit `ORDER BY` and a limit. No external calls, file I/O, or user waits inside a transaction.
- Destructive operations (DROP, TRUNCATE, mass UPDATE/DELETE, dropping a column) need a rollback plan, a verified backup, and explicit user confirmation.
- Ad-hoc writes: run the SELECT with the same WHERE first, then write inside a transaction, verify, commit.
- Tests and seeds never touch production; seed data is obviously fake. The app's DB user can't DROP.

## Self-check

1. Problem Details errors, `/v1`, capped pagination, idempotency, per-resource authz?
2. PK, timestamps, DB-enforced constraints, naming prefixes on every touched table?
3. Migrations append-only, expand→contract, lock-safe for this engine; destructive steps confirmed?

If a rule conflicts with an explicit user instruction or an existing API/schema's conventions, those win — note the deviation in one line.
