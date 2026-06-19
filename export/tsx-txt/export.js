/**
 * tsx-to-txt Export Script
 * 
 * This script walks through the documentation feature files under `src/features/docs`,
 * copies all `.tsx` files, and saves them in the current directory (`export/tsx-txt/`)
 * with a `.txt` extension.
 * 
 * Usage:
 * Run this script using Node from the workspace root:
 * 
 *   node export/tsx-txt/export.js
 * 
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source directory relative to the workspace root
const sourceDir = path.resolve(__dirname, '../../src/features/docs');

// Target directory (the directory where this script is located)
const targetBaseDir = __dirname;

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile()) {
      callback(filePath);
    }
  }
}

function exportFiles() {
  console.log('Starting file export...');

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory does not exist: ${sourceDir}`);
    return;
  }

  let count = 0;

  walkDir(sourceDir, (filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.tsx') {
      const relativePath = path.relative(sourceDir, filePath);
      const relativePathParsed = path.parse(relativePath);
      const destRelativePath = path.join(relativePathParsed.dir, `${relativePathParsed.name}.txt`);
      const destFilePath = path.join(targetBaseDir, destRelativePath);

      // Create target directory if it doesn't exist
      const destDir = path.dirname(destFilePath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(filePath, destFilePath);
      count++;
    }
  });

  console.log(`Exported ${count} files from ${sourceDir} to ${targetBaseDir} (converted extension to .txt)`);
  console.log('Export completed successfully.');
}

exportFiles();

