import React from 'react';
import { Observable, Subject } from 'rx';
import { dom } from 'react-reactive-class';
import classnames from 'classnames';
import { initSubject } from '../utils';

const { input:Input } = dom;

function todoTextInput({text, newTodo, editing, placeholder}) {
  const { $: text$, onNext: setText} = initSubject(text || '');
  const save$ = new Subject();

  const className = classnames({
    edit: editing,
    'new-todo': newTodo
  });

  function handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === 13) {
      save$.onNext(text);
    }
  }

  function handleBlur(e) {
    const text = e.target.value.trim();
    if (!newTodo) {
      save$.onNext(text);
    }
  }

  // clear input after saving
  save$.filter(() => newTodo).subscribe(() => setText(''));

  const element = (
    <Input className={className}
      type="text"
      placeholder={placeholder}
      autoFocus="true"
      value={text$}
      onBlur={handleBlur}
      onChange={e => setText(e.target.value)}
      onKeyDown={handleSubmit} />
  );

  return {
    element,
    events: {
      save$
    }
  };
}

export default todoTextInput;
