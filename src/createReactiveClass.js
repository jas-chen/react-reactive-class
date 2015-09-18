import React from 'react';
import {isRxObservable} from './utils';

export default function createReactiveClass(tag) {
  class ReactiveClass extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = `ReactiveElement-${tag}`;
      this.state = props;
    }

    addPropListener(name, prop$) {
      // bind?
      return prop$.subscribeOnNext((value) => {
        const prop = {};
        prop[name] = value;
        this.setState(prop);
      });
    }

    subscribeProps() {
      if (this.subscriptions) {
        this.unsubscribeProps();
      }

      this.subscriptions = [];

      for (var key in this.props) {
        const value = this.props[key];
        if (isRxObservable(value)) {
          const subscription = this.addPropListener(key, value);
          this.subscriptions.push(subscription);
        }
      }
    }

    unsubscribeProps() {
      this.subscriptions.forEach(subscription => subscription.dispose());
      this.subscriptions = null;
    }

    componentWillMount() {
      this.subscribeProps();
    }

    // Do we really need this?
    componentWillReceiveProps(nextProps) {
      this.subscribeProps();
    }

    componentWillUnmount() {
      this.unsubscribeProps();
    }

    render() {
      return React.createElement(tag, this.state, this.state.children);
    }
  }

  return ReactiveClass;
}
