import React from 'react';
import {reactive} from 'react-reactive-class';
import {EventEmitter} from 'events';

// A handmade reactive component, not that hard!
class TabItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: !!this.props.active};
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
  }

  handleTabSwitch({tabId}) {
    const active = this.props.id === tabId;
    if (active !== this.state.active) {
      this.setState({active: active});
    }
  }

  handleClick(e) {
    e.preventDefault();
    if (!this.state.active) {
      this.props.ee.emit('tab-switch', {tabId: this.props.id});
    }
  }

  componentWillMount() {
    this.props.ee.on('tab-switch', this.handleTabSwitch);
  }

  componentWillUnmount() {
    this.props.ee.removeListener('tab-switch', this.handleTabSwitch);
  }

  render() {
    console.log(`TabItem ${this.props.id} rendered.`);
    return (
      <li className={this.state.active? 'active': ''}>
        <a href='#' onClick={this.handleClick.bind(this)}>{this.props.children}</a>
      </li>
    );
  }
}

// listen to 'tab-switch' event
@reactive('ee', 'tab-switch')
class TabContent extends React.Component {
  render() {
    console.log('TabContent rendered.');
    return (
      <div>{this.props.tabId}</div>
    );
  }
}

// Timer is REACTIVE because it emits events and doesn't update TimerDisplay directly.
class Tab extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.ee = new EventEmitter();
  }

  componentWillUnmount() {
    this.ee = null;
  }

  render() {
    console.log('Tab rendered.');
    return (
      <div>
        <ul className="nav nav-tabs">
          <TabItem ee={this.ee} id="home" active>Home</TabItem>
          <TabItem ee={this.ee} id="profile">Profile</TabItem>
          <TabItem ee={this.ee} id="messages">Message</TabItem>
          <TabItem ee={this.ee} id="settings">Settings</TabItem>
          <TabItem ee={this.ee} id="about">About</TabItem>
        </ul>

        <div className="tab-content">
          <TabContent ee={this.ee} tabId="home" />
        </div>
      </div>
    );
  }
}

React.render(<Tab />, document.getElementById('app'));
