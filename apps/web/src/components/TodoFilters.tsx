import React from 'react';
import { StyledFilters } from '../styled/TodoFilters.styled';

interface TodoFiltersProps {
  setFilter: (filter: string) => void;
  allFilterActive: boolean;
  activeFilterActive: boolean;
  completedFilterActive: boolean;
  overdueFilterActive: boolean;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({ setFilter, allFilterActive, activeFilterActive, completedFilterActive, overdueFilterActive }) => {

  function handleFilterAll() {
    setFilter('todas');
  }

  function handleFilterActive() {
    setFilter('incompletas');
  }

  function handleFilterComplete() {
    setFilter('completas');
  }

  function handleFilterOverdue() {
    setFilter('atrasadas');
  }

  return (
    <StyledFilters>
      <div className="filters">
        <button className={allFilterActive ? "filter active-filter" : "filter"} onClick={handleFilterAll}>Todas</button>
        <button className={activeFilterActive ? "filter active-filter" : "filter"} onClick={handleFilterActive}>Abertas</button>
        <button className={completedFilterActive ? "filter active-filter" : "filter"} onClick={handleFilterComplete}>Completas</button>
        <button className={overdueFilterActive ? "filter active-filter" : "filter"} onClick={handleFilterOverdue}>Atrasadas</button>
      </div>
    </StyledFilters>
  );
};

export default TodoFilters;