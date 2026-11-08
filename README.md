# Node.js Task Manager

A small command-line task manager with local JSON persistence and no third-party runtime dependencies.

## Usage

Use Node.js 20 or newer.

```bash
git clone https://github.com/RynTrq/Todo-task-manager.git
cd Todo-task-manager
node todo.js add "Review API changes"
node todo.js list
node todo.js remove "Review API changes"
```

Tasks are stored in `tasks.json` beside the script, regardless of the shell's working directory. Removing a task deletes all exact text matches.

## Reliability

Empty tasks and unknown commands are rejected. Missing storage starts as an empty list; corrupt JSON, invalid records, and read failures stop the command without overwriting the original data. Writes use a temporary file followed by rename.

This is a single-user learning project. Concurrent writers are not coordinated.

## Tests

```bash
node --test
```

Tests use temporary directories and cover the add/list/remove flow, argument validation, and preservation of corrupt data.

[Portfolio](https://ryntrq.vercel.app) · [GitHub](https://github.com/RynTrq)
