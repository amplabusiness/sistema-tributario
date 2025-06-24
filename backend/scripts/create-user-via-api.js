const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';

async function createUser() {
  try {
    console.log('🔧 Criando usuário via API...');
    
    const userData = {
      name: 'Administrador Sistema',
      email: 'admin@sistema-tributario.com',
      password: 'admin123456'
    };

    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ Usuário criado com sucesso!');
      console.log('📧 Email: admin@sistema-tributario.com');
      console.log('🔑 Senha: admin123456');
      console.log('👤 Nome:', response.data.data.user.name);
      console.log('🔐 Token:', response.data.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Erro ao criar usuário:', response.data.error);
    }

  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        console.log('✅ Usuário já existe!');
        console.log('📧 Email: admin@sistema-tributario.com');
        console.log('🔑 Senha: admin123456');
      } else {
        console.log('❌ Erro na API:', error.response.data);
      }
    } else {
      console.log('❌ Erro de conexão:', error.message);
      console.log('💡 Certifique-se de que o backend está rodando na porta 3001');
    }
  }
}

createUser(); 