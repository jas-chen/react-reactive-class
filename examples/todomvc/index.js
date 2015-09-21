import 'babel-core/polyfill';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import app from './containers/App';
import configureStore from './store/configureStore';
import * as TodoActions from './actions/todos';
import 'todomvc-app-css/index.css';

function handleEvant(store, events) {
  events.save$.subscribe(
    todo => store.dispatch(TodoActions.addTodo(todo))
  );

  events.toggleAll$.subscribe(
    () => store.dispatch(TodoActions.completeAll())
  );

  events.clearCompleted$.subscribe(
    () => store.dispatch(TodoActions.clearCompleted())
  );

  events.deleteTodo$.subscribe(
    ({id}) => store.dispatch(TodoActions.deleteTodo(id))
  );

//
  events.completeTodo$.subscribe(
    ({id}) => store.dispatch(TodoActions.completeTodo(id))
  );

  events.editTodo$.subscribe(
    ({id, text}) => store.dispatch(TodoActions.editTodo(id, text))
  );
}

const store = configureStore();
store.state$.subscribe(state => console.log(state));

const {
  element: App,
  events
} = app({
  todos$: store.state$.map(state => state.todos)
});

handleEvant(store, events);

ReactDOM.render(
  App,
  document.getElementById('root')
);
