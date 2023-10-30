function _new(func, ...args) {
  if (typeof func !== "function") return null;

  let res = Object.create(func.prototype);
  // let res = {}
  // res.__proto__ = func.prototype

  let result = func.call(res, ...args);

  if (
    (result !== null && typeof result === "object") ||
    typeof result === "function"
  ) {
    return result;
  }

  return res;
}
