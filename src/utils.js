export function isRxObservable(o) {
  const valid = (
    typeof o === 'object'
      && typeof o.subscribeOnNext === 'function'
  );

  return valid;
}

export function pickProps(props, validator) {
  const picked = {};

  Object.keys(props).forEach(key => {
    const value = props[key];
    if (validator(key, value)) {
      picked[key] = value;
    }
  });

  return picked;
}
