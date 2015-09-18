import React from 'react';
import {isRxObservable, containUpperCase, pickProps} from './utils';

export default function createReactiveClass(tag) {
  class ReactiveClass extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = `ReactiveElement-${tag}`;
      this.state = props;
      this.isHtmlTag = !containUpperCase(tag);
    }

    addPropListener(name, prop$) {
      return prop$.subscribeOnNext((value) => {
        const prop = {};
        if (name === 'mount') {
          prop[name] = (
            value === 'mount' ? true
            : value === 'unmount' ? false
            : value === 'toggle' ? !this.state[name]
            : undefined
          );

          if (prop[name] === undefined) {
            console.error(`value of ${name} should be 'mount', 'unmount' or 'toggle'`);
            return;
          }
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

    // Do we really need this?
    componentWillReceiveProps(nextProps) {
      this.subscribeProps();
    }

    componentWillUnmount() {
      this.unsubscribeProps();
    }

    render() {
      if (this.state.mount === false) {
        return null;
      }

      if (this.isHtmlTag) {
        const pickedProps = pickProps(this.state);
        return React.createElement(tag, pickedProps, this.state.children);
      }

      return React.createElement(tag, this.state, this.state.children);
    }
  }

  return ReactiveClass;
}
