import { hasChanged, isObject } from "../shared";
import { isTracking, track, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _rawValue: any;
  private _value: any;
  private dep = new Set();
  private __v_isRef = true;
  constructor(value) {
    convert(value, this);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      convert(newValue, this);
      triggerEffect(this.dep);
    }
  }
}

function convert(newValue, ref) {
  ref._rawValue = newValue;
  ref._value = isObject(newValue) ? reactive(newValue) : newValue;
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function ref(value) {
  return new RefImpl(value);
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[ key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
