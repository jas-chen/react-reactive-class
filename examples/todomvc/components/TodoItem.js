import React from 'react';
import { Subject } from 'rx';
import { dom } from 'react-reactive-class';
import classnames from 'classnames';
import todoTextInput from './TodoTextInput';

const {li:Li} = dom;

function createEditing$(initValue) {
  const editing$ = new Subject();
  return {
    editing$: editing$.startWith(initValue),
    setEditing: editing$.onNext.bind(editing$)
  }
}

function todoItem({key, todo, deleteTodo, completeTodo, editTodo}) {
  const {editing$, setEditing} = createEditing$(false);

  function handleDoubleClick() {
    setEditing(true);
  }

  function handleSave(text) {
    const id = todo.id;
    if (text.length === 0) {
      deleteTodo({id});
    } else {
      editTodo({id, text});
    }

    setEditing(false);
  }

  const className$ = editing$.map(
    editing => classnames({
      completed: todo.completed,
      editing
    })
  );

  const Todo$ = editing$.map(
    editing => {
      const {
        element: TodoTextInput,
        events: {
          save$
        }
      } = todoTextInput({
        text: todo.text,
        newTodo: false,
        editing
      });

      save$.subscribe(handleSave);

      return (
        editing
        ? (
          TodoTextInput
        )
        : (
          <div className="view">
            <input className="toggle"
                   type="checkbox"
                   checked={todo.completed}
                   onChange={() => completeTodo({id: todo.id})} />
            <label onDoubleClick={handleDoubleClick}>
              {todo.text}
            </label>
            <button className="destroy"
                    onClick={() => deleteTodo({id: todo.id})} />
          </div>
        )
      );
    }
  );

  const element = (
    <Li key={key} className={className$}>
      {Todo$}
    </Li>
  );

  return {
    element
  }
}

export default todoItem;

/*
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';

class TodoItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  handleDoubleClick() {
    this.setState({ editing: true });
  }

  handleSave(id, text) {
    if (text.length === 0) {
      this.props.deleteTodo(id);
    } else {
      this.props.editTodo(id, text);
    }
    this.setState({ editing: false });
  }

  render() {
    const {todo, completeTodo, deleteTodo} = this.props;

    let element;
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text}
                       editing={this.state.editing}
                       onSave={(text) => this.handleSave(todo.id, text)} />
      );
    } else {
      element = (
        <div className="view">
          <input className="toggle"
                 type="checkbox"
                 checked={todo.completed}
                 onChange={() => completeTodo(todo.id)} />
          <label onDoubleClick={this.handleDoubleClick.bind(this)}>
            {todo.text}
          </label>
          <button className="destroy"
                  onClick={() => deleteTodo(todo.id)} />
        </div>
      );
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    );
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  editTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired
};

export default TodoItem;
*/
