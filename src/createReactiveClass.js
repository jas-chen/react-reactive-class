import React from 'react';
import {isEventEmitter, isRxObservable} from './utils';

export default function createReactiveClass(tag, providerName = 'ee', eventName = 'props') {
  class ReactiveClass extends React.Component {
    addListener(provider) {
      const listener = this.setState.bind(this);

      if (provider.on) {
        provider.on(eventName, listener);
        this.removeListener = () => {
          provider.removeListener(eventName, listener);
        };
      } else {
        const subscription = provider.subscribeOnNext(listener);
        this.removeListener = () => {
          subscription.dispose();
        };
      }
    }

    constructor(props) {
      super(props);
      this.displayName = `ReactiveElement-${tag}`;
      this.state = props;
    }

    componentWillMount() {
      this.addListener(this.props[providerName]);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps[providerName] !== this.props[providerName]) {
        this.removeListener();
        this.addListener(nextProps[providerName]);
      }
    }

    componentWillUnmount() {
      this.removeListener();
      this.removeListener = null;
    }

    render() {
      return React.createElement(tag, this.state, this.state.children);
    }
  }

  ReactiveClass.propTypes = {};
  ReactiveClass.propTypes[providerName] = (props, propName) => {
    const provider = props[propName];
    if (!isEventEmitter(provider) && !isRxObservable(provider)) {
      return new Error(`${propName} must be an event emitter or Rx.Observable.`);
    }
  };

  return ReactiveClass;
}
