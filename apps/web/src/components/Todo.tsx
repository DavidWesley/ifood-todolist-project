import React, { useEffect } from 'react';
import cx from 'classnames';
import { StyledTodo } from '../styled/Todo.styled';
import { StyledDescriptionTodo } from '../styled/Description.styled';
import axios from 'axios';
import { usuarioId } from './cadastro';

interface TodoProps {
  todo: {
    id: string;
    title: string;
    isCompleted: boolean;
    startAt: "2023-10-14T04:29:05.123Z",
    dueDate: "2023-10-23T01:37:05.695Z"
  };
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const Todo: React.FC<TodoProps> = ({ todo, toggleTodo, deleteTodo }) => {
console.log(todo.id)
  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const labelClasses = cx('todo-name', {
    'isCompleted-todo': todo.isCompleted === true,
  });

  const fetchTodos = () => {
    const findId = usuarioId;
    const baseUrl = `http://127.0.0.1:3333/tasks/${findId}`;

    axios.get(baseUrl)
      .then((response) => {
        const taskData = response.data;
        console.log('Tarefas obtidas do servidor:', taskData.data[0]);
      })
      .catch((error) => {
        console.error('Erro ao buscar tarefas do servidor:', error);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <StyledTodo>
        <label className={labelClasses}>
          <input
            className="todo-checkbox"
            type="checkbox"
            checked={todo.isCompleted}
            onChange={handleToggle}
          />
          <span className="custom-checkbox"></span>
          {todo.title}
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
        <div className={labelClasses}>
          <div className='text'>
          <p>Tarefa criada em {new Date().toLocaleString()}</p>
          </div>
        </div>
      </StyledDescriptionTodo>
    </>
  );
};

export default Todo;
