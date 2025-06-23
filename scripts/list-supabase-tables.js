const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pdlxgzcdsmdppddulcko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbHhnemNkc21kcHBkZHVsY2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYzNjM0NiwiZXhwIjoyMDY2MjEyMzQ2fQ.1CeIHPjIvYUeWMYjBX1xwpxCHMq0v8MQY2TvsuUOB7Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Consulta a tabela padrão do Postgres para listar tabelas
  const { data, error } = await supabase.rpc('pg_catalog.pg_tables', {});
  if (error) {
    console.error('Erro ao listar tabelas:', error);
  } else {
    console.log('Tabelas disponíveis:', data);
  }
}

main(); 