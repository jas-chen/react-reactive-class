export function isEventEmitter(o) {
  const valid = (
    typeof o === 'object'
      && typeof o.on === 'function'
      && typeof o.removeListener === 'function'
  );

  return valid;
}

export function isRxObservable(o) {
  const valid = (
    typeof o === 'object'
      && typeof o.subscribeOnNext === 'function'
  );

  return valid;
}
