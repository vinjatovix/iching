import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, '../src/db');
const SOURCE_FILE = path.join(DB_DIR, 'hexagrams.json');

const TARGET_LANGS = [
  { code: 'gl', name: 'Galego' },
  { code: 'eu', name: 'Euskara' },
  { code: 'ca', name: 'Català' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'ro', name: 'Română' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'sv', name: 'Svenska' }
];

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        const waitMs = 2000 * Math.pow(1.5, attempt - 1);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data[0].map(s => s[0]).join('');
    } catch (err) {
      if (attempt === 6) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function translateHexagram(hex, targetLang) {
  const nombre = await translateText(hex.nombre, targetLang);
  const superior = hex.trigramas?.superior ? await translateText(hex.trigramas.superior, targetLang) : '';
  const inferior = hex.trigramas?.inferior ? await translateText(hex.trigramas.inferior, targetLang) : '';
  const juicio = await translateText(hex.juicio, targetLang);
  const imagen = await translateText(hex.imagen, targetLang);

  return {
    id: hex.id,
    nombre,
    trigramas: {
      superior,
      inferior
    },
    juicio,
    imagen
  };
}

async function translateAllForLanguage(hexagrams, lang) {
  console.log(`Starting translation for ${lang.name} (${lang.code})...`);
  const targetFile = path.join(DB_DIR, `hexagrams_${lang.code}.json`);
  
  // If already generated, skip
  if (fs.existsSync(targetFile)) {
    console.log(`File for ${lang.code} already exists. Skipping.`);
    return;
  }

  const results = [];
  const BATCH_SIZE = 3;

  for (let i = 0; i < hexagrams.length; i += BATCH_SIZE) {
    const chunk = hexagrams.slice(i, i + BATCH_SIZE);
    const translatedChunk = await Promise.all(
      chunk.map(hex => translateHexagram(hex, lang.code))
    );
    results.push(...translatedChunk);
    process.stdout.write(`  Translated ${results.length}/${hexagrams.length}\r`);
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(targetFile, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nCompleted ${lang.name} (${lang.code}) -> ${targetFile}`);
}

async function main() {
  const rawData = fs.readFileSync(SOURCE_FILE, 'utf8');
  const hexagrams = JSON.parse(rawData);

  // Ensure hexagrams_es.json exists as a copy of hexagrams.json
  const esFile = path.join(DB_DIR, 'hexagrams_es.json');
  if (!fs.existsSync(esFile)) {
    fs.writeFileSync(esFile, rawData, 'utf8');
    console.log('Created hexagrams_es.json');
  }

  for (const lang of TARGET_LANGS) {
    await translateAllForLanguage(hexagrams, lang);
  }

  console.log('All translations successfully created!');
}

main().catch(err => {
  console.error('Translation error:', err);
  process.exit(1);
});
