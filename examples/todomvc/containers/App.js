import React from 'react';
import header from '../components/Header';
import mainSection from '../components/MainSection';

function app({todos$}) {
  const {
    element: Header,
    events: {
      save$
    }
  } = header();

  const {
    element: MainSection,
    events: {
      toggleAll$,
      clickClearCompletedBtn$,
      deleteTodo$,
      completeTodo$,
      editTodo$
    }
  } = mainSection({todos$});

  const element = (
    <div>
      {Header}
      {MainSection}
    </div>
  );

  return {
    element,
    events: {
      save$,
      toggleAll$,
      clickClearCompletedBtn$,
      deleteTodo$,
      completeTodo$,
      editTodo$
    }
  }
};

export default app;
