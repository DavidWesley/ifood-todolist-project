
import axios from 'axios';

function CadastroUsuario() {
  async function handleCadastroUsuario() {
    try {
      const response = await axios.post('http://127.0.0.1:3333/auth/register', {
        username: 'edjalma',
        email: 'dyda91@gmail.com',
        password: 'dida1991'
      });

      if (response.status === 201) {
        console.log('Usuário cadastrado com sucesso.', response.data.id);
      } else {
        console.error('Falha no cadastro do usuário. Status:', response.status);
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  }

  async function handleFazerLogin() {
    try {
      const response = await axios.post('http://127.0.0.1:3333/auth/login', {
        email: 'dyda91@gmail.com',
        password: 'dida1991',
      });
  
      if (response.status === 200) {
        const token = response.data.data.token;
  
        localStorage.setItem('token', token);
  
        console.log('Token:', token);
      } else {
        console.error('Falha no login. Status:', response.status);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }
  

  return (
    <div>
      <button onClick={handleCadastroUsuario}>Cadastrar Usuário</button>
      <button onClick={handleFazerLogin}>Fazer Login</button>
    </div>
  );
}

export default CadastroUsuario;
