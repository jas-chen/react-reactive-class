import React from 'react';
import {isRxObservable, pickProps} from './utils';

export default function createReactiveClass(tag) {
  class ReactiveClass extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = `ReactiveElement-${tag}`;
      this.state = pickProps(props, (key, value) => !isRxObservable(value));
      this.state.mount = true;
    }

    componentWillMount() {
      this.subscribe(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.subscribe(nextProps);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    addPropListener(name, prop$) {
      return prop$.subscribeOnNext((value) => {
        // don't re-render if value is the same.
        if (value === this.state[name]) {
          return;
        }

        const prop = {};
        prop[name] = value;
        this.setState(prop);
      });
    }

    subscribe(props) {
      if (this.subscriptions) {
        this.unsubscribe();
      }

      this.subscriptions = [];

      Object.keys(props).forEach(key => {
        const value = props[key];
        if (isRxObservable(value)) {
          const subscription = this.addPropListener(key, value);
          this.subscriptions.push(subscription);
        }
      });
    }

    unsubscribe() {
      this.subscriptions.forEach(subscription => subscription.dispose());
      this.subscriptions = null;
    }

    render() {
      if (!this.state.mount) {
        return null;
      }

      const finalProps = pickProps(this.state, (key) => key !== 'mount');
      return React.createElement(tag, finalProps);
    }
  }

  return ReactiveClass;
}
