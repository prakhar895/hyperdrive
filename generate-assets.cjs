const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirs = ['front', 'profile', 'rear'];

for (const dir of dirs) {
  const dirPath = path.join(__dirname, 'public', 'vehicle', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 1. base.webp — neutral grayscale render of the car
  // Studio dark background (#0C0C0E) + grayscale body (#3A3D46) + floor shadow (#000000)
  execSync(`convert -size 1920x1080 xc:"#0C0C0E" \
    -fill "#15171D" -draw "rectangle 0,600 1920,1080" \
    -fill "#000000" -draw "ellipse 960,820 680,60 0,360" \
    -fill "#2E313A" -draw "polygon 350,750 480,560 720,520 1200,520 1480,580 1600,750 1560,780 1220,780 1140,710 1020,710 960,780 580,780 500,710 380,710 320,780" \
    -fill "#121317" -draw "polygon 680,520 780,410 1140,410 1220,520" \
    -fill "#08090C" -draw "polygon 720,510 800,430 1110,430 1180,510" \
    -fill "#6B7280" -font DejaVu-Sans -pointsize 22 -gravity South -annotate +0+40 "HYPERDRIVE BASE RENDER [${dir.toUpperCase()}] // NEUTRAL GRAYSCALE" \
    "${path.join(dirPath, 'base.webp')}"`);

  // 2. paint-mask.webp — alpha mask of painted body panels only (transparent background, white/light gray solid body panels)
  execSync(`convert -size 1920x1080 xc:none \
    -fill "#FFFFFF" -draw "polygon 350,750 480,560 720,520 1200,520 1480,580 1600,750 1560,780 1220,780 1140,710 1020,710 960,780 580,780 500,710 380,710 320,780" \
    -fill "#E5E7EB" -draw "polygon 480,560 680,520 1220,520 1380,550 1200,520" \
    "${path.join(dirPath, 'paint-mask.webp')}"`);

  // 3. specular.webp — highlights and reflections (black background for screen blend mode, white bright lines)
  execSync(`convert -size 1920x1080 xc:"#000000" \
    -stroke "#FFFFFF" -strokewidth 12 -draw "bezier 450,620 720,540 1150,540 1500,600" \
    -stroke "#E0E7FF" -strokewidth 6 -draw "bezier 780,415 960,390 1140,415" \
    -stroke "#FFFFFF" -strokewidth 8 -draw "line 360,740 480,700" \
    -stroke "#FFFFFF" -strokewidth 8 -draw "line 1480,700 1580,740" \
    -fill "#FFFFFF" -draw "circle 365,738 375,738" \
    -blur 0x3 \
    "${path.join(dirPath, 'specular.webp')}"`);

  console.log(`Generated WebP files for ${dir}`);
}

// Copy front files to root /public/vehicle/
const rootDir = path.join(__dirname, 'public', 'vehicle');
fs.copyFileSync(path.join(rootDir, 'front', 'base.webp'), path.join(rootDir, 'base.webp'));
fs.copyFileSync(path.join(rootDir, 'front', 'paint-mask.webp'), path.join(rootDir, 'paint-mask.webp'));
fs.copyFileSync(path.join(rootDir, 'front', 'specular.webp'), path.join(rootDir, 'specular.webp'));
console.log('Successfully generated all vehicle WebP layered assets.');
