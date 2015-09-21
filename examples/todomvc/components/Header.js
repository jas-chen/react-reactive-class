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

/*
import React, { PropTypes, Component } from 'react';
import TodoTextInput from './TodoTextInput';

class Header extends Component {
  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  }

  render() {
    return (
      <header className="header">
          <h1>todos</h1>
          <TodoTextInput newTodo
                         onSave={this.handleSave.bind(this)}
                         placeholder="What needs to be done?" />
      </header>
    );
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default Header;
*/
