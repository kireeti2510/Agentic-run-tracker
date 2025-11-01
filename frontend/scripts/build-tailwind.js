const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
// Use the PostCSS plugin package for Tailwind (matches postcss.config.js).
const tailwind = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

(async () => {
  try {
    const inputPath = path.join(__dirname, '..', 'app', 'globals.css');
    const input = fs.readFileSync(inputPath, 'utf8');
    const result = await postcss([tailwind(path.join(__dirname, '..', 'tailwind.config.js')), autoprefixer]).process(input, { from: inputPath });
    const outDir = path.join(__dirname, '..', 'public');
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'tailwind-test.css');
    fs.writeFileSync(outPath, result.css, 'utf8');
    console.log('WROTE', outPath);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
