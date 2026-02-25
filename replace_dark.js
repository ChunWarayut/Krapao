const fs = require('fs');
const path = require('path');

const regex = /\b([a-z:]*(?:text|bg|border|stroke|ring|fill|from|via|to))-[a-zA-Z0-9/\[\]#-]+\s+dark:(\1-[a-zA-Z0-9/\[\]#-]+)\b/g;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let og = content;
            content = content.replace(regex, '$2');
            if (content !== og) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

processDir('./src');
