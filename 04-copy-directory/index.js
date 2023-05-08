const fs = require('fs');
const path = require('path');

const origDirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

async function copyDirectory(origDir, copyDir) {
  await fs.promises.rm(copyDir, { recursive: true, force: true });
  await fs.promises.mkdir(copyDir, { recursive: true });
  const files = await fs.promises.readdir(origDir, { withFileTypes: true });
  for (const file of files) {
    const srcPath = path.join(origDir, file.name);
    const destPath = path.join(copyDir, file.name);
    if (file.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

copyDirectory(origDirPath, copyDirPath);
