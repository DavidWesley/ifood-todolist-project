<div align="center" >
  <h1 align="center">Ifood TodoList Web</h1>
</div>

<p align="center">Um aplicativo simples de lista de tarefas desenvolvido em equipe durante o bootcamp do iFood. Ajuda você a manter-se organizado e produtivo.</p>

<div align="center">
  <a href="#project">Projeto</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#technologies">Tecnologias</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#usage">Utilização</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">Licença</a>
</div>

<h2 id="project">📁 Projeto</h2>

Este aplicativo de lista de tarefas é a solução perfeita para organizar suas atividades diárias de forma eficiente. Desenvolvido com paixão e aprendizado ao longo do bootcamp, o TodoList oferece uma experiência simples e intuitiva para manter o controle de suas tarefas.

### Estrutura de Pastas

A estrutura de pastas de uma aplicação frontend é organizada de forma a manter o código fonte, recursos e componentes bem estruturados.

A estrutura de pastas do projeto está configurada dessa forma:

```
web/
├── public
└── src
    ├── assets
    ├── components
    │   ├── ui
    │   └── icons
    ├── hooks
    ├── layouts
    ├── libs
    ├── pages
    ├── providers
    ├── routes
    ├── services
    └── utils

```

- **`public`**: A pasta "public" armazena recursos estáticos acessíveis diretamente pelo navegador, como imagens, arquivos de estilo (CSS) e JavaScript.

- **`src`**: A pasta "src" contém o código-fonte da aplicação e é subdividida em várias pastas, cada uma com um propósito específico:

    - **`assets`**: Aqui estão localizados recursos estáticos, como imagens, ícones e arquivos de fonte.

    - **`components`**: Esta pasta contém componentes reutilizáveis usados em várias partes do aplicativo.

        - **`ui`**: Componentes de interface do usuário, como botões, caixas de diálogo, entre outros.
        - **`icons`**: Ícones react ou no formato SVG.

    - **`hooks`**: Pasta para centralizar os React Hooks personalizados, que compartilham lógica entre componentes.

    - **`layouts`**: Componentes de layout que definem a estrutura geral das páginas ou seções do aplicativo.

    - **`libs`**: Pasta para integrar com bibliotecas externas, configurações e utilitários relacionados a essas bibliotecas

    - **`pages`**: Componentes de alto nível que representam as páginas do aplicativo.

    - **`providers`**: Armazena os Providers e Contexts que compartilham estados em toda a aplicação.

    - **`routes`**: A configuração de roteamento do aplicativo.

    - **`services`**: Contém código relacionado a serviços, como chamadas de API externas, autenticação, entre outros.

    - **`utils`**: Este é o lugar para funções utilitárias e helpers que podem ser usados em todo o aplicativo.


<div align="center" style="width: 100%;">
</div>

<h2 id="technologies">💻 Tecnologias</h2>

Este projeto foi desenvolvido utilizando tecnologias como:

- React
- Vite
- Tailwind CSS
- TypeScript
- ESLint
- Axios
- Shadcn UI

<h2 id="usage">💡 Utilização</h2>

1. Clone o projeto:

   ```sh
   git clone https://github.com/DavidWesley/ifood-todolist-project.git --branch dev --single-branch
   ```

2. Acesse a pasta do projeto:

   ```sh
   cd ifood-todolist-project
   ```

3. Instale as dependências:

   ```sh
   npm ci
   cd apps/web && npm ci
   ```

4. Defina as variáveis de ambiente conforme [`.env.example`](./.env.example):

   ```sh
   # Base url to connect to server
   VITE_API_BASE_URL=
   ```

5. Inicie a aplicação:

   ```sh
   npm run dev
   ```

<h2 id="license">📝 Licença</h2>

Este projeto está sob a licença [GPL-3.0](../../LICENSE).
