---
name: project-docs
description: Update docs/PROJECT_OVERVIEW.md, docs/TECHNICAL_SPEC.md, and docs/CHANGELOG.md so they reflect the current project. Use when the user asks to update the project docs, log a change, sync documentation, or after finishing a chunk of work worth recording so nothing gets lost.
allowed-tools: Bash(git status:*) Bash(git diff:*) Bash(git log:*)
---

## Current repo state
!`git status --short`
!`git log --oneline -20`

## Task

1. Read `docs/PROJECT_OVERVIEW.md`, `docs/TECHNICAL_SPEC.md`, `docs/CHANGELOG.md`, and `CLAUDE.md` to establish what's currently documented.
2. Work out what actually changed since the docs were last updated — from the git status/log above, the diff of any unstaged/uncommitted work, and whatever was just discussed or built in this conversation. Don't guess; if something is unclear, ask the user rather than inventing details.
3. Update each doc, but only where something genuinely changed:
   - **PROJECT_OVERVIEW.md** — business purpose, goals, scope, current status. Update status (e.g. pre-code → in development → live) as it changes.
   - **TECHNICAL_SPEC.md** — architecture, tech stack, environments, integrations, open questions. Move an item out of "Open architecture questions" once it's decided.
   - **CHANGELOG.md** — append one new dated entry (`## YYYY-MM-DD`, today's date) summarizing what changed and why. Never edit or remove prior entries; if today's date already has an entry, add bullets to it instead of creating a duplicate heading.
4. Keep every edit factual and traceable to the code, git history, or this conversation — no speculative roadmap content.
5. Show the user a short summary of what was updated in each file (or state that a file needed no changes).
