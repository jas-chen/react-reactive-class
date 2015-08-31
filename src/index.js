import React from 'react';
import createReactiveClass from './createReactiveClass';

export function reactive() {
  // config via decorator
  if (typeof arguments[0] === 'string') {
    return (target) => createReactiveClass(target, ...arguments);
  }

  return createReactiveClass(...arguments);
}

export const dom = Object.keys(React.DOM).reduce((result, tag) => {
  result[tag] = createReactiveClass(tag);
  return result;
}, {});
