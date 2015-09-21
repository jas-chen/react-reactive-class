import React from 'react';
import {dom} from 'react-reactive-class';
import Rx from 'rx';

const {span:Span} = dom;

function button(text) {
  const clickEv$ = new Rx.Subject();
  const element = <button onClick={clickEv$.onNext.bind(clickEv$)}>{text}</button>;
  return {
    element,
    events: {
      clickEv$
    }
  }
}

function counter(counter$) {
  const {
    element: IncrementButton,
    events: { clickEv$: clickIncrementButton$ }
  } = button('+');

  const {
    element: DecrementButton,
    events: { clickEv$: clickDecrementButton$ }
  } = button('-');

  const {
    element: IncrementIfOddButton,
    events: { clickEv$: clickIncrementIfOddButton$ }
  } = button('Increment if odd');

  const {
    element: IncrementAsyncButton,
    events: { clickEv$: clickIncrementAsyncButton$ }
  } = button('Increment async');

  const element = (
    <p>
      Clicked: <Span>{counter$}</Span> times
      {' '}
      {IncrementButton}
      {' '}
      {DecrementButton}
      {' '}
      {IncrementIfOddButton}
      {' '}
      {IncrementAsyncButton}
    </p>
  );

  return {
    element,
    events: {
      clickIncrementButton$,
      clickDecrementButton$,
      clickIncrementIfOddButton$,
      clickIncrementAsyncButton$
    }
  };
}

export default counter;
