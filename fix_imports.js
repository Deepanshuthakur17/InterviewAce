import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walkDir(path.join(process.cwd(), 'src', 'app'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Calculate how many levels deep we are from src
    // src/app/auth/page.tsx -> depth 2 (app, auth)
    // src/app/feedback/[historyId]/page.tsx -> depth 3 (app, feedback, [historyId])
    const relativeToSrc = path.relative(path.join(process.cwd(), 'src'), path.dirname(file));
    const depth = relativeToSrc.split(path.sep).length;
    
    // Instead of computing relative paths, let's just use the @ alias we set up in tsconfig!
    // Replace ../components with @/components
    // Replace ../lib with @/lib
    // Replace ../../components with @/components
    
    const newContent = content.replace(/(\.\.\/)+components/g, '@/components')
                              .replace(/(\.\.\/)+lib/g, '@/lib')
                              .replace(/(\.\.\/)+app/g, '@/app');
                              
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log(`Updated imports in ${file}`);
    }
}

// Also update layout.tsx
const layoutFile = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
if (fs.existsSync(layoutFile)) {
    let content = fs.readFileSync(layoutFile, 'utf-8');
    content = content.replace(/(\.\.\/)+components/g, '@/components')
                     .replace(/(\.\.\/)+index\.css/g, '@/app/globals.css'); // globals.css is in app
    fs.writeFileSync(layoutFile, content, 'utf-8');
}

// Also update components
const componentFiles = walkDir(path.join(process.cwd(), 'src', 'components'));
for (const file of componentFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    const newContent = content.replace(/(\.\.\/)+components/g, '@/components')
                              .replace(/(\.\.\/)+lib/g, '@/lib');
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log(`Updated imports in ${file}`);
    }
}
