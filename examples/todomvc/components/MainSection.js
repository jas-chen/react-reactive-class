import React from 'react';
import { Observable, Subject } from 'rx';
import { dom } from 'react-reactive-class';
import todoItem from './TodoItem';
import footer from './Footer';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
};

const {div:Div, input:Input} = dom;

function createFilter(initFilter) {
  const filter$ = new Subject();
  return {
    filter$: filter$.startWith(initFilter),
    onShow: filter$.onNext.bind(filter$)
  }
}

function toggleAll({todos$, completedCount$}) {
  const toggleAll$ = new Subject();
  const checked$ = completedCount$.withLatestFrom(
    todos$,
    (completedCount, todos) => completedCount === todos.length
  );

  const element = (
    <Input mount={todos$.map(todos => !!todos.length)}
           className="toggle-all"
           type="checkbox"
           checked={checked$}
           onChange={toggleAll$.onNext.bind(toggleAll$)} />
  );

  return {
    element,
    events: {
      toggleAll$
    }
  }
}

function todoList(todos$) {
  const deleteTodo$ = new Subject();
  const editTodo$ = new Subject();
  const completeTodo$ = new Subject();

  const element$ = todos$.map(todos => {
    return (
      <ul className="todo-list">
        {todos.map(todo => {
          const {
            element: TodoItem
          } = todoItem({
            key: todo.id,
            todo,
            deleteTodo: deleteTodo$.onNext.bind(deleteTodo$),
            completeTodo: completeTodo$.onNext.bind(completeTodo$),
            editTodo: editTodo$.onNext.bind(editTodo$)
          });

          return TodoItem;
        })}
      </ul>
    );
  });

  return {
    element$,
    events: {
      deleteTodo$,
      completeTodo$,
      editTodo$
    }
  }
}

function mainSection({todos$}) {
  const {filter$, onShow} = createFilter(SHOW_ALL);
  const filteredTodos$ = Observable.combineLatest(
    todos$,
    filter$,
    (todos, filter) => todos.filter(TODO_FILTERS[filter])
  );

  // filteredTodos$.subscribe(todo=>console.log(todo));

  const completedCount$ = todos$.map(todos => {
    return todos.filter(todo => todo.completed).length;
  });

  const {
    element: ToggleAll,
    events: {
      toggleAll$
    }
  } = toggleAll({todos$, completedCount$});

  const {
    element$: TodoList$,
    events: {
      deleteTodo$,
      completeTodo$,
      editTodo$
    }
  } = todoList(filteredTodos$);

  const {
    element: Footer,
    events: {
      clickClearCompletedBtn$
    }
  } = footer({
    todos$,
    completedCount$,
    filter$,
    onShow
  });

  const element = (
    <section className="main">
      {ToggleAll}
      <Div>{TodoList$}</Div>
      {Footer}
    </section>
  );

  return {
    element,
    events: {
      toggleAll$,
      clickClearCompletedBtn$,
      deleteTodo$,
      completeTodo$,
      editTodo$
    }
  };
}

export default mainSection;
