---
name: pr-description
description: Generate a structured PR description (summary and test plan) from the diff between the current branch and its base branch. Use when the user asks for a PR description, wants to open a PR, or asks what a branch changes.
disable-model-invocation: true
allowed-tools: Bash(git log:*) Bash(git diff:*) Bash(git merge-base:*) Bash(gh pr view:*) Bash(gh pr create:*)
---

## Branch changes
!`git log --oneline $(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master)..HEAD 2>/dev/null || git log --oneline -10`
!`git diff $(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master)...HEAD 2>/dev/null || git diff HEAD`

## Task

1. Read the commits and diff above to understand the full scope of the branch, not just the latest commit.
2. Write a PR description with:
   - **Summary**: 1-3 bullets on what changed and why — the why matters more than a restatement of the diff.
   - **Test plan**: concrete steps or commands to verify the change, as a checklist.
3. Keep it terse — reviewers skim.
4. If the user wants it opened as an actual PR, use `gh pr create` with this description; otherwise just output the description as text and let the user decide.
