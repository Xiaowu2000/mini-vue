class EventBus {
  constructor() {
    this._eventBus = {};
  }

  on(name, fn, once = false) {
    if (!this._eventBus[name]) {
      this._eventBus[name] = [];
    }
    this._eventBus.push({ fn, once });
  }

  once(name, fn) {
    this.on(name, fn, true);
  }

  off(name, fn) {
    if (fn) {
      const arr = this._eventBus[name];
      const index = arr.indexOf((it) => fn === it);
      delete arr[index];
    } else {
      delete this._eventBus[name];
    }
  }
  
  emit(name, ...args) {
    this._eventBus[name].filter(({ fn, isOnce }) => {
      fn(...args);
      return !isOnce;
    });
  }
}
