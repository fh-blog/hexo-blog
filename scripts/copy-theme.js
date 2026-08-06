const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'hexo-theme-landscape');
const dest = path.join(__dirname, '..', 'themes', 'landscape');

if (!fs.existsSync(src)) {
  console.error('❌ hexo-theme-landscape not found in node_modules');
  process.exit(1);
}

if (fs.existsSync(dest)) {
  console.log('⏭️  Theme already exists at themes/landscape, skipping copy');
} else {
  fs.cpSync(src, dest, { recursive: true });
  console.log('✅ Theme copied to themes/landscape');
}
