# GridNova

Open-source, configurable, extensible React data grid library, developed incrementally and intended for publication to npm. The project is also a vehicle for learning Claude Code in depth.

## Project status

Foundation is scaffolded and validated (TypeScript, pnpm, Vite, Vitest, ESLint, Prettier, CI, Prettier hook). Approved decisions live in `docs/decisions.md`; anything not listed there is a proposal, not a commitment. The approved feature plan is `docs/roadmap.md`.

**Current focus:** Feature 1 (column definitions and cell rendering). Its draft is `docs/features/01-columns-and-cells.md`, awaiting the owner's decisions D1 to D4. After that: introduce skills by turning the feature-document procedure into a `/new-feature` skill.

## Session workflow

Work on one feature per session; start a fresh session (or `/clear`) between features. Continuity lives in files, not in the conversation:

- At the start, read this file, `docs/decisions.md`, `docs/roadmap.md` and the current feature document.
- At the end, update those files (decisions made, current focus, what remains) so the next session can start cold.
- Long discussions and open decisions belong in the feature document, not only in chat.

## Collaboration rules

- Claude guides the workflow from architecture through implementation and validation.
- The owner controls product requirements, important architectural decisions, dependencies with significant implications, and public APIs. Present options with trade-offs, recommend one, and ask for approval on these.
- After an approach is approved, proceed autonomously on routine implementation and verification. Do not ask about minor decisions.
- Discuss one manageable group of decisions at a time.
- Challenge assumptions and flag risks when relevant.
- No unnecessary abstractions, infrastructure, or speculative features.
- Develop one feature at a time. Substantial features get a feature document in `docs/features/`; minor fixes and maintenance do not.
- Keep approved decisions in `docs/decisions.md`, clearly separated from proposals.
- **Never create Git commits without explicit approval.**
- Work directly with the owner; do not defer approval or review to other tools or assistants.

## Claude Code learning objectives

Learning Claude Code is an explicit project goal. Introduce these progressively through real GridNova tasks: explain the capability, let the owner try it, evaluate its usefulness, and avoid needless complexity.

1. `CLAUDE.md` and persistent project instructions
2. Skills for repeatable procedures
3. Subagents for focused, independent reviews
4. Hooks for deterministic automated checks
5. MCP integrations for useful external workflows
6. Context management and effective planning

Progress is tracked in `docs/claude-code-learning.md`. Update it when a capability is introduced or evaluated, and suggest the next one when a task naturally fits.

## Commands

Package manager is pnpm (pinned via `packageManager`; enable with `corepack enable`). Run from the repo root:

- `pnpm install`: install everything (library and playground).
- `pnpm dev`: start the playground (Vite dev server; imports library source directly).
- `pnpm test` / `pnpm test:run`: Vitest in watch mode / once.
- `pnpm lint`, `pnpm typecheck`, `pnpm format:check` (`pnpm format` to fix).
- `pnpm build`: library build (`dist/` JS via Vite plus `.d.ts` via tsc).

A project hook (`.claude/settings.json`, script in `.claude/hooks/format.mjs`) runs Prettier on every file after Edit/Write, so formatting is automatic. Read a file again before a second edit if the hook may have reformatted it.

Before calling work done, run `format:check`, `lint`, `typecheck`, `test:run` and `build`; CI runs the same.

## Layout

`src/` library (single public entry `src/index.ts`), `playground/` dev-only Vite app, `docs/` decisions, roadmap (`docs/roadmap.md`), feature docs and the learning checklist.
