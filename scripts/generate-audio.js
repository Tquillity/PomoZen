import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.join(__dirname, '../public/sounds');

if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
}

// 1 second of silence (MP3) - base64
const dummyMp3 = Buffer.from('//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', 'base64');

const files = ['rain.mp3', 'forest.mp3', 'white_noise.mp3', 'click.mp3', 'alarm.mp3'];

files.forEach(file => {
    fs.writeFileSync(path.join(targetDir, file), dummyMp3);
    console.log(`Created placeholder: public/sounds/${file}`);
});