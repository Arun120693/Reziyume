/* eslint-disable */
// @ts-nocheck
const fs = require('fs');
const heicConvert = require('heic-convert');

(async () => {
  try {
    const inputBuffer = fs.readFileSync('Arun.jpg');
    console.log('Converting HEIC... size:', inputBuffer.length);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG',      // output format
      quality: 0.8         // the jpeg compression quality, between 0 and 1
    });
    fs.writeFileSync('Arun-converted.jpg', outputBuffer);
    console.log('Success! Converted to JPEG, size:', outputBuffer.length);
  } catch (err) {
    console.error('Error:', err);
  }
})();
