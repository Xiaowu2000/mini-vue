Function.prototype.myCall = function (ctx, ...args) {
  ctx = typeof window === "undefined" ? global : window;
  let key = Symbol("key");
  ctx[key] = this;
  let res = ctx[key](...args);
  delete ctx[key];
  return res;
};

Function.prototype.myBind = function (ctx, ...args) {
  const func = this;
  return function (...newArgs) {
    return func.call(ctx, ...args, ...newArgs);
  };
};
