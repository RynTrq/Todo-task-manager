const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { main } = require('../todo');

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.join(dir, 'tasks.json');
}
test('adds, lists, and removes tasks in an isolated store', t => {
  const file = fixture(t);
  const lines = [];
  main(['add', 'Review', 'API'], file, () => {});
  main(['list'], file, line => lines.push(line));
  assert.deepEqual(lines, ['1. Review API']);
  main(['remove', 'Review API'], file, () => {});
  assert.deepEqual(JSON.parse(fs.readFileSync(file)), []);
});
test('rejects invalid arguments without changing existing data', t => {
  const file = fixture(t);
  fs.writeFileSync(file, '[{"task":"keep"}]');
  for (const args of [[], ['add'], ['remove', '  '], ['other'], ['list','unexpected']]) {
    assert.throws(() => main(args, file, () => {}), /Usage/);
  }
  assert.equal(fs.readFileSync(file, 'utf8'), '[{"task":"keep"}]');
});
test('refuses malformed or corrupt data instead of overwriting it', t => {
  const file = fixture(t);
  for (const content of ['invalid json', '{}', '[{"wrong":"field"}]']) {
    fs.writeFileSync(file, content);
    assert.throws(() => main(['add', 'new'], file, () => {}));
    assert.equal(fs.readFileSync(file, 'utf8'), content);
  }
});
test('store path does not depend on caller working directory', t => {
  const file = fixture(t);
  main(['add', 'hello'], file, () => {});
  assert.deepEqual(JSON.parse(fs.readFileSync(file)), [{ task: 'hello' }]);
});
