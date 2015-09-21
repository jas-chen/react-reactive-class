import React from 'react';
import { Observable, Subject } from 'rx';
import todoTextInput from './TodoTextInput';

function header() {
  const save$ = new Subject();

  const {
    element: TodoTextInput
  } = todoTextInput({
    newTodo: true,
    placeholder: "What needs to be done?",
    onSave: save$.onNext.bind(save$)
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
      save$: save$.filter(text => text.length)
    }
  };
}

export default header;
