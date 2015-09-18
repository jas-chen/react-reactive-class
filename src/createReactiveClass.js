import React from 'react';
import {isRxObservable, pickProps, calculateMount} from './utils';

export default function createReactiveClass(tag) {
  class ReactiveClass extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = `ReactiveElement-${tag}`;
      this.state = pickProps(props);
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
        const prop = {};
        if (name === 'mount') {
          const mount = calculateMount(value, this.state.mount);

          if (mount === undefined) {
            throw new Error("value of mount should be 'mount', 'unmount' or 'toggle'");
          }

          // prevent unnecessary re-rendering
          if (mount === this.state.mount) {
            return;
          }

          prop[name] = mount;
        } else {
          prop[name] = value;
        }

        this.setState(prop);
      });
    }

    subscribe(props) {
      if (this.subscriptions) {
        this.unsubscribe();
      }

      this.subscriptions = [];

      for (const key in props) { // eslint-disable-line guard-for-in
        const value = props[key];
        if (isRxObservable(value)) {
          const subscription = this.addPropListener(key, value);
          this.subscriptions.push(subscription);
        }
      }
    }

    unsubscribe() {
      this.subscriptions.forEach(subscription => subscription.dispose());
      this.subscriptions = null;
    }

    render() {
      if (!this.state.mount) {
        return null;
      }

      const finalProps = {};
      for (const key in this.state) {
        if (key !== 'mount') {
          finalProps[key] = this.state[key];
        }
      }

      return React.createElement(tag, finalProps);
    }
  }

  return ReactiveClass;
}
