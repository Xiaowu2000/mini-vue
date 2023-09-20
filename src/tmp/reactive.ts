// let a = { val: 1 };
// let b = a.val;
// console.log(b); //1
// a.val++;
// console.log(b); //1

class ReactiveEffect {
  constructor() {}
}
const depsMap = {};
export function reactive(val) {
  return new Proxy(val, {
    get(target, key) {
      //收集依赖
      let deps = depsMap[target];
      if (!deps) {
        deps = new Map();
        depsMap[target] = deps;
      }
      let dep = deps[key];
      if (!dep) {
        dep = new Set();
        deps[key] = dep;
      }
      
      return Reflect.get(target, key);
    },
    set(target, key, val) {
      console.log("set");
      //调用依赖
      return Reflect.set(target, key, val);
    },
  });
}
