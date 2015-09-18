export function isRxObservable(o) {
  const valid = (
    typeof o === 'object'
      && typeof o.subscribeOnNext === 'function'
  );

  return valid;
}
