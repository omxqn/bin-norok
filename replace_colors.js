const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // text colors
  { regex: /text-\[\#3C2415\]\/[0-9]+/g, replacement: 'text-muted-foreground' },
  { regex: /text-\[\#3C2415\]/g, replacement: 'text-foreground' },
  { regex: /text-\[\#C4A265\]\/[0-9]+/g, replacement: 'text-primary/70' },
  { regex: /text-\[\#C4A265\]/g, replacement: 'text-primary' },
  { regex: /text-\[\#1B6B4A\]/g, replacement: 'text-primary' },
  { regex: /text-\[\#8C154C\]/g, replacement: 'text-primary' },
  
  // bg colors
  { regex: /bg-\[\#3C2415\]/g, replacement: 'bg-foreground' },
  { regex: /bg-\[\#C4A265\]/g, replacement: 'bg-primary' },
  { regex: /bg-\[\#1B6B4A\]/g, replacement: 'bg-primary' },
  { regex: /bg-\[\#8C154C\]/g, replacement: 'bg-primary' },

  // border colors
  { regex: /border-\[\#3C2415\]/g, replacement: 'border-foreground' },
  { regex: /border-\[\#C4A265\]\/[0-9]+/g, replacement: 'border-primary/30' },
  { regex: /border-\[\#C4A265\]/g, replacement: 'border-primary' },
  
  // prose colors
  { regex: /prose-\[\#3C2415\]/g, replacement: 'prose-neutral' },
  
  // from/to gradients
  { regex: /from-\[\#3C2415\]/g, replacement: 'from-foreground' },
  { regex: /to-\[\#3C2415\]/g, replacement: 'to-foreground' },
  { regex: /to-\[\#1B6B4A\]/g, replacement: 'to-primary' },
  
  // globals.css primary
  { regex: /\[\#93005A\]/g, replacement: 'primary' } // Any lingering #93005A
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log("Color replacement complete.");
