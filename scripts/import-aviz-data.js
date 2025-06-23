const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const xml2js = require('xml2js');
const readline = require('readline');

const prisma = new PrismaClient();

const BASE_DIR = path.resolve(__dirname, '../../backup/ICMS AVIZ 04-2025/ICMS 04-2025');
const ENTRADAS_DIR = path.join(BASE_DIR, 'ENTRADAS');
const SAIDAS_01_15_DIR = path.join(BASE_DIR, 'SAIDAS 01 A 15');
const SAIDAS_16_30_DIR = path.join(BASE_DIR, 'SAIDAS 16 A 30');
const SPED_FILE = path.join(BASE_DIR, 'EFD ICMS 04-2025 - AVIZ.txt');

async function importXmlFiles(dir, tipo) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.xml'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const xmlContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = await xml2js.parseStringPromise(xmlContent, { explicitArray: false });
    // Exemplo: pegar CNPJ emitente/destinatário, data, valor, etc.
    // (Ajustar conforme layout real do XML)
    const nfe = parsed.nfeProc?.NFe?.infNFe || parsed.NFe?.infNFe;
    if (!nfe) continue;
    const cnpjEmit = nfe.emit?.CNPJ || null;
    const cnpjDest = nfe.dest?.CNPJ || null;
    const empresaCnpj = cnpjEmit || cnpjDest;
    // Upsert empresa
    let empresa = null;
    if (empresaCnpj) {
      empresa = await prisma.empresa.upsert({
        where: { cnpj: empresaCnpj },
        update: {},
        create: {
          cnpj: empresaCnpj,
          razaoSocial: nfe.emit?.xNome || nfe.dest?.xNome || 'Empresa AVIZ',
        },
      });
    }
    // Inserir documento XML
    await prisma.xMLDocument.create({
      data: {
        empresaId: empresa ? empresa.id : null,
        filename: file,
        path: filePath,
        tipo,
        conteudo: xmlContent,
        createdAt: new Date(),
      },
    });
    console.log(`[OK] Importado ${file}`);
  }
}

async function importSpedTxt(filePath) {
  console.log('Importando SPED TXT...');
  const empresaCnpj = '07605468000100'; // CNPJ AVIZ (ajustar se necessário)
  let empresa = await prisma.empresa.findUnique({ where: { cnpj: empresaCnpj } });
  if (!empresa) {
    empresa = await prisma.empresa.create({
      data: { cnpj: empresaCnpj, razaoSocial: 'AVIZ' },
    });
  }
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  for await (const line of rl) {
    const campos = line.split('|');
    if (campos.length < 2) continue;
    const bloco = campos[1];
    switch (bloco) {
      case '0000': // Identificação da empresa
        // Pode atualizar dados da empresa se necessário
        break;
      case 'C100': // Nota fiscal
        // Exemplo: inserir como documento fiscal
        await prisma.document.create({
          data: {
            empresaId: empresa.id,
            filename: `SPED_C100_${campos[9] || ''}`,
            originalName: 'EFD ICMS 04-2025 - AVIZ.txt',
            path: filePath,
            size: 0,
            mimeType: 'text/plain',
            status: 'IMPORTED',
            metadata: { campos },
          },
        });
        break;
      case 'C170': // Itens da nota
        // Exemplo: inserir como item relacionado (pode criar tabela se necessário)
        break;
      case 'E100': // Período de apuração
        // Exemplo: inserir como apuração
        break;
      case 'E110': // Valores apurados
        // Exemplo: inserir como apuração
        break;
      default:
        // Outros blocos podem ser ignorados ou tratados conforme necessidade
        break;
    }
  }
  console.log('SPED TXT importado!');
}

async function main() {
  console.log('Importando XMLs de ENTRADAS...');
  await importXmlFiles(ENTRADAS_DIR, 'ENTRADA');
  console.log('Importando XMLs de SAÍDAS 01 A 15...');
  await importXmlFiles(SAIDAS_01_15_DIR, 'SAIDA');
  console.log('Importando XMLs de SAÍDAS 16 A 30...');
  await importXmlFiles(SAIDAS_16_30_DIR, 'SAIDA');
  await importSpedTxt(SPED_FILE);
  // TODO: Importar planilhas e PDFs como metadados
  await prisma.$disconnect();
  console.log('Importação concluída!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 