function sleep(fn, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}
