import React from 'react';
import { StyledFooter } from '../styled/TodoFooter.styled';

interface TodoFooterProps {
  countRemaining: () => string;
  handleClear: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ countRemaining, handleClear }) => {

  return (
    <StyledFooter>
      <p className="remaining">{countRemaining()}</p>
      <div className="filters">
      </div>
      <button className="clear" onClick={handleClear}>Excluir completas</button>
    </StyledFooter>
  );
};

export default TodoFooter;