#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, copyFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏗️  Starting custom build process...');

try {
  // Restore vite config if it was backed up
  const vitePath = join(__dirname, 'vite.config.js.backup');
  const viteTarget = join(__dirname, 'vite.config.ts');
  
  try {
    if (existsSync(vitePath)) {
      copyFileSync(vitePath, viteTarget);
      console.log('📦 Restored vite.config.ts');
    }
  } catch (e) {
    console.log('⚠️  Could not restore vite config, continuing...');
  }
  
  // Run TypeScript check
  console.log('🔍 Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  // Run Vite build
  console.log('⚡ Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}