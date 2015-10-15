# React Reactive Class

[![npm version](https://img.shields.io/npm/v/react-reactive-class.svg?style=flat-square)](https://www.npmjs.com/package/react-reactive-class)

## What?
With React Reactive Class, you can create Reactive Components, which
subscribe Rx.Observables and re-render themselves.

## Example

The following example renders a component with buttons to increment and decrement a counter.

You can compare this example to [Counter example of Cycle.js](https://github.com/cyclejs/cycle-examples/blob/master/counter/src/main.js) and [Counter example of Yolk](https://github.com/yolkjs/yolk#example).

```javascript
import { Subject } from 'rx';
import React from 'react';
import ReactDOM from 'react-dom';
import { dom } from 'react-reactive-class';

const { span: Span } = dom;

function Counter () {

  // map all plus button click events to 1
  const handlePlus = new Subject();
  const plusOne = handlePlus.map(() => 1);

  // map all minus button click events to -1
  const handleMinus = new Subject();
  const minusOne = handleMinus.map(() => -1);

  // merge both event streams together and keep a running count of the result
  const count = plusOne.merge(minusOne).scan((x, y) => x + y, 0).startWith(0);

  return (
    <div>
      <div>
        <button id="plus" onClick={handlePlus.onNext.bind(handlePlus)}>+</button>
        <button id="minus" onClick={handleMinus.onNext.bind(handleMinus)}>-</button>
      </div>
      <div>
        Count: <Span>{count}</Span>
      </div>
    </div>
  )
}

ReactDOM.render(<Counter />, document.getElementById('root'));
```

## Features

- **Reactive DOM elements**: A set of reactive DOM elements (button, div, span, etc).

- **Reactive wrapper**: A higher order component to wrap a React component to be a Reactive Component.

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

Take full control of component lifecycle.

```javascript
import {reactive} from 'react-reactive-class';

class Text extends React.Component {
  componentWillMount() {
    console.log('Text will mount.');
  }
  render() {
    console.log('Text rendered.');

    return (
      <div>{this.props.children}</div>
    );
  }
  componentWillUnmount() {
    console.log('Text will unmount.');
  }
}

const ReactiveText = reactive(Text);

// use
<ReactiveText>{ text$ }</ReactiveText>
```

### Mount/unmount Reactive Component

Reactively compose components.

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
