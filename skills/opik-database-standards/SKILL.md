---
name: opik-database-standards
description: Database standards enforcing sound schema design, integrity constraints, evidence-based indexing, safe migrations, and disciplined queries. Use this skill for EVERY database task — designing or changing schemas, writing migrations, adding tables/columns/indexes, writing or reviewing queries, using any ORM or raw SQL, seeding data, or debugging slow queries — in any relational database. If a schema, migration, or query is being created or changed, apply this skill.
---

# Database Standards

Rules for all relational database work. They target the main failure modes: hunch-driven denormalization, missing constraints, speculative indexes, table-locking migrations, N+1 queries, and unguarded destructive operations.

## 1. Schema design

- Start at Third Normal Form. Denormalize a specific column or add a materialized view only after EXPLAIN/ANALYZE proves a join is the measured bottleneck — never on a hunch.
- One documented naming convention across the entire schema: snake_case; consistent suffix patterns (`user_id`, `created_at`, `is_active`); the same attribute uses the same name in every table it appears.
- Table names are clear nouns with one meaning, stable over time — model the domain, no UI-driven labels, no unexplained abbreviations (`cust_ord_dt` needs a decoder ring).
- Constraint and index names follow predictable prefixes (`pk_`, `fk_`, `uq_`, `idx_`, `chk_`) so they're recognizable in logs and migration output.
- Match the project's existing convention if one exists (e.g., plural table names) — consistency wins.

## 2. Every table's non-negotiables

- A primary key, always. Stable and opaque; prefer generated IDs over natural keys; avoid composite PKs unless genuinely necessary.
- `created_at` and `updated_at`, NOT NULL with defaults — near-zero cost, enormous debugging and syncing value.
- Correct types: timestamps as timestamp types (UTC), money as integer minor units or decimal — never float, booleans as booleans, enums/checks for closed value sets — no strings-for-everything.
- NOT NULL wherever the domain requires a value; UNIQUE, CHECK, and defaults declared in the database — the DB enforces integrity, app-level validation is a convenience layer on top, not a substitute.

## 3. Integrity via keys

- Foreign keys are declared, not simulated in app logic — the database enforces referential integrity even when some future script or tool bypasses the app.
- `ON DELETE` behavior chosen deliberately per relation (CASCADE, RESTRICT, SET NULL) — never left to default without thought.
- Soft deletes (`deleted_at` nullable timestamp) where history, restoration, or audit matters; all queries filter `deleted_at IS NULL`; add a partial index on the live rows to keep it fast. Hard delete only where data must genuinely disappear.

## 4. Indexing — from evidence, not speculation

- Index foreign keys and columns that appear in frequent WHERE/JOIN/ORDER BY — derived from actual query patterns, not guesses.
- Every index taxes every write; don't pre-decorate the schema with indexes "just in case", and remove unused ones.
- Composite index column order follows query shape (equality columns first, then range/sort).
- Verify with EXPLAIN that queries actually use the intended index; a migration adding an index states which query it serves.
- Unique constraints double as indexes — don't add a redundant index on the same column.

## 5. Migration discipline

- Every schema change is a versioned migration file, committed in the same change as the code that needs it (per git standards: atomic). No manual production DDL outside migrations.
- Never edit an applied migration — write a new one. Migration history is append-only.
- Never rename or retype a column in a single step. Use expand → migrate → contract across deploys: add the new structure, sync/backfill while both exist, switch the code, then drop the old one. During the window, app code must work with both schema versions.
- Migrations are reversible where feasible; where not (data-destroying), the down-path is documented as "irreversible — restore from backup".

## 6. Production-safe migrations

A migration that runs in milliseconds on dev's 100 rows can lock a production table with millions of rows for minutes. For any table with real data:

- Create indexes with the non-blocking option (e.g., `CONCURRENTLY`) — and know that it can't run inside a transaction.
- Add constraints as `NOT VALID` first, then `VALIDATE` separately, so the heavy scan doesn't block traffic.
- Backfills in batches — never one UPDATE over millions of rows; separate DDL statements into separate transactions/files so locks release between them.
- Review the SQL your ORM/migration tool generates — a diff that looks harmless can acquire an exclusive lock. Don't trust the tool's defaults to be safe.
- Test against production-like data volume; run heavy migrations in low-traffic windows.

## 7. Query discipline (app layer)

- N+1 is the default ORM failure mode: when rendering a list touches a relation, eager-load or join deliberately — check the query log/count, don't assume.
- Select only needed columns on hot paths; no `SELECT *` in production code.
- Transactions span the minimum work needed for atomicity: no external API calls, file I/O, or user waits inside a transaction — locks hold until commit.
- Every list query paginates and has an explicit ORDER BY (matching API standards §3); unbounded reads are bugs.
- Parameterized queries only (coding standards §6) — this includes fragments built for ORMs' raw-SQL escapes.
- Slow query? EXPLAIN before "optimizing" — fix the actual plan (missing index, bad join), not the symptom (per coding standards §8).

## 8. Data safety

- Destructive operations (DROP, TRUNCATE, mass UPDATE/DELETE, column removal) require: a stated rollback plan, verified backup, and explicit user confirmation — never run silently as part of a task.
- Ad-hoc writes against real data: wrap in a transaction, run the SELECT with the same WHERE first to see what's affected, then the write, verify, then commit.
- Never point tests, seeds, or experiments at a production connection; seed/fixture data clearly fake (no real personal data).
- Connection strings and credentials are env vars (coding standards §6), least-privilege per environment — the app user can't DROP.

## Self-check before finishing

1. 3NF unless evidence says otherwise; naming consistent with the schema's convention?
2. PK, timestamps, correct types, and NOT NULL/constraints declared in the DB on every touched table?
3. FKs with deliberate ON DELETE; indexes tied to actual queries, verified with EXPLAIN?
4. Schema changes as append-only migrations, expand→contract for renames/retypes, production-safe (non-blocking, batched)?
5. No N+1, minimal transactions, paginated reads — and every destructive step confirmed with a rollback plan?

If a rule conflicts with an explicit user instruction or the project's established conventions, those win — note the deviation in one line.
