---
name: commit-message
description: Generate a conventional commit message from staged/unstaged changes and commit them. Use when the user asks to commit changes, write a commit message, or wants help committing.
disable-model-invocation: true
allowed-tools: Bash(git status:*) Bash(git diff:*) Bash(git add:*) Bash(git commit:*) Bash(git log:*) Bash(git push:*)
---

## Current changes
!`git status --short`
!`git diff HEAD`

## Task

1. Review the staged and unstaged changes above.
2. If nothing is staged, stage the relevant files — ask first if unrelated changes are mixed in rather than staging everything blindly.
3. Write a commit message: imperative mood, a one-line summary under ~72 characters, and an optional body explaining *why* (not what) only if the change isn't self-evident from the diff.
4. Run `git commit -m "..."` and show `git log --oneline -1` to confirm.
5. Push with `git push`. If the current branch has no upstream, use `git push -u origin HEAD` instead.
6. Do not skip hooks (`--no-verify`), force-push, or amend an existing commit unless the user explicitly asks.
