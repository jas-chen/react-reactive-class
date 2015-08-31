import React from 'react';
import {dom, reactive} from 'react-reactive-class';
import {EventEmitter} from 'events';

// TimerDisplay is REACTIVE because it listens to events and update itself.
@reactive
class TimerDisplay extends React.Component {
  render() {
    console.log('TimerDisplay rendered.');
    return (
      <div>Seconds Elapsed: {this.props.secondsElapsed}</div>
    );
  }
}

// Timer is REACTIVE because it emits events and doesn't update TimerDisplay directly.
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.secondsElapsed = 0;
  }

  componentWillMount() {
    this.ee = new EventEmitter();
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.ee.emit('props', {secondsElapsed: ++this.secondsElapsed});
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.ee = null;
  }

  render() {
    console.log('Timer rendered.');
    return (
      <TimerDisplay ee={this.ee} secondsElapsed={this.secondsElapsed}/>
    );
  }
}

React.render(<Timer />, document.getElementById('app'));
