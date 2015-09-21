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
