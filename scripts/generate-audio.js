import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.join(__dirname, '../public/sounds');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Open Source Sound URLs
const SOUNDS = {
    'click.mp3': 'https://www.soundjay.com/buttons/sounds/button-30.mp3',
    // CHANGED: Using a calm bell ringing sound instead of microwave bell
    'alarm.mp3': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
};

async function downloadSounds() {
    console.log("⬇️  Updating PomoZen Sounds...");

    // 1. Force remove the old aggressive alarm if it exists
    const alarmPath = path.join(targetDir, 'alarm.mp3');
    if (fs.existsSync(alarmPath)) {
        fs.unlinkSync(alarmPath);
        console.log("🗑️  Deleted old aggressive alarm.");
    }

    // 2. Download new files
    for (const [filename, url] of Object.entries(SOUNDS)) {
        const filePath = path.join(targetDir, filename);

        // Skip click.mp3 if we already have it (to save time)
        if (filename === 'click.mp3' && fs.existsSync(filePath)) {
            continue;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Downloaded new: ${filename}`);
        } catch (error) {
            console.error(`❌ Error downloading ${filename}:`, error.message);
        }
    }
}

downloadSounds();