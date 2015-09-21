import React from 'react';
import { Observable } from 'rx';
import todoTextInput from './TodoTextInput';

function header() {
  const {
    element: TodoTextInput,
    events: {
      save$
    }
  } = todoTextInput({
    newTodo: true,
    placeholder: "What needs to be done?"
  });

  const element = (
    <header className="header">
      <h1>todos</h1>
      {TodoTextInput}
    </header>
  );

  return {
    element,
    events: {
      save$
    }
  };
}

export default header;
