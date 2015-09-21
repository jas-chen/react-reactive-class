import React from 'react';
import { Observable, Subject } from 'rx';
import { dom } from 'react-reactive-class';
import classnames from 'classnames';

const {input:Input} = dom;

function createText$(initValue) {
  const text$ = new Subject();
  return {
    text$: text$.startWith(initValue),
    setText: text$.onNext.bind(text$)
  }
}

function todoTextInput({text, newTodo, editing, placeholder}) {
  const { text$, setText } = createText$(text || '');
  const clickEv$ = new Subject();
  const save$ = new Subject();

  const className = classnames({
    edit: editing,
    'new-todo': newTodo
  });

  function handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === 13 && text.length) {
      save$.onNext(text);
    }
  }

  function handleBlur(e) {
    const text = e.target.value.trim();
    if (!newTodo) {
      save$.onNext(text);
    }
  }

  clickEv$.subscribe(e => setText(e.target.value));
  // clear input after saving
  save$.filter(() => newTodo).subscribe(() => setText(''));

  const element = (
    <Input className={className}
      type="text"
      placeholder={placeholder}
      autoFocus="true"
      value={text$}
      onBlur={handleBlur}
      onChange={clickEv$.onNext.bind(clickEv$)}
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
