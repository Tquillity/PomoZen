import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.join(__dirname, '../public/sounds');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Open Source Sound URLs (Direct MP3 links)
const SOUNDS = {
    'click.mp3': 'https://www.soundjay.com/buttons/sounds/button-30.mp3', // Sharp UI click
    'alarm.mp3': 'https://www.soundjay.com/clock/sounds/alarm-clock-01.mp3' // Standard digital alarm
};

async function downloadSounds() {
    console.log("⬇️  Downloading UI Sounds...");

    for (const [filename, url] of Object.entries(SOUNDS)) {
        const filePath = path.join(targetDir, filename);

        // Only download if missing or 0 bytes (to save bandwidth)
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
            console.log(`✅ ${filename} already exists.`);
            continue;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Downloaded: ${filename}`);
        } catch (error) {
            console.error(`❌ Error downloading ${filename}:`, error.message);
        }
    }
}

downloadSounds();