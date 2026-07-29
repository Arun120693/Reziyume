const fs = require('fs');
const buffer = fs.readFileSync('Arun.jpg');
const arr = new Uint8Array(buffer.slice(0, 16));
const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
console.log('Hex:', hex);
console.log('Is ftyp?', hex.includes('66747970'));
