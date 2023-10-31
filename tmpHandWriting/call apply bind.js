Function.prototype.myCall = function (ctx, ...params) {
  if (ctx == null) {
    ctx = typeof window !== "undefined" ? window : global;
  }

  const key = Symbol("key");
  ctx[key] = this;
  const res = ctx[key](...params);
  delete ctx[key];
  return res;
};

Function.prototype.myBind = function (ctx, ...params) {
  const fn = this;
  return function (...newParams) {
    return fn.call(ctx, ...params, ...newParams);
  };
};
