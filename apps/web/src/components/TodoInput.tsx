import { StyledTodoInput } from '../styled/TodoInput.styled';
import React, { useState } from 'react';

interface TodoInputProps {
  newTodoInput: React.RefObject<HTMLInputElement>;
  handleAddTodo: (title: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ newTodoInput, handleAddTodo }) =>  {
  const [title, setTitle] = useState('');

  const handleAddTodoClick = () => {
    if (title.trim() !== '') {
      handleAddTodo(title); 
      setTitle(''); 
    }
  };
  return (
    <StyledTodoInput>
      <input className="todo-input" ref={newTodoInput} type="text" placeholder="Criar nova tarefa" value={title} onChange={(e) => setTitle(e.target.value)}/>
      <button className="todo-submit" onClick={() => handleAddTodoClick()} aria-label="adicionar tarefa">+</button>

    </StyledTodoInput>
  );
}
;

export default TodoInput;