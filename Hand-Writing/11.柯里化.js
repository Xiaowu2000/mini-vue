function curry(fn) {
  return function tmp(...innerArgs) {
    if (innerArgs >= fn.length) {
      return fn(...innerArgs);
    } else {
      return (...args) => {
        tmp(...innerArgs, ...args);
      };
    }
  };
}
