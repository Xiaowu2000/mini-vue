export const extend = Object.assign;

export const isObject = function (val) {
  return val !== null && typeof val === "object";
};
export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

export const hasChanged = function (oldVal, newVal) {
  return !Object.is(oldVal, newVal);
};

export const camalize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
