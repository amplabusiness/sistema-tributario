const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pdlxgzcdsmdppddulcko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbHhnemNkc21kcHBkZHVsY2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYzNjM0NiwiZXhwIjoyMDY2MjEyMzQ2fQ.1CeIHPjIvYUeWMYjBX1xwpxCHMq0v8MQY2TvsuUOB7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_DIR = path.resolve(__dirname, '../../backup/ICMS AVIZ 04-2025/ICMS 04-2025');
const XML_DIRS = [
  path.join(BASE_DIR, 'ENTRADAS'),
  path.join(BASE_DIR, 'SAIDAS 01 A 15'),
  path.join(BASE_DIR, 'SAIDAS 16 A 30'),
];

async function importXmls() {
  for (const dir of XML_DIRS) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.xml'));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const xmlContent = fs.readFileSync(filePath, 'utf-8');
      const { error } = await supabase
        .from('xml_documents')
        .insert([
          {
            filename: file,
            conteudo: xmlContent,
            tipo: path.basename(dir),
            created_at: new Date().toISOString(),
          },
        ]);
      if (error) {
        console.error(`[ERRO] ${file}:`, error);
      } else {
        console.log(`[OK] Importado: ${file}`);
      }
    }
  }
}

importXmls(); 