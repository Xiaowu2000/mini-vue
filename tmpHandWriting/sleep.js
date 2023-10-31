function sleep(fn, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let res = fn();
      resolve(res);
    }, delay);
  });
}
