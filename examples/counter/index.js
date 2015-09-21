import ReactDOM from 'react-dom';
import Rx from 'rx';
import counter from './components/counter';
import configureStore from './store/configureStore';
import * as CounterActions from './actions/counter';

const store = configureStore();

function reduce(action) {
  store.dispatch(action);
  return store.getState();
}

const action$ = new Rx.Subject();
const state$ = action$.map(reduce).startWith(store.getState());
const counter$ = state$.map(state => state.counter);

const {
  element: Counter,
  events: {
    clickIncrementButton$,
    clickDecrementButton$,
    clickIncrementIfOddButton$,
    clickIncrementAsyncButton$
  }
} = counter(counter$);

clickIncrementButton$.subscribe(() => {
  action$.onNext(CounterActions.increment);
});

clickDecrementButton$.subscribe(() => {
  action$.onNext(CounterActions.decrement);
});

function counterIsOdd() {
  return store.getState().counter % 2 !== 0;
}

clickIncrementIfOddButton$.filter(counterIsOdd).subscribe(() => {
  action$.onNext(CounterActions.increment);
});

clickIncrementAsyncButton$.delay(1000).subscribe(() => {
  action$.onNext(CounterActions.increment);
});

ReactDOM.render(Counter, document.getElementById('root'));
