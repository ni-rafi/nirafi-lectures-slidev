import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source directories relative to the workspace root
const sourceDirs = {
  'dev-guide': path.resolve(__dirname, '../../src/features/presentation/components/docs/dev-guide'),
  'user-guide': path.resolve(__dirname, '../../src/features/presentation/components/docs/user-guide')
};

// Target directory (the directory where this script is located)
const targetBaseDir = __dirname;

function exportFiles() {
  console.log('Starting file export...');

  for (const [subDir, srcPath] of Object.entries(sourceDirs)) {
    if (!fs.existsSync(srcPath)) {
      console.error(`Source directory does not exist: ${srcPath}`);
      continue;
    }

    const destPath = path.join(targetBaseDir, subDir);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
      console.log(`Created destination subdirectory: ${destPath}`);
    }

    const files = fs.readdirSync(srcPath);
    let count = 0;

    for (const file of files) {
      const srcFilePath = path.join(srcPath, file);
      const stat = fs.statSync(srcFilePath);

      if (stat.isFile()) {
        const ext = path.extname(file);
        if (ext === '.tsx') {
          const baseName = path.basename(file, ext);
          // Change extension from .tsx to .txt
          const destFileName = `${baseName}.txt`;
          const destFilePath = path.join(destPath, destFileName);

          fs.copyFileSync(srcFilePath, destFilePath);
          count++;
        }
      }
    }

    console.log(`Exported ${count} files from ${subDir} to ${destPath} (converted extension to .txt)`);
  }

  console.log('Export completed successfully.');
}

exportFiles();
