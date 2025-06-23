@echo off
REM === 1. Atualiza o .env do backend com a URL do Supabase ===
echo DATABASE_URL="postgresql://postgres:ampla123@db.pdlxgzcdsmdppddulcko.supabase.co:5432/postgres" > ..\backend\.env

REM === 2. Testa a conexão do Prisma ===
cd ..\backend
npx prisma db pull --schema prisma\schema.prisma
if %errorlevel% neq 0 (
  echo Erro na conexão com o banco. Verifique as credenciais e tente novamente.
  pause
  exit /b 1
)

REM === 3. Volta para a pasta de scripts e executa a importação ===
cd ..\scripts
node import-aviz-data.js

REM === 4. Fim ===
echo Processo automatizado concluído!
pause 