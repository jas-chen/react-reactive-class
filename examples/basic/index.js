import React from 'react';
import {dom, reactive} from 'react-reactive-class';
import {EventEmitter} from 'events';
import Rx from 'rx';

const {div:Xdiv} = dom;

class Button extends React.Component {
  render() {
    console.log('Button rendered.');

    return (
      <button className="btn btn-primary" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

// custom attribute name

// you can use ES7 decorator
// @reactive('eventEmitter')
class Text extends React.Component {
  render() {
    console.log('Text rendered.');

    return (
      <div className="h3">
        {this.props.children}
      </div>
    );
  }
}

// ES5/ES6
const XText = reactive(Text, 'eventEmitter');

class App extends React.Component {
  componentWillMount() {
    this.ee = new EventEmitter();
    this.props$ = new Rx.Subject();
  }

  handleClick() {
    const props = {children: new Date().getTime()};

    this.ee.emit('props', props);
    this.props$.onNext(props);
  }

  render() {
    console.log('App rendered.');
    const time = new Date().getTime();

    return (
      <div>
        <Button onClick={this.handleClick.bind(this)}>Get time</Button>
        <Xdiv ee={this.ee} className="h3">{time}</Xdiv>
        <Xdiv ee={this.props$} className="h3">{time}</Xdiv>
        <XText eventEmitter={this.props$}>{time}</XText>
      </div>
    );
  }
}

React.render(<App />, document.getElementById('app'));
