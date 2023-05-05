const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  const bundle = [];
  for (let file of cssFiles) {
    const filePath = path.join(stylesDir, file);
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) throw err;
      bundle.push(content);

      if (bundle.length === cssFiles.length)
        fs.writeFile(bundlePath, bundle.join('\n'), 'utf8', (err) => {
          if (err) throw err;
          console.log('bundle.css created!');
        });
    });
  }
});
