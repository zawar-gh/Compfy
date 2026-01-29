const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, './src'); // Adjust if your source is somewhere else

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      fixFile(fullPath);
    }
  });
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Regex to remove any @version from import statements
  const regex = /(['"])([a-zA-Z0-9@\/\-]+)@[0-9.]+(['"])/g;

  if (regex.test(content)) {
    content = content.replace(regex, '$1$2$3'); // remove version
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed imports in: ${filePath}`);
  }
}

walkDir(projectDir);
console.log('All import versions removed.');
