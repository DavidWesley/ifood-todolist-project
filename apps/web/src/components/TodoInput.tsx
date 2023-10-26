import { StyledTodoInput } from '../styled/TodoInput.styled';

interface TodoInputProps {
  newTodoInput: React.RefObject<HTMLInputElement>;
  handleAddTodo: () => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ newTodoInput, handleAddTodo }) => {
  return (
    <StyledTodoInput>
      <input className="todo-input" ref={newTodoInput} type="text" placeholder="Criar nova tarefa" />
      <button className="todo-submit" onClick={handleAddTodo} aria-label="adicionar tarefa">+</button>

    </StyledTodoInput>
  );
};

export default TodoInput;