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

const files = walkDir(path.join(process.cwd(), 'src'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // React router dom replacements
    if (content.includes('react-router-dom')) {
        // Link replacement
        if (content.includes('Link')) {
            content = content.replace(/import\s+{[^}]*Link[^}]*}\s+from\s+['"]react-router-dom['"];?/, (match) => {
                if (match.includes(',') || match.match(/{\s*Link\s*}/)) {
                   // Keep other imports if necessary
                   // Simplified logic: just add next/link, remove Link from react-router-dom
                }
                return match; // Will handle below
            });
        }
        
        // Comprehensive router dom replacement
        content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1) => {
            const imports = p1.split(',').map(s => s.trim());
            let nextNav = [];
            let nextLink = false;
            
            for (const imp of imports) {
                if (imp === 'Link') nextLink = true;
                if (imp === 'useNavigate') nextNav.push('useRouter');
                if (imp === 'useParams') nextNav.push('useParams');
                if (imp === 'useSearchParams') nextNav.push('useSearchParams');
                if (imp === 'useLocation') nextNav.push('usePathname');
            }
            
            let result = '';
            if (nextLink) result += "import Link from 'next/link';\n";
            if (nextNav.length > 0) result += `import { ${nextNav.join(', ')} } from 'next/navigation';\n`;
            
            return result;
        });
        changed = true;
    }

    // Replace to= with href= in Links (simple regex)
    if (content.includes('<Link ')) {
        content = content.replace(/<Link([^>]+)to=/g, '<Link$1href=');
        changed = true;
    }

    // Replace useNavigate with useRouter
    if (content.includes('useNavigate()')) {
        content = content.replace(/useNavigate\(\)/g, 'useRouter()');
        changed = true;
    }
    
    // Replace useLocation with usePathname
    if (content.includes('useLocation()')) {
        content = content.replace(/useLocation\(\)/g, 'usePathname()');
        // also replace location.pathname with pathname
        content = content.replace(/const\s+location\s*=\s*usePathname\(\);/g, 'const pathname = usePathname();');
        content = content.replace(/location\.pathname/g, 'pathname');
        changed = true;
    }

    // Convert export const PageName = () => to default export
    if (file.includes('src\\app\\') && file.endsWith('page.tsx')) {
        content = content.replace(/export\s+const\s+([A-Za-z0-9_]+)\s*:\s*React\.FC\s*=\s*\(\)\s*=>\s*{/g, 'export default function $1() {');
        changed = true;
    }

    // Add 'use client'; to client components
    if (file.includes('src\\app\\') && file.endsWith('page.tsx') && (content.includes('useState') || content.includes('useEffect') || content.includes('useRouter') || content.includes('useAuth') || content.includes('useParams') || content.includes('useSearchParams') || content.includes('framer-motion'))) {
        if (!content.startsWith("'use client';") && !content.startsWith('"use client";')) {
            content = "'use client';\n" + content;
            changed = true;
        }
    }
    
    if (file.includes('src\\components\\') && (content.includes('useState') || content.includes('useEffect') || content.includes('useRouter') || content.includes('useAuth') || content.includes('usePathname') || content.includes('createContext'))) {
        if (!content.startsWith("'use client';") && !content.startsWith('"use client";')) {
            content = "'use client';\n" + content;
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
}
