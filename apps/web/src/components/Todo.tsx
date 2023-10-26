import React from 'react';
import cx from 'classnames';
import { StyledTodo } from '../styled/Todo.styled';
import { StyledDescriptionTodo } from '../styled/Description.styled'

interface TodoProps {
  todo: {
    id: string;
    todoName: string;
    complete: boolean;
    overdue: boolean;
  };
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const Todo: React.FC<TodoProps> = ({ todo, toggleTodo, deleteTodo}) => {
  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const labelClasses = cx('todo-name', {
    'complete-todo': todo.complete === true,
  });



  return (
    <>
    <StyledTodo>
      <label className={labelClasses}>
        <input
          className="todo-checkbox"
          type="checkbox"
          checked={todo.complete}
          onChange={handleToggle}
        />
        <span className="custom-checkbox"></span>
        {todo.todoName}
      </label>
      <button
        className="todo-delete"
        onClick={handleDelete}
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <path
            fill="#494C6B"
            fillRule="evenodd"
            d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
          />
        </svg>
      </button>
      
    </StyledTodo>
    <StyledDescriptionTodo>
      <div  className={labelClasses}>
        <div className='text'>
        <p>Subtitulo da tarefa</p>
        </div>
      </div>
    </StyledDescriptionTodo>
    </>
  );
};

export default Todo;
