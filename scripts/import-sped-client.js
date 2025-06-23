const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pdlxgzcdsmdppddulcko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbHhnemNkc21kcHBkZHVsY2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYzNjM0NiwiZXhwIjoyMDY2MjEyMzQ2fQ.1CeIHPjIvYUeWMYjBX1xwpxCHMq0v8MQY2TvsuUOB7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

const SPED_FILE = path.resolve(__dirname, '../../backup/ICMS AVIZ 04-2025/ICMS 04-2025/EFD ICMS 04-2025 - AVIZ.txt');

function parseBloco0000(line) {
  // Exemplo: |0000|<data>|<nome>|<CNPJ>|<UF>|<IE>|...
  const campos = line.split('|');
  return {
    cnpj: campos[7] || '',
    nome: campos[6] || '',
    status: 'ativo',
  };
}

async function main() {
  const lines = fs.readFileSync(SPED_FILE, 'utf-8').split(/\r?\n/);
  let cliente = null;
  for (const line of lines) {
    if (line.startsWith('|0000|')) {
      cliente = parseBloco0000(line);
      break;
    }
  }
  if (!cliente) {
    console.error('Bloco 0000 não encontrado no SPED.');
    return;
  }
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente]);
  if (error) {
    console.error('Erro ao cadastrar cliente:', error);
  } else {
    console.log('Cliente cadastrado com sucesso:', data);
  }
}

main(); 