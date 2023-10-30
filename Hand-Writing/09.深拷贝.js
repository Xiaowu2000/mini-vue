// 1. json.stringfiy 和 parse
// let a = {
//     name: 'ss',
// }
// let b = JSON.parse(JSON.stringify(a));
// 缺点：

// 如果obj里面有时间对象，转换过后，时间将只是字符串的形式
// 如果obj有RegExp, Error 对象，则序列化的结果将只得到空对象
// 如果obj里面有函数,undefined,序列化后的结果会把函数或undefined丢失
// 如果obj里有NaN，Infinity 和 -Infinity，则序列化的结果会变成null
// JSON.stringify() 只能序列化对象的可枚举的自由属性，例如 如果obj中的对象是由构造函数生成的，则使用JSON.parse(JSON.stringify),则会丢弃对象的constructor
// 如果对象中存在循环引用的情况也无法正确实现深拷贝

// 2. 手写递归深拷贝

function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

function deepClone(target) {
  if (!isObject(target)) return target;

  let cache = null;
  if (!deepClone.cache) {
    deepClone.cache = new WeakMap();
  }
  cache = deepClone.cache;
  if (cache.has(target)) {
    return cache.get(target);
  }

  if (target instanceof Set) {
    let tmp = new Set();
    cache.set(target, tmp);
    target.forEach((key) => tmp.add(deepClone(key)));
    return tmp;
  } else if (target instanceof Map) {
    let tmp = new Map();
    cache.set(target, tmp);
    target.forEach((key) => tmp.set(key, deepClone(target[key])));
    return tmp;
  } else if (target instanceof Date) return new Date(target);
  else if (target instanceof RegExp) return new RegExp(target);
  else {
    const tmp = new target.constructor();
    cache.set(target, tmp);
    for (const key in object) {
      tmp[ket] = deepClone(target[key]);
    }
    return tmp;
  }
}
