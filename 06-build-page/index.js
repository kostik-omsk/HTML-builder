const fs = require('fs').promises;
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const assetsDirPath = path.join(__dirname, 'assets');
const stylesDir = path.join(__dirname, 'styles');
const bundleCSSPath = path.join(projectDir, 'style.css');

async function readFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

async function replaceTags(content, tag, replacement) {
  const regex = new RegExp(`{{${tag}}}`, 'g');
  return content.replace(regex, replacement);
}

async function addComponents() {
  const componentsDir = path.join(__dirname, 'components');
  const files = await fs.readdir(componentsDir);
  const components = {};

  for (const file of files) {
    const componentName = path.parse(file).name;
    const filePath = path.join(componentsDir, file);
    const content = await readFile(filePath);
    components[componentName] = content;
  }

  let template = await readFile(path.join(__dirname, 'template.html'));

  for (const [tag, replacement] of Object.entries(components)) {
    template = await replaceTags(template, tag, replacement);
  }
  return template;
}

async function writeOutput(content) {
  const outputPath = path.join(projectDir, 'index.html');
  await fs.writeFile(outputPath, content, 'utf-8');
  console.log('index.html created!');
}

async function createStyleBundle() {
  const cssFiles = (await fs.readdir(stylesDir)).filter((file) => path.extname(file) === '.css');
  const bundleContent = await Promise.all(
    cssFiles.map((file) => fs.readFile(path.join(stylesDir, file), 'utf-8')),
  );
  await fs.writeFile(bundleCSSPath, bundleContent.join('\n'), 'utf8');
  console.log('style.css created!');
}

async function copyDir(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });

  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async function () {
  try {
    await copyDir(assetsDirPath, path.join(projectDir, 'assets'));
    console.log('Assets directory copied!');
    const templateContent = await addComponents();
    await writeOutput(templateContent);
    await createStyleBundle();
  } catch (err) {
    console.error(err);
  }
})();

// первый вариант исполнения до оптимизации
// const fs = require('fs');
// const path = require('path');

// const projectDir = path.join(__dirname, 'project-dist');
// const assetsDirPath = path.join(__dirname, 'assets');
// const stylesDir = path.join(__dirname, 'styles');
// const bundleCSSPath = path.join(projectDir, 'style.css');

// async function readFile(filePath) {
//   const content = await fs.promises.readFile(filePath, 'utf-8');
//   return content;
// }

// async function replaceTags(content, tag, replacement) {
//   const regex = new RegExp(`{{${tag}}}`, 'g');
//   return content.replace(regex, replacement);
// }

// async function addComponents() {
//   const componentsDir = path.join(__dirname, 'components');
//   const files = await fs.promises.readdir(componentsDir);
//   const components = {};

//   for (const file of files) {
//     const componentName = path.parse(file).name;
//     const filePath = path.join(componentsDir, file);
//     const content = await readFile(filePath);
//     components[componentName] = content;
//   }
//   let template = await readFile(path.join(__dirname, 'template.html'));
//   for (const [tag, replacement] of Object.entries(components)) {
//     template = await replaceTags(template, tag, replacement);
//   }
//   return template;
// }

// async function writeOutput(content) {
//   const outputPath = path.join(projectDir, 'index.html');
//   await fs.promises.writeFile(outputPath, content, 'utf-8');
//   console.log('The index.html file has been created!');
// }

// addComponents()
//   .then(writeOutput)
//   .catch((err) => {
//     console.error(err);
//   });

// fs.readdir(stylesDir, (err, files) => {
//   if (err) throw err;
//   const cssFiles = files.filter((file) => path.extname(file) === '.css');
//   const bundle = [];
//   for (let file of cssFiles) {
//     const filePath = path.join(stylesDir, file);
//     fs.readFile(filePath, 'utf-8', (err, content) => {
//       if (err) throw err;
//       bundle.push(content);

//       if (bundle.length === cssFiles.length)
//         fs.writeFile(bundleCSSPath, bundle.join('\n'), 'utf8', (err) => {
//           if (err) throw err;
//           console.log('style.css created!');
//         });
//     });
//   }
// });

// async function copyDir(srcDir, destDir) {
//   await fs.promises.mkdir(destDir, { recursive: true });
//   const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });
//   for (let entry of entries) {
//     const srcPath = path.join(srcDir, entry.name);
//     const destPath = path.join(destDir, entry.name);

//     if (entry.isDirectory()) {
//       await copyDir(srcPath, destPath);
//     } else {
//       await fs.promises.copyFile(srcPath, destPath);
//     }
//   }
// }
// copyDir(assetsDirPath, path.join(projectDir, 'assets'))
//   .then(() => {
//     console.log('copy directory assets!');
//   })
//   .catch((err) => console.log(err));
