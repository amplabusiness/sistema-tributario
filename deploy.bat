@echo off
echo 🚀 Iniciando deploy em producao...

echo 🧪 Verificando requisitos IA...
call npm run verify:ia
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🧪 Executando testes...
call npm run test:ci
if %errorlevel% neq 0 exit /b %errorlevel%

echo 📦 Gerando build...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🗄️ Migrando banco de dados...
call npm run prisma:migrate:prod
if %errorlevel% neq 0 exit /b %errorlevel%

echo 🚀 Fazendo deploy...
call npm run deploy:prod
if %errorlevel% neq 0 exit /b %errorlevel%

echo ✅ Deploy concluido com sucesso!
