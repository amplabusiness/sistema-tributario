const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pdlxgzcdsmdppddulcko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbHhnemNkc21kcHBkZHVsY2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYzNjM0NiwiZXhwIjoyMDY2MjEyMzQ2fQ.1CeIHPjIvYUeWMYjBX1xwpxCHMq0v8MQY2TvsuUOB7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

const SPED_FILE = path.resolve(__dirname, '../../backup/ICMS AVIZ 04-2025/ICMS 04-2025/EFD ICMS 04-2025 - AVIZ.txt');

const blocos = {
  bloco_c: ['C100', 'C170', 'C190', 'C500', 'C590'],
  bloco_e: ['E100', 'E110', 'E111', 'E116', 'E200', 'E210', 'E250', 'E300', 'E310', 'E311', 'E312', 'E313', 'E316', 'E500', 'E510', 'E520', 'E530', 'E531', 'E990'],
  bloco_h: ['H005', 'H010'],
  ciap: ['G110', 'G125', 'G126', 'G130', 'G140', 'G990'],
};

function parseBloco0000(line) {
  const campos = line.split('|');
  return campos[7] || '';
}

async function main() {
  const lines = fs.readFileSync(SPED_FILE, 'utf-8').split(/\r?\n/);
  let cnpj = '';
  for (const line of lines) {
    if (line.startsWith('|0000|')) {
      cnpj = parseBloco0000(line);
      break;
    }
  }
  if (!cnpj) {
    console.error('CNPJ não encontrado no bloco 0000.');
    return;
  }
  for (const line of lines) {
    const campos = line.split('|');
    if (campos.length < 2) continue;
    const tipo = campos[1];
    for (const [tabela, blocosArr] of Object.entries(blocos)) {
      if (blocosArr.includes(tipo)) {
        const { error } = await supabase
          .from(tabela)
          .insert([
            {
              cliente_cnpj: cnpj,
              tipo_registro: tipo,
              campos: campos,
              criado_em: new Date().toISOString(),
            },
          ]);
        if (error) {
          console.error(`[ERRO] ${tipo}:`, error);
        } else {
          console.log(`[OK] Importado ${tipo}`);
        }
        break;
      }
    }
  }
}

main(); 