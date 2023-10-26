import axios from 'axios';
import { useEffect } from 'react';

export let usuarioId = null;

const CadastroUsuario = () => {
    async function handleCadastroUsuario() {
        try {
            const response = await axios.post('http://127.0.0.1:3333/auth/register', {
                username: 'edjalma',
                email: 'dyda91@gmail.com',
                password: 'dida1991'
            });

            if (response.status === 201) {
                usuarioId = response.data.id;
            } else {
                console.error('Falha no cadastro do usuário. Status:', response.status);
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
        }
    }


    useEffect(() => {
        handleCadastroUsuario();
    }, []);


}

export default CadastroUsuario;
