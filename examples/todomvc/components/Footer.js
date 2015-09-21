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

const {a:A, span: Span, strong: Strong} = dom;

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
  const activeCount$ = todos$.withLatestFrom(
    completedCount$,
    (todos, completedCount) => todos.length - completedCount
  );

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
      <button className="clear-completed"
              mount={completedCount$.map(c => c.length)}
              onClick={clickClearCompletedBtn$.onNext.bind(clickClearCompletedBtn$)} >
        Clear completed
      </button>
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

/*
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
};

class Footer extends Component {
  renderTodoCount() {
    const { activeCount } = this.props;
    const itemWord = activeCount === 1 ? 'item' : 'items';

    return (
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
    );
  }

  renderFilterLink(filter) {
    const title = FILTER_TITLES[filter];
    const { filter: selectedFilter, onShow } = this.props;

    return (
      <a className={classnames({ selected: filter === selectedFilter })}
         style={{ cursor: 'pointer' }}
         onClick={() => onShow(filter)}>
        {title}
      </a>
    );
  }

  renderClearButton() {
    const { completedCount, onClearCompleted } = this.props;
    if (completedCount > 0) {
      return (
        <button className="clear-completed"
                onClick={onClearCompleted} >
          Clear completed
        </button>
      );
    }
  }

  render() {
    return (
      <footer className="footer">
        {this.renderTodoCount()}
        <ul className="filters">
          {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(filter =>
            <li key={filter}>
              {this.renderFilterLink(filter)}
            </li>
          )}
        </ul>
        {this.renderClearButton()}
      </footer>
    );
  }
}

Footer.propTypes = {
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  filter: PropTypes.string.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired
};

export default Footer;
*/
