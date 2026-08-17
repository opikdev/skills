---
name: opik-api-standards
description: API design standards enforcing consistent REST resource design, RFC 9457 errors, pagination, versioning, idempotency, and spec-as-contract. Use this skill for EVERY API task — designing, building, or modifying HTTP/REST endpoints, routes, controllers, or handlers; defining request/response shapes, error formats, or OpenAPI specs; reviewing or consuming APIs; or building backends-for-frontends. If an HTTP API surface is being created or changed, apply this skill.
---

# API Standards

Rules for all HTTP API work. They target the main failure modes: verb-URLs and database-shaped resources, invented error envelopes, unbounded collections, silent breaking changes, unsafe retries, and hand-drifted docs.

## 1. Resource design

- Resources are plural nouns; HTTP methods carry the verb: `GET /users`, `POST /users`, `GET /users/{id}` — never `/getUsers`, `/user/create`.
- Method semantics respected: GET (safe, idempotent, no side effects), POST (create → 201 + `Location`), PUT (full replace, idempotent), PATCH (partial update), DELETE (idempotent, 204).
- Model the domain, not the database — table names as resources couple consumers to storage and widen the attack surface.
- Nest at most 2 levels (`/users/{id}/orders`); deeper relationships via query params or top-level resources.
- Pragmatic action endpoints are allowed where an action isn't a resource state change: `POST /payment-intents/{id}/cancel` beats pretending cancellation is a PATCH. Use sparingly, verb at the end.

## 2. Status codes and RFC 9457 errors

- Accurate status codes always — never 200 for a failure, never 404-as-200 JSON. 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 422 semantic validation, 429 rate limited, 5xx server fault.
- Errors use RFC 9457 Problem Details (`application/problem+json`) — never an invented envelope:

```json
{
  "type": "https://api.example.com/errors/insufficient-funds",
  "title": "Insufficient funds",
  "status": 422,
  "detail": "Balance is $10.00; transfer requires $50.00.",
  "instance": "/transfers/abc-123"
}
```

- `type` is the stable machine-readable identifier clients switch on — it never changes. `detail` follows copywriting standards: what went wrong, why, how to fix.
- Validation errors list per-field problems in an `errors` extension array.
- Never leak stack traces, internal exception messages, or infrastructure details in error bodies.

## 3. Pagination — always

- Never return an unbounded collection. Every list endpoint paginates from day one — backfilling pagination is a breaking change.
- Cursor-based for large or frequently-changing datasets (stable under concurrent inserts/deletes); offset (`page`/`per_page`) acceptable for small, stable sets where jumping to a page matters.
- Defaults and caps: default ~20 items, hard max ~100; over-limit requests → 400 with a Problem Details body explaining the limit.
- Responses include pagination metadata (next cursor / total where feasible) in a consistent `meta` shape.

## 4. Versioning from day one

- Path versioning as the default: `/v1/...`. Every API ships versioned, even internal ones.
- Breaking changes (removing/renaming fields, changing types or semantics, tightening validation, changing error `type`s) require a new version — never silently.
- Non-breaking (adding optional fields, new endpoints, new enum values where documented as open) go into the current version.
- Deprecations are machine-readable: `Deprecation`/`Sunset` headers, a documented migration path, and a real sunset date. An integer bump with no migration path breaks consumers without warning.

## 5. Reliability semantics

- Mutating POSTs accept an `Idempotency-Key` header; replays return the original result — a dropped connection during a checkout must not double-charge.
- Rate limiting returns 429 with `Retry-After`; limits documented.
- Concurrency: optimistic locking with `ETag` + `If-Match` → 412 on conflict for update-prone resources.
- Server-side timeouts on all upstream calls; no request hangs forever.
- Long-running work returns 202 + a status resource, not a 5-minute-held connection.

## 6. Spec as contract

- Every API has an OpenAPI 3.1 spec — spec-first, or generated from code annotations — and it is the single source of truth: validation rules, codegen, docs, and AI tool definitions all derive from it (pairs with docs standards: no hand-maintained parallel copy).
- The spec is versioned with the code and updated in the same change as the endpoint (drift is a bug).
- Every endpoint documents: request/response schemas, all error `type`s it can return, auth requirements, and one example.

## 7. Consistency conventions

- One property casing across the whole API — camelCase or snake_case, pick once, never mix.
- Timestamps: ISO 8601, UTC, suffix `Z` (`2026-08-14T09:30:00Z`). Money: integer minor units or string decimal — never floats.
- IDs are opaque strings with a type prefix where practical (`usr_abc123`); never expose auto-increment integers publicly.
- Same concept = same field name everywhere (`createdAt` on every resource, not `created`/`creation_date`/`ts` variants).
- Consistent response shape: resource(s) in a predictable place, `meta` for pagination — same structure on every endpoint.

## 8. API security

Extends coding standards §6 to the API layer:

- Authentication on every non-public endpoint — no "hidden" unauthenticated routes.
- Authorization checked per-resource on every request: the caller must own or be granted the specific object (prevents IDOR) — not just "is logged in".
- All input validated server-side against the schema regardless of client validation; unknown fields rejected or ignored deliberately.
- CORS deliberate: explicit origins, never `*` with credentials.
- Secrets, tokens, API keys never in URLs (they leak via logs and referrers) — headers only.
- Stricter rate limits on auth endpoints (login, password reset, token issuance).
- HTTPS only; sensitive data never in query strings.

## Self-check before finishing

1. Nouns + correct methods + correct status codes — nothing RPC-shaped without reason?
2. Errors RFC 9457 with stable `type`s, helpful `detail`, no internals leaked?
3. Every collection paginated with caps; version prefix present; breaking changes gated behind deprecation?
4. Idempotency on mutating POSTs, 429 + Retry-After, conflict handling where updates race?
5. Spec updated in the same change; casing, timestamps, and field names consistent; authz checked per-resource?

If a rule conflicts with an explicit user instruction or an established API's existing conventions, those win — note the deviation in one line.
