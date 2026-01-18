# Sabor Divino - Project Instructions

You are working on a restaurant website using React (Vite), Tailwind CSS, Node.js (Express), and SQLite.

## Project Structure

```text
project-root/
├── src/                    # React frontend
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, Layout
│   │   └── ui/             # Buttons, Cards, Forms
│   ├── pages/              # Page components
│   └── App.jsx
├── server/                 # Express backend
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation
│   └── db/                 # Database, migrations
├── prd.json                # Project requirements
└── progress.txt            # Development log
```

## PRD Workflow

When working on this project:

1. Read `prd.json` for task list and dependencies
2. Read `progress.txt` for patterns and learnings (especially the "Codebase Patterns" section at top)
3. Select next task: lowest priority number where `passes: false` and all `depends_on` tasks have `passes: true`
4. Implement the task following the criteria
5. Run quality checks (`npm run lint`, `npm run build`, `npm test` if available)
6. Commit with message: `feat: [TASK_ID] - [Task Title]`
7. Update `prd.json` to set `passes: true`
8. Append progress to `progress.txt`

## Task Selection Rules

- Priority 1 = High, 2 = Medium, 3 = Low
- A task is blocked if any task in its `depends_on` array has `passes: false`
- Pick the lowest priority number among eligible tasks
- Work on ONE task per iteration

## Code Conventions

### Frontend (React + Tailwind)

- Use functional components with hooks
- Use Tailwind utility classes for styling
- Custom colors: `primary` (brown), `secondary` (gold), `accent` (green)
- Components in `src/components/`, pages in `src/pages/`

### Backend (Express + SQLite)

- ESM imports (`import/export`)
- Routes in `server/routes/`, aggregated in `server/routes/index.js`
- Use async/await with asyncHandler wrapper
- Validation middleware for POST/PUT endpoints
- Error responses: `{ error: "message" }`
- Success responses: `{ data }` or `{ message }`

### Database (better-sqlite3)

- Always use `IF NOT EXISTS` in migrations
- Use parameterized queries (never string interpolation)
- Database file: `server/restaurant.db`

## Progress Log Format

Append to `progress.txt`:

```markdown
## [Date] - [TASK_ID]

Thread: [thread URL if available]

**Implemented:**

- What was done

**Files Changed:**

- file1.js
- file2.jsx

**Learnings:**

- Patterns discovered
- Gotchas encountered

---
```

## Codebase Patterns

Add reusable patterns to the TOP of `progress.txt` in the "## Codebase Patterns" section.

## Stop Condition

When ALL tasks have `passes: true`, respond with:

```html
<promise>COMPLETE</promise>
```
