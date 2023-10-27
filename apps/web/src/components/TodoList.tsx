import React from 'react';
import Todo from '../components/Todo';

interface TodoListProps {
  todos: any[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}


const TodoList: React.FC<TodoListProps> = ({ todos, toggleTodo, deleteTodo}) => {
  return (
    <div>
      {todos.map((todo: any) => { 
        console.log(todo.id); 
        return (
          <Todo key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo}/>
        );
      })}
    </div>
  );
};


export default TodoList;