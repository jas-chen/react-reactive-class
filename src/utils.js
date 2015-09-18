export function isRxObservable(o) {
  const valid = (
    typeof o === 'object'
      && typeof o.subscribeOnNext === 'function'
  );

  return valid;
}

export function pickProps(props) {
  const picked = {};
  for (var key in props) {
    const value = props[key];
    if (!isRxObservable(value)) {
      picked[key] = value;
    }
  }

  return picked;
}
