const fs = require('node:fs');
const path = require('node:path');

function readTasks(filePath) {
  let raw;
  try { raw = fs.readFileSync(filePath, 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const tasks = JSON.parse(raw);
  if (!Array.isArray(tasks) || tasks.some(item => !item || typeof item.task !== 'string')) {
    throw new Error('Task file must contain an array of task objects.');
  }
  return tasks;
}

function writeTasks(filePath, tasks) {
  const temp = filePath + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(tasks, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(temp, filePath);
}

function main(args, filePath = path.join(__dirname, 'tasks.json'), output = console.log) {
  const [command, ...words] = args;
  const task = words.join(' ').trim();
  if (!['add', 'list', 'remove'].includes(command) || (command !== 'list' && !task) || (command === 'list' && words.length)) {
    throw new Error('Usage: node todo.js add "task" | list | remove "task"');
  }
  const tasks = readTasks(filePath);
  if (command === 'list') {
    tasks.forEach((item, index) => output((index + 1) + '. ' + item.task));
    return;
  }
  if (command === 'add') {
    tasks.push({ task });
    writeTasks(filePath, tasks);
    output('Task added.');
  } else {
    const remaining = tasks.filter(item => item.task !== task);
    writeTasks(filePath, remaining);
    output('Removed ' + (tasks.length - remaining.length) + ' matching task(s).');
  }
}

if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { main, readTasks };
