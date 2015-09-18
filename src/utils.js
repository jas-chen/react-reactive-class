export function isRxObservable(o) {
  const valid = (
    typeof o === 'object'
      && typeof o.subscribeOnNext === 'function'
  );

  return valid;
}

export function pickProps(props) {
  const picked = {};
  for (const key in props) { // eslint-disable-line guard-for-in
    const value = props[key];
    if (!isRxObservable(value)) {
      picked[key] = value;
    }
  }

  return picked;
}

export function calculateMount(type, currentMount) {
  switch (type) {
  case 'mount':
    return true;
  case 'unmount':
    return false;
  case 'toggle':
    return !currentMount;
  default:
    return undefined;
  }
}
