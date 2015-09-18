export function isRxObservable(o) {
  const valid = (
    typeof o === 'object'
      && typeof o.subscribeOnNext === 'function'
  );

  return valid;
}

export function containUpperCase(str) {
  for (var i = 0, len = str.length; i < len; i++) {
    var letter = str.charAt(i);
    var keyCode = letter.charCodeAt(i);
    if (keyCode >= 65 && keyCode <= 90) {
        return true;
    }
  }

  return false;
}

export function pickProps(props) {
  const picked = {};
  for (var key in props) {
    const value = props[key];
    if (isRxObservable(value)) {
      picked[key] = undefined;
    }
    else {
      picked[key] = value;
    }
  }

  return picked;
}
