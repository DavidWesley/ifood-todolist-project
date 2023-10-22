import styled from "styled-components";

export const StyledFilters = styled.section`
    background: ${({theme}) => theme.bgTodos};
    margin-bottom: 10px;
    position: relative;
    height: 3.75rem;
    border-top-left-radius: .4rem;
    border-top-right-radius: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .83rem;
    box-shadow: 0 1rem 1.25rem ${({theme}) => theme.boxShadow};

    .remaining {
        color: ${({theme}) => theme.mainText};
    }

    .filters {
        
        border-bottom: 1px solid white;        
        height: 3.75rem;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        border-radius: .4rem;
        background: ${({theme}) => theme.bgTodos};
        box-shadow: 0 1rem 1.25rem ${({theme}) => theme.boxShadow};

        .filter {
            width: 100%;
            font-size: .9rem;
            font-weight: 700;
            
            &:hover {
                cursor: pointer;
                /* color: ${({theme}) => theme.todosText}; */
                color: #caf0f8;
            }
        }  

        .active-filter {
            color: #48cae4;
        }
    }

    .filter, .clear {
        background: none;
        border: none;
        color: ${({theme}) => theme.mainText};
        transition: all 150ms linear;
    }

    .clear:hover {
        cursor: pointer;
        color: rgb(168, 0, 0);
    }

   
`