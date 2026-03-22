const fs = require('fs');
const path = require('path');

// Complete list of 6,000 DTC codes
const ALL_CODES = [];

// P codes P0000-P0999
for (let i = 0; i <= 999; i++) {
  ALL_CODES.push('P' + String(i).padStart(4, '0'));
}
// P codes P1000-P1999
for (let i = 1000; i <= 1999; i++) {
  ALL_CODES.push('P' + String(i).padStart(4, '0'));
}
// P codes P2000-P2999
for (let i = 2000; i <= 2999; i++) {
  ALL_CODES.push('P' + String(i).padStart(4, '0'));
}
// B codes B0000-B0999
for (let i = 0; i <= 999; i++) {
  ALL_CODES.push('B' + String(i).padStart(4, '0'));
}
// C codes C0000-C0999
for (let i = 0; i <= 999; i++) {
  ALL_CODES.push('C' + String(i).padStart(4, '0'));
}
// U codes U0000-U0999
for (let i = 0; i <= 999; i++) {
  ALL_CODES.push('U' + String(i).padStart(4, '0'));
}

const OUTPUT_DIR = path.join(__dirname, '../data/dtc');
const BATCH_SIZE = 1000;

// Get batch number from argument
const batchNum = parseInt(process.argv[2] || '1');
const start = (batchNum - 1) * BATCH_SIZE;
const end = Math.min(start + BATCH_SIZE, ALL_CODES.length);
const batch = ALL_CODES.slice(start, end);

console.log(`\n📦 Batch ${batchNum}: codes ${start+1} to ${end} of ${ALL_CODES.length}`);
console.log(`Processing ${batch.length} codes...\n`);

let done = 0;

for (const code of batch) {
  const filePath = path.join(OUTPUT_DIR, `${code}.json`);

  // Skip if already exists
  if (fs.existsSync(filePath)) {
    done++;
    continue;
  }

  // Determine system and type from code prefix
  const prefix = code[0];
  const num = parseInt(code.slice(1));

  let system = '';
  let category = '';

  if (prefix === 'P') {
    if (num < 100) { system = 'Fuel and Air Metering'; category = 'Engine' }
    else if (num < 200) { system = 'Fuel and Air Metering'; category = 'Engine' }
    else if (num < 300) { system = 'Ignition System'; category = 'Engine' }
    else if (num < 400) { system = 'Auxiliary Emission Controls'; category = 'Emissions' }
    else if (num < 500) { system = 'Vehicle Speed and Idle Control'; category = 'Engine' }
    else if (num < 600) { system = 'Computer and Output Circuit'; category = 'Electronics' }
    else if (num < 700) { system = 'Transmission'; category = 'Transmission' }
    else if (num < 800) { system = 'Transmission'; category = 'Transmission' }
    else { system = 'Hybrid Propulsion'; category = 'Hybrid' }
  } else if (prefix === 'B') {
    system = 'Body Control'; category = 'Body'
  } else if (prefix === 'C') {
    system = 'Chassis Control'; category = 'Chassis'
  } else if (prefix === 'U') {
    system = 'Network Communication'; category = 'Network'
  }

  // Generate basic SEO content from code structure
  const data = {
    code,
    system,
    category,
    title_en: `${code} — ${system} Fault`,
    title_ar: `كود ${code} — عطل ${system}`,
    title_fr: `Code ${code} — Défaut ${system}`,
    description_en: `Diagnostic trouble code ${code} indicates a fault in the ${system} system. This code is detected by the vehicle's onboard diagnostic system and requires professional diagnosis.`,
    description_ar: `كود العطل ${code} يشير إلى خلل في نظام ${system}. يتم اكتشاف هذا الكود بواسطة نظام التشخيص الإلكتروني للسيارة.`,
    description_fr: `Le code de diagnostic ${code} indique une défaillance dans le système ${system}. Ce code est détecté par le système de diagnostic embarqué du véhicule.`,
    severity: num < 300 ? 'moderate' : num < 600 ? 'minor' : 'moderate',
    common_causes_en: [
      'Faulty sensor or wiring',
      'Software or calibration issue',
      'Mechanical component failure'
    ],
    common_causes_ar: [
      'عطل في الحساس أو الأسلاك',
      'مشكلة في البرمجة أو المعايرة',
      'عطل ميكانيكي'
    ],
    common_causes_fr: [
      'Capteur ou câblage défectueux',
      'Problème logiciel ou de calibration',
      'Défaillance mécanique'
    ],
    generated_at: new Date().toISOString(),
    content_type: 'static'
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  done++;

  if (done % 100 === 0) {
    console.log(`✅ ${done}/${batch.length} codes processed...`);
  }
}

const total = fs.readdirSync(OUTPUT_DIR).length;
console.log(`\n✅ Batch ${batchNum} complete!`);
console.log(`📊 This batch: ${done} codes`);
console.log(`📊 Total in database: ${total} codes`);
console.log(`📊 Remaining: ${ALL_CODES.length - total} codes`);

if (end < ALL_CODES.length) {
  console.log(`\n⏸️  PAUSING — Run batch ${batchNum + 1}? (next: codes ${end+1} to ${end+BATCH_SIZE})`);
} else {
  console.log('\n🎉 ALL CODES GENERATED!');
}
