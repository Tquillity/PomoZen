import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.join(__dirname, '../public');
const faviconPath = path.join(targetDir, 'favicon.png');

const files = [
    { name: 'pwa-192x192.png', width: 192, height: 192 },
    { name: 'pwa-512x512.png', width: 512, height: 512 },
    { name: 'apple-touch-icon.png', width: 180, height: 180 }
];

console.log("🎨 Generating PWA Icons...");

// Check if favicon exists, otherwise create solid color icons
const useFavicon = fs.existsSync(faviconPath);

files.forEach(({ name, width, height }) => {
    const filePath = path.join(targetDir, name);
    
    try {
        if (useFavicon) {
            // Resize favicon to target size
            execSync(`convert "${faviconPath}" -resize ${width}x${height} -background none -gravity center -extent ${width}x${height} "${filePath}"`, { stdio: 'ignore' });
        } else {
            // Create solid red PNG if no favicon
            execSync(`convert -size ${width}x${height} xc:"#c15c5c" "${filePath}"`, { stdio: 'ignore' });
        }
        const stats = fs.statSync(filePath);
        console.log(`✅ Generated: ${name} (${width}x${height}, ${stats.size} bytes)`);
    } catch (error) {
        console.error(`❌ Error generating ${name}:`, error.message);
    }
});