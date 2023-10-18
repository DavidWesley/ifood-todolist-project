# RELACIONAMENTO DE DADOS

Detalhamento dos relacionamentos entre as entidades do servidor do projeto.

## Entidades

### Users (Usuários)

| Nome da Propriedade | Descrição                                    | Tipo     |
| ------------------- | -------------------------------------------- | -------- |
| `id`                | Identificador único do usuário (UUID)        | UUID     |
| `username`          | Nome de usuário                              | String   |
| `email`             | Endereço de e-mail do usuário                | String   |
| `password`          | Senha do usuário (criptografada)             | String   |
| `createdAt`         | Data e hora de criação do usuário            | DateTime |
| `updatedAt`         | Data e hora da última atualização do usuário | DateTime |

**Descrição:**

-   Armazena dados de usuários, como nome de usuário, e-mail e senha (criptografada).
-   Cada usuário é identificado por um ID único (UUID).

### Tasks (Tarefas)

| Nome da Propriedade | Descrição                                   | Tipo     | Relations  |
| ------------------- | ------------------------------------------- | -------- | ---------- |
| `id`                | Identificador único da tarefa (UUID)        | UUID     |            |
| `title`             | Título da tarefa                            | String   |            |
| `description`       | Descrição da tarefa                         | String   |            |
| `startAt`           | Data de início da tarefa                    | DateTime |            |
| `dueDate`           | Data de vencimento da tarefa                | DateTime |            |
| `isCompleted`       | Estado de conclusão da tarefa               | Boolean  |            |
| `userId`            | ID do usuário associado à tarefa (UUID)     | UUID     | Users (ID) |
| `createdAt`         | Data e hora de criação da tarefa            | DateTime |            |
| `updatedAt`         | Data e hora da última atualização da tarefa | DateTime |            |

**Descrição:**

-   Registra informações sobre tarefas, incluindo título, descrição, data de vencimento e status.
-   Cada tarefa tem um ID exclusivo (UUID) e está associada a um usuário.

**Relação:**

-   As tarefas estão vinculadas aos usuários por meio do campo "userId," permitindo a atribuição e gerenciamento de tarefas específicas por usuário.
