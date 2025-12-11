import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.join(__dirname, '../public');

// A valid 1x1 Pixel Red PNG (Base64) to serve as a placeholder
// This is enough to satisfy the browser and stop the 404 errors
const redIconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const iconBuffer = Buffer.from(redIconBase64, 'base64');

const files = [
    'pwa-192x192.png',
    'pwa-512x512.png',
    'apple-touch-icon.png'
];

console.log("🎨 Checking PWA Icons...");

files.forEach(file => {
    const filePath = path.join(targetDir, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, iconBuffer);
        console.log(`✅ Generated placeholder: ${file}`);
    } else {
        console.log(`ℹ️  Skipped (exists): ${file}`);
    }
});