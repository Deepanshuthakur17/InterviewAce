const fs=require('fs');
const path=require('path');

function walk(d){
    let r=[];
    fs.readdirSync(d).forEach(f=>{
        f=path.join(d,f);
        if(fs.statSync(f).isDirectory()) r=r.concat(walk(f));
        else if(f.endsWith('.tsx')||f.endsWith('.ts')) r.push(f);
    });
    return r;
}

walk('src').forEach(f=>{
    let c=fs.readFileSync(f,'utf-8');
    // Replace navigate(...) with navigate.push(...)
    let n=c.replace(/navigate\(['"`]/g, "navigate.push('").replace(/navigate.push\('`/g, "navigate.push(`").replace(/navigate.push\('"/g, "navigate.push(\"");
    
    // Also fix the useParams from next/navigation. Next.js App router passes params as a Promise to pages in Next 15, but useParams hook works.
    // However, useParams returns `Record<string, string | string[]> | null`.
    
    // Also NextAuth session provider
    if (n !== c) {
        fs.writeFileSync(f,n);
        console.log('Fixed navigate in '+f);
    }
});
