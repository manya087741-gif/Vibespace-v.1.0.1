import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DiskPersistence } from '../src/server/dbPersistence';

test('DiskPersistence: saves state atomically and loads successfully', () => {
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibespace-test-'));
  const persistence = new DiskPersistence(testDir);

  const initialData = {
    backendState: {
      posts: [{ id: 'post_test_1', caption: 'Initial test post', likesCount: 42 }],
      wallet: { availableBalance: 15000 },
    },
    securityState: {
      twoFactorEnabled: true,
      emergencyLockdown: false,
    },
  };

  const saved = persistence.save(initialData);
  assert.equal(saved, true, 'Save should return true');

  // Verify file was written to disk
  assert.equal(fs.existsSync(persistence.getDbFilePath()), true, 'db.json must exist');

  // Load into fresh container
  const target: { backendState: any; securityState: any } = { backendState: {}, securityState: {} };
  const loaded = persistence.load(target);
  assert.equal(loaded, true, 'Load should return true');
  assert.equal(target.backendState.posts[0].caption, 'Initial test post');
  assert.equal(target.backendState.wallet.availableBalance, 15000);
  assert.equal(target.securityState.twoFactorEnabled, true);

  // Clean up
  fs.rmSync(testDir, { recursive: true, force: true });
});

test('DiskPersistence: updates existing state without data corruption', () => {
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibespace-test-'));
  const persistence = new DiskPersistence(testDir);

  const state: { backendState: any; securityState: any } = {
    backendState: { counter: 1, items: ['alpha'] },
    securityState: { failedAttempts: 0 },
  };

  persistence.save(state);

  // Mutate state
  state.backendState.counter = 2;
  state.backendState.items.push('beta');
  state.securityState.failedAttempts = 1;
  persistence.save(state);

  const reloaded: { backendState: any; securityState: any } = { backendState: {}, securityState: {} };
  persistence.load(reloaded);

  assert.equal(reloaded.backendState.counter, 2);
  assert.deepEqual(reloaded.backendState.items, ['alpha', 'beta']);
  assert.equal(reloaded.securityState.failedAttempts, 1);

  // Clean up
  fs.rmSync(testDir, { recursive: true, force: true });
});

test('DiskPersistence: handles corrupt JSON gracefully without crashing', () => {
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vibespace-test-'));
  const persistence = new DiskPersistence(testDir);

  // Write garbage into db.json
  fs.writeFileSync(persistence.getDbFilePath(), '{{INVALID_JSON:::');

  const defaultState = {
    backendState: { posts: [] },
    securityState: { safe: true },
  };

  const result = persistence.load(defaultState);
  assert.equal(result, false, 'Load on corrupt file should return false gracefully');
  assert.equal(defaultState.securityState.safe, true, 'Original state must be preserved');

  // Clean up
  fs.rmSync(testDir, { recursive: true, force: true });
});
