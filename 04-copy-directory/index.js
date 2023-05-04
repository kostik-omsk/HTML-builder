const fs = require('fs');
const path = require('path');

const origDirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

async function copyDir(origDir, copyDir) {
  await fs.promises.mkdir(copyDir, { recursive: true });
  const files = await fs.promises.readdir(origDir);
  for (const file of files) {
    const srcPath = path.join(origDir, file);
    const destPath = path.join(copyDir, file);
    await fs.promises.copyFile(srcPath, destPath);
  }
}

copyDir(origDirPath, copyDirPath);
