import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { ReactiveFlags, isReactive, reactive, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
export const mutableHandlers = {
  get,
  set,
};
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn();
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);
    if (isShallow) {
      return res;
    }



    if (!isReadonly) {
      track(target, key);
    }
    // 如果是对象，递归代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}

function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);

    trigger(target, key);
    return res;
  };
}
