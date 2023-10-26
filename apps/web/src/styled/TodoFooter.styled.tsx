import styled from "styled-components";

export const StyledFooter = styled.section`
    background: ${({theme}) => theme.bgTodos};
    position: relative;
    height: 3.75rem;
    border-bottom-left-radius: .4rem;
    border-bottom-right-radius: .4rem;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: .83rem;

    .remaining {
        color: ${({theme}) => theme.mainText};
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