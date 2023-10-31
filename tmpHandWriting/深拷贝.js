function deepClone(target) {
  if (target == null || typeof obj !== "object") return target;

  let cache = null;
  if (!deepClone.cache) {
    deepClone.cache = new WeakMap();
  }
  cache = deepClone.cache;

  if (cache.has[target]) {
    return cache.get[target];
  }

  if (target instanceof Map) {
    const res = new Map();
    target.forEach((it, key) => {
      res.set(key, deepClone(it));
    });
    cache.set(target, res);
    return res;
  } else if (target instanceof Set) {
    const res = new Set();
    target.forEach((it) => {
      target.add(deepClone(it));
    });
    cache.set(target, res);
    return res;
  } else if (target instanceof Date) {
    return new Date(target);
  } else if (target instanceof RegExp) {
    return new Regexp(target);
  } else {
    const ctor = target.constructor;
    const res = new ctor();
    target.forEach((it, i) => {
      res[i] = it;
    });
    cache.set(target, res);
    return res;
  }
}
