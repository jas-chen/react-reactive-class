import React from 'react';
import { Subject } from 'rx';
import { dom } from 'react-reactive-class';
import classnames from 'classnames';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
};

const {a:A, span: Span, strong: Strong, button: Button} = dom;

function renderTodoCount(activeCount$) {
  const itemWord$ = activeCount$.map(activeCount => {
    return (activeCount === 1 ? 'item' : 'items');
  });

  const activeCountWord$ = activeCount$.map(
    activeCount => activeCount || 'No'
  );

  return (
    <span className="todo-count">
      <Strong>{activeCountWord$}</Strong> <Span>{itemWord$}</Span> left
    </span>
  );
}

function renderFilterLink(filter, selectedFilter$, onShow) {
  const title = FILTER_TITLES[filter];
  const className$ = selectedFilter$.map(
    selectedFilter => classnames({ selected: filter === selectedFilter })
  );

  return (
    <A className={className$}
       style={{ cursor: 'pointer' }}
       onClick={() => onShow(filter)}>
      {title}
    </A>
  );
}

function footer({todos$, completedCount$, filter$, onShow}) {
  const activeCount$ = todos$.map(todos => {
    return todos.filter(todo => !todo.completed).length;
  });;

  const mount$ = todos$.map(todos => !!todos.length);

  const clickClearCompletedBtn$ = new Subject();

  const onShow$ = new Subject();

  const element = (
    <footer className="footer" mount={mount$}>
      {renderTodoCount(activeCount$)}
      <ul className="filters">
        {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(filter =>
          <li key={filter}>
            {renderFilterLink(filter, filter$, onShow)}
          </li>
        )}
      </ul>
      <Button className="clear-completed"
              mount={completedCount$.map(count => !!count)}
              onClick={clickClearCompletedBtn$.onNext.bind(clickClearCompletedBtn$)} >
        Clear completed
      </Button>
    </footer>
  );

  return {
    element,
    events: {
      clickClearCompletedBtn$
    }
  };
}

export default footer;
