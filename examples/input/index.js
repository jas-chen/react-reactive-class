import React from 'react';
import ReactDOM from 'react-dom';
import {dom, reactive} from 'react-reactive-class';
import Rx from 'rx';

const {div:Div, input:Input} = dom;

function textInput(initText) {
  const change$ = new Rx.Subject();
  const text$ = change$.map(e => e.target.value).startWith(initText || '');
  const element = () => (
    <Input value={text$} onChange={change$.onNext.bind(change$)} />
  );

  return {element, text$}
}

function button(type) {
  const clickEv$ = new Rx.Subject();
  const element = () => (
    <button onClick={clickEv$.onNext.bind(clickEv$)}>{type}</button>
  );

  return {element, clickEv$}
}

@reactive
class StrongText extends React.Component {
  render() {
    console.log('Text rendered.');

    return (
      <strong>{this.props.text}</strong>
    );
  }
}

function App(props) {
  console.log('App rendered.');

  const {
    element:TextInput,
    text$
  } = textInput(props.text);

  const {
    element:MountButton,
    clickEv$:clickMountButton$
  } = button('mount');

  const {
    element:UnmountButton,
    clickEv$:clickUnmountButton$
  } = button('unmount');

  const mount$ = Rx.Observable.merge(
    clickMountButton$.map(() => true),
    clickUnmountButton$.map(() => false)
  );

  return (
    <div>
      <TextInput />
      <Div>{text$.map(text => text.toUpperCase())}</Div>
      <MountButton />
      <UnmountButton />
      <Div id="id5566" mount={mount$}>Hello</Div>
      <StrongText mount={mount$} text={text$}/>
    </div>
  );
}

ReactDOM.render(App({text:'type something'}), document.getElementById('app'));
