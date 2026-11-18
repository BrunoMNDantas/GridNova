# Claude Code learning checklist

Status: `[ ]` not started, `[~]` introduced, `[x]` evaluated. Add a one-line verdict when evaluated.

- [~] **CLAUDE.md**: minimal collaboration rules and objectives written. Next: add real commands after scaffolding.
- [~] **Decision log**: `docs/decisions.md` separates approved decisions from proposals. Next: link from CLAUDE.md commands once scaffolded.
- [~] **Context management and planning**: plan mode used for the foundation scaffold (plan reviewed and approved before any file was written). Next: one session per feature, with `/clear` or a new session between features; continuity through CLAUDE.md, decisions, roadmap and feature docs (see "Session workflow" in CLAUDE.md). Try `/compact` with a focus when a session gets long.
- [ ] **Skills**: candidate: a "new feature" skill that creates the feature doc and checklist.
- [~] **Hooks**: first hook live (2026-11-18): `.claude/settings.json` runs `.claude/hooks/format.mjs` (Prettier on the file) after every Edit/Write. Verified by editing a file with bad formatting and seeing it fixed. Evaluate after a few features: does it save time, does it ever surprise us? Next candidate: block commits without approval.
- [ ] **Subagents**: candidate: an independent reviewer for public API changes.
- [ ] **MCP**: candidate: GitHub for issues/PRs, or a browser tool to check the playground.
