import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'styled-components';
// import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Header from './components/Header';
import TodoFilters from './components/TodoFilters';
import TodoFooter from './components/TodoFooter';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import CadastrarUsuario from './components/cadastro';
import { StyledBanner } from './styled/Banner.styled';
import GlobalStyles from './styled/Global';
import { StyledMain } from './styled/Main.styled';
import { darkTheme, lightTheme } from './themes';

const LOCAL_STORAGE_KEY = 'todoApp.todos';

interface Todo {
    todoName: string,
    isCompleted: boolean,
    overdue: boolean,
    usuarioId: string,
    description: string,
    startAt: Date,
    dueDate: Date
}


const App: React.FC<Todo> = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<string>('todas');
    const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
    const [allFilterActive, setAllFilterActive] = useState<boolean>(true);
    const [activeFilterActive, setActiveFilterActive] = useState<boolean>(false);
    const [isCompletedFilterActive, setIsCompletedFilterActive] = useState<boolean>(false);
    const [overdueFilterActive, setOverdueFilterActive] = useState<boolean>(false);

    const newTodoInput = useRef<HTMLInputElement | null>(null);

    const sun = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fillRule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg>`;
    const moon = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fillRule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/></svg>`;

    const [colorTheme, setColorTheme] = useState<string>('light');

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]') as Todo[];
        if (storedTodos) {
            setTodos(storedTodos);
            setFilter('todas');
            setFilteredTodos(storedTodos);
        }
        setIsComponentMounted(true);
    }, []);

    useEffect(() => {
        if (isComponentMounted) {
            if (todos.length !== 0) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
            } else {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
    });

    function handleAddTodo() {
        const todoName = newTodoInput.current?.value;
        if (!todoName) {
            return;
        }
        setTodos([...todos, { id: uuidv4(), todoName, complete: false, overdue: false }]);
        if (newTodoInput.current) {
            newTodoInput.current.value = '';
        }
    }


    function toggleTodo() {
        // Realize uma solicitação GET para buscar os dados da tarefa
        const token = localStorage.getItem('token');

        axios.get(`http://127.0.0.1:3333/tasks/6a02451e-89dc-49ec-bc90-6639fcd540bd`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                const taskData = response.data;
                console.log(taskData)
                // Clone a lista de todos
                const newTodos = [...taskData];

                // Encontre a tarefa pelo ID
                const selectedTask = newTodos.find((todo) => todo.id === id);

                if (selectedTask) {
                    // Atualize o estado da tarefa com os dados buscados
                    selectedTask.complete = taskData.complete;

                    // Atualize o estado dos todos
                    setTodos(newTodos);
                }
            })
            .catch((error) => {
                console.error('Erro ao buscar tarefa do servidor:', error);
            });
    }

    // function toggleTodo(id: string) {
    //   const newTodos = [...todos];
    //   const selectedTask = newTodos.find((todo) => todo.id === id);
    //   if (selectedTask) {
    //     selectedTask.complete = !selectedTask.complete;
    //     setTodos(newTodos);
    //   }
    // }

    async function toggleTodo() {
        const findId = usuarioId;
        const baseUrl = `http://127.0.0.1:3333/tasks/${findId}`;
        console.log("Requisitando as tasks na rota", baseUrl);

        try {
            const response = await axios.get(baseUrl);
            const taskData = response.data.data;
            console.log('Todas as tarefas cadastradas:', taskData);

            setTodos(taskData);
        } catch (error) {
            console.error('Erro ao buscar tarefas do servidor:', error);
        }
    }


    function showConfirmation() {
        return window.confirm('Tem certeza de que deseja excluir todas as tarefas completas?');
    }
    function handleClear() {
        if (showConfirmation()) {
            const remainingTodos = todos.filter((todo) => !todo.isCompleted);
            setTodos(remainingTodos);
        }
    }

    function deleteTodo(id: string) {
        const remainingTodos = todos.filter((todo) => todo.id !== id);
        setTodos(remainingTodos);
    }

    function countRemaining() {
        const count = todos.filter((todo) => !todo.isCompleted);

        if (count.length === 1) {
            return '1 Tarefa aberta';
        } else {
            return `${count.length} Tarefas abertas`;
        }
    }

    useEffect(() => {
        filterList();
    }, [todos, filter]);

    function filterList() {
        if (filter === 'todas') {
            setFilteredTodos(todos);
            setAllFilterActive(true);
            setActiveFilterActive(false);
            setIsCompletedFilterActive(false);
            setOverdueFilterActive(false);
        } else if (filter === 'incompletas') {
            const activeTodos = todos.filter((todo) => !todo.isCompleted);
            setFilteredTodos(activeTodos);
            setActiveFilterActive(true);
            setAllFilterActive(false);
            setIsCompletedFilterActive(false);
            setOverdueFilterActive(false);
        } else if (filter === 'completas') {
            const isCompletedTodos = todos.filter((todo) => todo.isCompleted);
            console.log(isCompletedTodos)
            setFilteredTodos(isCompletedTodos);
            setIsCompletedFilterActive(true);
            setAllFilterActive(false);
            setActiveFilterActive(false);
            setOverdueFilterActive(false);
        } else if (filter === 'atrasadas') {
            const overdueTodos = todos.filter((todo) => todo.overdue);
            console.log(overdueTodos)
            setFilteredTodos(overdueTodos);
            setOverdueFilterActive(true);
            setAllFilterActive(false);
            setActiveFilterActive(false);
            setIsCompletedFilterActive(false);
        }
    }

    function toggleTheme(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (colorTheme === 'dark') {
            setColorTheme('light');
            if (e.currentTarget) {
                e.currentTarget.innerHTML = moon;
            }
        } else if (colorTheme === 'light') {
            setColorTheme('dark');
            if (e.currentTarget) {
                e.currentTarget.innerHTML = sun;
            }
        }

    }

    return (
        <ThemeProvider theme={colorTheme === 'light' ? lightTheme : darkTheme}>
            <CadastrarUsuario />
            <StyledMain>
                <GlobalStyles />
                <StyledBanner />
                <Header toggleTheme={toggleTheme} />
                <TodoInput newTodoInput={newTodoInput} handleAddTodo={handleAddTodo} />
                <TodoFilters
                    setFilter={setFilter}
                    allFilterActive={allFilterActive}
                    activeFilterActive={activeFilterActive}
                    isCompletedFilterActive={isCompletedFilterActive}
                    overdueFilterActive={overdueFilterActive}
                />
                <TodoList
                    todos={filteredTodos}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                />
                <TodoFooter
                    countRemaining={countRemaining}
                    handleClear={handleClear}
                />
            </StyledMain>

        </ThemeProvider>


    );
}

export default App;