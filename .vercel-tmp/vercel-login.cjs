#!/usr/bin/env node
/**
 * Vercel CLI Login Authorization Script (Cross-Platform)
 */
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';

function createSecureLogFile() {
  const tmpDir = path.join(process.cwd(), '.vercel-tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  return path.join(tmpDir, 'login.log');
}

const LOG_FILE = createSecureLogFile();

function log(msg) {
  console.error(msg);
}

function checkVercelInstalled() {
  try {
    const result = spawnSync('vercel', ['--version'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows });
    log(`Vercel CLI version: ${(result.stdout || '').trim()}`);
    return true;
  } catch {
    log('Error: Vercel CLI is not installed');
    return false;
  }
}

function checkLoginStatus() {
  try {
    const result = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output) {
      log(`Logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}

async function waitForAuthUrl() {
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const match = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+(?=\s|$)/);
        if (match) return match[0];
      }
    } catch {}
  }
  return null;
}

function startBackgroundLogin() {
  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('vercel', ['login'], {
    detached: true,
    stdio: ['ignore', logStream, logStream],
    shell: isWindows
  });
  child.unref();
  return child.pid;
}

async function main() {
  log('========================================');
  log('Vercel CLI Login Authorization');
  log('========================================');
  log('');

  if (!checkVercelInstalled()) process.exit(1);

  if (checkLoginStatus()) {
    log('Already logged in');
    console.log(JSON.stringify({ status: 'already_logged_in' }));
    process.exit(0);
  }

  log('Starting login...');
  startBackgroundLogin();
  const authUrl = await waitForAuthUrl();

  if (authUrl) {
    log(`Authorization URL: ${authUrl}`);
    console.log(JSON.stringify({ status: 'needs_auth', auth_url: authUrl }));
  } else {
    log('Failed to get authorization URL');
    process.exit(1);
  }
}

main();
