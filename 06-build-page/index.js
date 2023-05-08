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

  const files = await fs.readdir(srcDir, { withFileTypes: true });

  for (let file of files) {
    const srcPath = path.join(srcDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isDirectory()) {
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
