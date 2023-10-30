class eventBus {
  constructor() {
    this._eventBus = {};
  }
  on(name, cb, isOnce = false) {
    if (!this._eventBus[name]) {
      this._eventBus[name] = [];
    }
    this._eventBus[name].push({ cb, isOnce });
  }

  once(name, cb) {
    this.on(name, cb, true);
  }

  off(name, cb) {
    if (!cb) {
      this._eventBus[name] = [];
    } else {
      if (this._eventBus[name]) {
        this._eventBus[name] = this._eventBus[name].filter((x) => x.fn !== fn);
      }
    }
  }

  emit(name, ...args) {
    if (!this._eventBus[name]) return;
    this._eventBus[name].filter((obj) => {
      const { cb, isOnce } = obj;
      cb(...args);
      return isOnce ? false : true;
    });
  }
}
