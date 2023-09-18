export const extend = Object.assign;

export const isObject = function (val) {
  return val !== null && typeof val === "object";
};
export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

export const hasChanged = function (oldVal, newVal) {
  return !Object.is(oldVal, newVal);
};
