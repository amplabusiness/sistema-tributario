const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verificar se já existe um usuário admin
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@sistema-tributario.com'
      }
    });

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe!');
      console.log('📧 Email: admin@sistema-tributario.com');
      console.log('🔑 Senha: admin123456');
      return;
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123456', saltRounds);

    // Criar usuário admin
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador Sistema',
        email: 'admin@sistema-tributario.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@sistema-tributario.com');
    console.log('🔑 Senha: admin123456');
    console.log('👤 Nome:', adminUser.name);
    console.log('🔐 Role:', adminUser.role);

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 