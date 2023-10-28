import styled from "styled-components";

export const StyledDescriptionTodo = styled.div`
   padding: 0 1rem;
   background-color: ${({theme}) => theme.bgTodos};
   border-bottom: 1px solid ${({theme}) => theme.borders};
   margin-bottom: 10px;
   font-size: 12px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   position: relative;
   color: ${({theme}) => theme.todosText};
   box-shadow: 0 1rem 1.25rem ${({theme}) => theme.boxShadow};

   &:hover, .todo-name:hover, .custom-checkbox:hover, input:hover, .todo-delete:hover {
        cursor: pointer;
    }

    .text{
        width: 100%;        
        padding: 5px 5px 5px 15px;
        word-wrap: break-word;
    }

    .text p{
        width: 100%
    }

   .complete-todo {
    display: none;
    color: ${({theme}) => theme.complete};
   }
   @media (min-width: 1440px) {
    .text {
        width: 27.25rem;
    }
}

`