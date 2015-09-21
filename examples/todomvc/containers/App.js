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
/*
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';

class App extends Component {
  render() {
    const { todos, dispatch } = this.props;
    const actions = bindActionCreators(TodoActions, dispatch);

    return (
      <div>
        <Header addTodo={actions.addTodo} />
        <MainSection todos={todos} actions={actions} />
      </div>
    );
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

export default connect(mapStateToProps)(App);
*/
