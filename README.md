# React Reactive Class

[![npm version](https://img.shields.io/npm/v/react-reactive-class.svg?style=flat-square)](https://www.npmjs.com/package/react-reactive-class)

## What?
With React Reactive Class, you can create Reactive Components, which
subscribe Rx.Observables and re-render themselves.

## Features

- **Reactive DOM elements**: A set of reactive DOM elements (button, div, span, etc).

- **Reactive wrapper**: A higher order component to wrap your existing component to be a Reactive Component.

## Installation
```
npm install --save react-reactive-class
```

## Usage

### Use reactive DOM elements
```javascript
import React from 'react';
import Rx from 'rx';

import {dom} from 'react-reactive-class';

const { div:Div, span:Span } = dom;

window.style$ = new Rx.Subject();
window.text$ = new Rx.Subject();

class App extends React.Component {
  render() {
    console.log('App rendered.');

    return (
      <div>
        <h1>Demo</h1>
        <Div style={window.style$}>Hello</Div>
        <Span>{window.text$}</Span>
      </div>
    );
  }
}

React.render(<App />, document.getElementById('app'));

// notice that App will not re-render, nice!
window.style$.onNext({color: 'blue'});
window.text$.onNext('Reactive!');
// you can open your console and play around
```

### Use Reactive wrapper

#### ES5/ES6
```javascript
import {reactive} from 'react-reactive-class';

class Text extends React.Component {
  render() {
    console.log('Text rendered.');

    return (
      <div>{this.props.children}</div>
    );
  }
}

const XText = reactive(Text);
```

#### ES7
```javascript
import {reactive} from 'react-reactive-class';

@reactive
class XText extends React.Component {
  render() {
    console.log('Text rendered.');

    return (
      <div>{this.props.children}</div>
    );
  }
}
```

### Mount/unmount Reactive Component
Reactively compose components!
```javascript
// Unmount this component if length of incoming text is 0.
<Span mount={ text$.map(text => text.length) }>
  {text$}
</Span>
```

## Child component constraint
Source must be the only child when using observable as child component.
```javascript
// This will not work
<Span>
  Hello {name$}, how are you?
</Span>

// This will work
<span>
  Hello <Span>{name$}</Span>, how are you?
</span>
```

## Feedbacks are welcome!
Feel free to ask questions or submit pull requests!

## License
The MIT License (MIT)
