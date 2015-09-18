import React from 'react';
import {isRxObservable, pickProps} from './utils';

export default function createReactiveClass(tag) {
  class ReactiveClass extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = `ReactiveElement-${tag}`;
      this.state = props;
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
            console.error(`value of ${name} should be 'mount', 'unmount' or 'toggle'`);
            return;
          }

          // prevent unnecessary re-render
          if ( (typeof this.state.mount !== 'boolean' && mount)
              || (mount === this.state.mount)) {
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

    getElementInfo() {
      return {
        DOMNode: React.findDOMNode(this),
        props: this.pickedProps
      } ;
    }

    componentWillMount() {
      this.subscribeProps();
    }

    componentDidMount() {
      if (this.props.onDidMount) {
        this.props.onDidMount(this.getElementInfo());
      }
    }

    componentWillReceiveProps(nextProps) {
      this.subscribeProps();
    }

    componentDidUpdate() {
      if (this.props.onDidUpdate) {
        this.props.onDidUpdate(this.getElementInfo());
      }
    }

    componentWillUnmount() {
      this.unsubscribeProps();
      this.pickedProps = null;

      if (this.props.onWillUnmount) {
        this.props.onWillUnmount();
      }
    }

    render() {
      // this.state.mount may be undefined, don't use ! operator here.
      if (this.state.mount === false) {
        return null;
      }

      this.pickedProps = pickProps(this.state);
      return React.createElement(tag, this.pickedProps, this.state.children);
    }
  }

  return ReactiveClass;
}
