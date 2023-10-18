# BANCO DE DADOS EM MEMÓRIA

Um banco de dados em memória é uma estrutura de armazenamento de dados que opera na RAM do sistema, proporcionando acesso rápido e eficiente aos dados.

## InMemoryClass

A classe `InMemoryTable` é uma implementação desse conceito e fornece funcionalidades para:

1. **Armazenamento de Dados**: Permite criar e manter tabelas em memória para armazenar informações.
2. **Inserção e Atualização de Registros**: Oferece métodos para adicionar novos registros e atualizar os existentes na tabela.
3. **Consulta de Registros**: Permite buscar registros com base em critérios personalizados usando filtros e seleção de colunas específicas.
4. **Exclusão de Registros**: Possibilita remover registros da tabela com base em seu identificador único.
5. **Recuperação de Todos os Registros**: Permite obter todos os registros armazenados na tabela.

###

Exemplos de uso

1. **Criação de uma Tabela**:

    Para criar uma tabela, você deve instanciar a classe `InMemoryTable` fornecendo um nome para a tabela e uma configuração que define as colunas da tabela. Aqui está um

    exemplo de criação de uma tabela de usuários:

    ```ts
    import {
        InMemoryTable,
        InMemoryTableModel,
    } from "caminho/da/lib/in-memory-table";
    import {
        ValidatorFunction,
        Validators,
    } from "caminho/da/lib/validators/validators";

    // InMemoryTableModel provides automatically the id, createdAt and updateAt fields
    export interface UserModel extends Partial<InMemoryTableModel> {
        username: string;
        email: string;
        password: string;
    }

    const usersTable = new InMemoryTable<UserModel>("users", {
        columns: [
            ["username", { validators: [Validators.isValidUsername] }],
            ["email", { validators: [Validators.isEmail] }],
            [
                "password",
                {
                    validator: [
                        /* Funções validadoras */
                    ],
                    defaultValue: () => "1234pass",
                },
            ],
        ],
    });
    ```

2. **Inserção de Registros**:

    Para inserir um novo registro na tabela, utilize o método `insert`, que aceita um objeto com os valores dos campos. Um ID único e informações relativas ao registro desse novo dado no banco serão geradas automaticamente.

    Exemplo:

    ```ts
    const userId = usersTable.insert({
        username: "pedro123",
        email: "pedro@example.com",
        password: "123456789",
    });
    ```

3. **Seleção de Registros**:

    Para selecionar registros da tabela com base em critérios de filtro, use o método `select`. Você pode especificar quais colunas deseja retornar e aplicar filtros aos valores das colunas.

    Exemplo:

    ```ts
    const selectedUsers = usersTable.select({
        columns: ["id", "username"],
        filters: { username: (value) => value.startsWith("pedro") },
    });
    ```

4. **Atualização de Registros**:

    Para atualizar um registro existente, utilize o método `update` fornecendo o ID do registro e um objeto com os novos valores. O campo updatedAt será atualizo automaticamente.

    Exemplo:

    ```ts
    usersTable.update(userId, {
        username: "pedro456",
    });
    ```

5. **Exclusão de Registros**:

    Para excluir um registro com base no seu ID, use o método `delete`.

    Exemplo:

    ```ts
    usersTable.delete(userId);
    ```

6. **Consulta de Registros**:

    Você pode consultar registros com base em critérios personalizados usando a classe `InMemoryModelQuery`.

    Exemplo: consulta de usuários com base no email retornando todas as colunas (propriedades) desse usuário:

    ```ts
    const selectedUsers = usersTable.select({
        filters: {
            email: (value) => value === "pedro@example.com",
        },
    });
    ```

    Exemplo: consulta de usuários com base no primeiro nome retornando apenas as colunas id e username

    ```ts
    const selectedUsers = usersTable.select({
        columns: ["id", "username"],
        filters: { username: (value) => value.startsWith("pedro") },
    });
    ```

7. **Recuperação de Todos os Registros**:

    Para obter todos os registros da tabela, você pode usar o método `getAll`.

    ```ts
    const allUsers = usersTable.getAll();
    ```

8. **Obtendo o Nome da Tabela**:

    A classe `InMemoryTable` oferece uma funcionalidade que permite obter o nome da tabela atual.
    Isso pode ser útil ao realizar operações de consulta ou depuração em seu projeto.

    O método `getTableName()` é responsável por retornar o nome da tabela associada à instância da classe `InMemoryTable`.
    Ele não requer nenhum argumento e pode ser chamado em qualquer momento após a criação da tabela.

    Exemplo:

    ```ts
    // Suponha que você já tenha criado a tabela "users" (ou qualquer outra tabela)
    // Para obter o nome da tabela, você pode chamar o método getTableName()
    const tableName = usersTable.getTableName();
    console.log(`Nome da tabela: ${tableName}`); // Saída: Nome da tabela: users
    ```
