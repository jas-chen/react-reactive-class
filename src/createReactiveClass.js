import React from 'react';
import {isRxObservable, pickProps} from './utils';

export default function createReactiveClass(tag) {
  class ReactiveClass extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = `ReactiveElement-${tag}`;
      this.state = pickProps(props);
      this.state.mount = true;
    }

    addPropListener(name, prop$) {
      return prop$.subscribeOnNext((value) => {
        const prop = {};
        if (name === 'mount') {
          const mount = (
            value === 'mount' ? true
            : value === 'unmount' ? false
            : value === 'toggle' ? !this.state.mount
            : undefined
          );

          if (mount === undefined) {
            console.error("value of mount should be 'mount', 'unmount' or 'toggle'");
            return;
          }

          // prevent unnecessary re-render
          if (mount === this.state.mount) {
            return;
          }

          prop[name] = mount;
        }
        else {
          prop[name] = value;
        }

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

    componentWillReceiveProps(nextProps) {
      this.subscribeProps();
    }

    componentWillUnmount() {
      this.unsubscribeProps();
    }

    render() {
      if (!this.state.mount) {
        return null;
      }

      const finalProps = {};
      for (var key in this.state) {
        if (key !== 'mount') {
          finalProps[key] = this.state[key];
        }
      }

      return React.createElement(tag, finalProps);
    }
  }

  return ReactiveClass;
}
