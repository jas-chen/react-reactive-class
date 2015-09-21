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

/*
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

class TodoTextInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || ''
    };
  }

  handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === 13) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleBlur(e) {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value);
    }
  }

  render() {
    return (
      <input className={
        classnames({
          edit: this.props.editing,
          'new-todo': this.props.newTodo
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)} />
    );
  }
}

TodoTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newTodo: PropTypes.bool
};

export default TodoTextInput;
*/
