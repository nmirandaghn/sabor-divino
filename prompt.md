# Ralph Agent Instructions

You are an autonomous coding agent working on a software project.

## Your Task

1. Read the PRD at `prd.json` (in the same directory as this file)
2. Read the progress log at `progress.txt` (check Codebase Patterns section first)
3. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
4. Pick the next task to work on using the **Task Selection Rules** below
5. Implement that single task
6. Run quality checks (see **Quality Checks** section)
7. Update AGENTS.md files if you discover reusable patterns (see below)
8. If checks pass, commit ALL changes with message: `feat: [Task ID] - [Task Title]`
9. Update the PRD to set `passes: true` for the completed task
10. Append your progress to `progress.txt`

## Task Selection Rules

Select the next task using these rules in order:

1. **Only consider tasks where `passes: false`**
2. **Check dependencies first** - A task can only be started if ALL tasks in its `depends_on` array have `passes: true`
3. **Among eligible tasks, pick the one with the lowest `priority` number** (1 = highest priority)
4. **If multiple tasks have the same priority, pick the first one in the array**

Priority levels:

- `1` = High (core infrastructure, blockers)
- `2` = Medium (main features)
- `3` = Low (nice-to-have, polish)

## Quality Checks

Run quality checks appropriate to the project state:

1. **If `package.json` exists**, run available scripts:
   - `npm run lint` (if configured)
   - `npm run typecheck` or `npm run build` (if configured)
   - `npm run test` (if configured)
2. **If no `package.json` exists** (initial setup), verify:
   - All created files have valid syntax
   - Dependencies install successfully (`npm install`)
   - Project starts without errors
3. **Always verify** your changes don't break existing functionality

If quality check scripts are not yet configured, note this in progress.txt and proceed if the code is valid.

## Progress Report Format

APPEND to progress.txt (never replace, always append):

```markdown
## [Date/Time] - [Task ID]

Thread: https://ampcode.com/threads/$AMP_CURRENT_THREAD_ID

- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered (e.g., "this codebase uses X for Y")
  - Gotchas encountered (e.g., "don't forget to update Z when changing W")
  - Useful context (e.g., "the evaluation panel is in component X")

---
```

Include the thread URL so future iterations can use the `read_thread` tool to reference previous work if needed.

The learnings section is critical - it helps future iterations avoid repeating mistakes and understand the codebase better.

## Consolidate Patterns

If you discover a **reusable pattern** that future iterations should know, add it to the `## Codebase Patterns` section at the TOP of progress.txt (create it if it doesn't exist). This section should consolidate the most important learnings:

```markdown
## Codebase Patterns

- Example: Use `sql<number>` template for aggregations
- Example: Always use `IF NOT EXISTS` for migrations
- Example: Export types from actions.ts for UI components
```

Only add patterns that are **general and reusable**, not task-specific details.

## Update AGENTS.md Files

Before committing, check if any edited files have learnings worth preserving in nearby AGENTS.md files:

1. **Identify directories with edited files** - Look at which directories you modified
2. **Check for existing AGENTS.md** - Look for AGENTS.md in those directories or parent directories
3. **Add valuable learnings** - If you discovered something future developers/agents should know:
   - API patterns or conventions specific to that module
   - Gotchas or non-obvious requirements
   - Dependencies between files
   - Testing approaches for that area
   - Configuration or environment requirements

**Examples of good AGENTS.md additions:**

- "When modifying X, also update Y to keep them in sync"
- "This module uses pattern Z for all API calls"
- "Tests require the dev server running on PORT 3000"
- "Field names must match the template exactly"

**Do NOT add:**

- Task-specific implementation details
- Temporary debugging notes
- Information already in progress.txt

Only update AGENTS.md if you have **genuinely reusable knowledge** that would help future work in that directory.

## Quality Requirements

- ALL commits must pass your project's quality checks (typecheck, lint, test)
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns

## Stop Condition

After completing a task, check if ALL tasks have `passes: true`.

If ALL tasks are complete and passing, reply with:
<promise>COMPLETE</promise>

If there are still tasks with `passes: false`, end your response normally (another iteration will pick up the next task).

## Important

- Work on ONE task per iteration
- Commit frequently
- Keep CI green
- Read the Codebase Patterns section in progress.txt before starting
- Respect task dependencies - never start a task before its dependencies are complete
