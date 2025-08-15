#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

const testFiles = [
  'tests/etl/gallery-etl.test.ts',
  'tests/api/gallery-api.test.ts', 
  'tests/ui/course-dates.test.tsx'
];

console.log('🧪 Running Jest tests for K&K Barber Academy\n');

// Run jest with our config
const jestArgs = [
  '--config', 'jest.config.js',
  '--verbose',
  '--no-coverage',
  ...testFiles
];

const jest = spawn('npx', ['jest', ...jestArgs], {
  stdio: 'inherit',
  shell: true
});

jest.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log(`\n❌ Tests failed with exit code ${code}`);
  }
  process.exit(code);
});

jest.on('error', (error) => {
  console.error('Error running tests:', error);
  process.exit(1);
});