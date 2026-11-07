const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const destBase = 'public/catalog';
const mapping = {
  'tenis imagens': 'tenis',
  'roupas': 'roupas',
  'futebol': 'futebol',
  'bonés': 'bones',
  'relogios': 'relogios',
  'demonstrações': 'loja'
};

async function processAll() {
  let totalOrig = 0;
  let totalOpt = 0;
  let count = 0;

  for (const [srcFolder, destFolder] of Object.entries(mapping)) {
    const srcDir = path.join('catalogo blackstore', srcFolder);
    const destDir = path.join(destBase, destFolder);
    if (!fs.existsSync(srcDir)) continue;
    fs.mkdirSync(destDir, { recursive: true });

    const files = fs.readdirSync(srcDir);
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) continue;

      totalOrig += stat.size;
      const baseName = path.parse(file).name;
      const destName = baseName.toLowerCase().replace(/[^a-z0-9_-]/g, '_') + '.webp';
      const destPath = path.join(destDir, destName);

      try {
        const image = sharp(srcPath);
        const metadata = await image.metadata();

        let pipeline = image;
        if (metadata.width > 1200 || metadata.height > 1200) {
          pipeline = pipeline.resize({
            width: metadata.width >= metadata.height ? 1200 : undefined,
            height: metadata.height > metadata.width ? 1200 : undefined,
            fit: 'inside',
            withoutEnlargement: true
          });
        }

        // Se tem canal alpha (tênis e chuteiras recortadas), mantém transparência
        if (metadata.hasAlpha) {
          await pipeline.webp({ quality: 85, alphaQuality: 90, effort: 4 }).toFile(destPath);
        } else {
          await pipeline.webp({ quality: 82, effort: 4 }).toFile(destPath);
        }

        const optStat = fs.statSync(destPath);
        totalOpt += optStat.size;
        count++;
        console.log(`OK [${destFolder}]: ${file} (${Math.round(stat.size/1024)}KB -> ${Math.round(optStat.size/1024)}KB)`);
      } catch (err) {
        console.error('Erro em ' + file, err.message);
      }
    }
  }

  console.log('\n--- RESUMO DA OTIMIZAÇÃO ---');
  console.log('Imagens processadas:', count);
  console.log('Peso Original:', (totalOrig / (1024*1024)).toFixed(2), 'MB');
  console.log('Peso Otimizado:', (totalOpt / (1024*1024)).toFixed(2), 'MB');
  console.log('Economia Total:', ((1 - totalOpt/totalOrig) * 100).toFixed(1) + '%');
}

processAll();
