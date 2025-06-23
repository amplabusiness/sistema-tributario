const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd, opts = {}) {
  try {
    console.log(`\n> ${cmd}`);
    const output = execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...opts });
    console.log(output);
    return { success: true, output };
  } catch (err) {
    console.error(err.stdout || err.message);
    return { success: false, output: err.stdout || err.message };
  }
}

function main() {
  const logFile = 'test-automation.log';
  fs.writeFileSync(logFile, `# Test Automation Log - ${new Date().toISOString()}\n`);

  // 1. Build
  fs.appendFileSync(logFile, '\n## Build\n');
  const build = run('npm run build');
  fs.appendFileSync(logFile, build.output + '\n');
  if (!build.success) {
    console.error('❌ Build falhou. Abortando testes.');
    process.exit(1);
  }

  // 2. Testes com cobertura
  fs.appendFileSync(logFile, '\n## Testes\n');
  const test = run('npm test -- --coverage');
  fs.appendFileSync(logFile, test.output + '\n');
  if (!test.success) {
    console.error('❌ Testes falharam. Veja o log para detalhes.');
    process.exit(2);
  }

  // 3. Resumo final
  const summary = /Test Suites:.*\nTests:.*\nSnapshots:.*\nTime:.*\n/g.exec(test.output);
  if (summary) {
    console.log('\n===== RESUMO FINAL =====');
    console.log(summary[0]);
    fs.appendFileSync(logFile, '\n===== RESUMO FINAL =====\n' + summary[0] + '\n');
  } else {
    console.log('\nResumo não encontrado. Veja o log completo.');
  }

  console.log('\n✅ Testes automatizados concluídos! Log salvo em', logFile);
}

main(); 