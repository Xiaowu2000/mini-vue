const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function createTextVnode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ShapeFlags.ELEMENT */
        : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot && typeof slot === "function") {
        return createVNode(Fragment, {}, slot(props));
    }
}

const extend = Object.assign;
const isObject = function (val) {
    return val !== null && typeof val === "object";
};
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
const hasChanged = function (oldVal, newVal) {
    return !Object.is(oldVal, newVal);
};
const camalize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
};
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
};

class ReactiveEffect {
    constructor(fn, scheduler) {
        this.scheduler = scheduler;
        this.deps = [];
        this.active = true;
        this._fn = fn;
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        activeEffect = this;
        shouldTrack = true;
        const res = this._fn();
        shouldTrack = false;
        return res;
    }
    stop() {
        if (this.active) {
            deleteEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function deleteEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
let activeEffect;
let shouldTrack;
let targetMap = new Map();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffect(dep);
}
function triggerEffect(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}
function track(target, key) {
    if (!isTracking())
        return;
    // target -> key -> dep
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffect(dep);
}
function trackEffect(dep) {
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn();
        return true;
    },
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isShallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        if (!isReadonly) {
            track(target, key);
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

function createActiveObject(raw, baseHandler) {
    return new Proxy(raw, baseHandler);
}
function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}

class RefImpl {
    constructor(value) {
        this.dep = new Set();
        this.__v_isRef = true;
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
function isRef(ref) {
    return !!ref.__v_isRef;
}
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function ref(value) {
    return new RefImpl(value);
}
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value);
            }
            else {
                return Reflect.set(target, key, value);
            }
        },
    });
}

function emit(instance, event, ...args) {
    console.log("emit", event);
    const { props } = instance;
    const handlerName = toHandlerKey(camalize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initSlots(instance, children) {
    normalizeObjectSlots(children, instance.slots);
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSlotsValue(value(props));
    }
}
function normalizeSlotsValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: [],
        isMounted: false,
        provides: parent ? parent.provides : {},
        parent,
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    //TODO
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    //这个component就是App.js里的对象
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    const { setup } = component;
    if (setup) {
        //setup  可以返回function或者Object
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}
function handleSetupResult(instance, setupResult) {
    //TODO setup return function 情况
    if (typeof setupResult === "object") {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}
let currentInstance;
function getCurrentInstance() {
    return currentInstance;
}

function provide(key, value) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        // let { provides } = currentInstance;
        // const parentProvides = currentInstance.parent.provides;
        // if (provides === parentProvides) {
        //   provides = currentInstance.provides = Object.create(parentProvides);
        // }
        const parentProvides = currentInstance.parent.provides;
        if (currentInstance.provides === parentProvides) {
            currentInstance.provides = Object.create(parentProvides);
        }
        currentInstance.provides[key] = value;
    }
}
function inject(key) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        return parentProvides[key];
    }
}

function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 所有组件component 都 转为 虚拟节点 vnode
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            },
        };
    };
}

function createRenderer(options) {
    const { createElement, patchProp, insert } = options;
    function render(vnode, container) {
        patch(null, vnode, container, null);
    }
    function patch(n1, n2, container, parentComponent) {
        const { type } = n2;
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (isComponent(n2)) {
                    processComponent(n1, n2, container, parentComponent);
                }
                else if (isElement(n2)) {
                    processElement(n1, n2, container, parentComponent);
                    break;
                }
        }
    }
    function isComponent(vnode) {
        return vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */;
    }
    function isElement(vnode) {
        return vnode.shapeFlag & 1 /* ShapeFlags.ELEMENT */;
    }
    function processElement(n1, n2, container, parentComponent) {
        if (!n1) {
            mountElement(n2, container, parentComponent);
        }
        else {
            patchElement(n1, n2);
        }
    }
    function patchElement(n1, n2, container) {
        console.log("updateElement", n1, n2);
    }
    function mountElement(vnode, container, parentComponent) {
        const { children, props, shapeFlag } = vnode;
        const el = (vnode.el = createElement(vnode.type));
        for (const key in props) {
            const val = props[key];
            // const isOn = (key: string) => /^on[A-Z]/.test(key);
            // if (isOn(key)) {
            //   const event = key.slice(2).toLowerCase();
            //   document.addEventListener(event, val);
            // } else {
            //   el.setAttribute(key, val);
            // }
            patchProp(el, key, val);
        }
        if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
            mountChildren(children, el, parentComponent);
        }
        // container.append(el);
        insert(el, container);
    }
    function mountChildren(children, container, parentComponent) {
        children.forEach((v) => {
            patch(null, v, container, parentComponent);
        });
    }
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        //createComponentInstance 就是把Vnode里面的数据处理
        //vnode -> { {render(){...} , setup(){...} },props,children} 组件
        //vnode -> {'div',props,children} element
        //再用proxy代理，传给render去里面用this.去拿到
        const instance = createComponentInstance(initialVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, container);
    }
    function setupRenderEffect(instance, container) {
        // subTree 就是 instance对应的node节点的render return的Vnode
        // 目前来说每一个组件必有一个render且至少返回一个div
        // subTree 被 patch 后 ,必然把渲染div的真实element挂在subTree的el下
        // 这个div就是当前Instance对应的root Element
        effect(() => {
            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                patch(null, subTree, container, instance);
                instance.subTree = subTree;
                instance.vnode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                const { proxy } = instance;
                const oldTree = instance.subTree;
                const subTree = instance.render.call(proxy);
                patch(oldTree, subTree, container, instance);
                instance.subTree = subTree;
                instance.vnode.el = subTree.el;
            }
        });
    }
    function processFragment(n1, n2, container, parentComponent) {
        mountChildren(n2.children, container, parentComponent);
    }
    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    return {
        createApp: createAppApi(render),
    };
}

const render = createRenderer({ createElement, patchProp, insert });
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, val) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        document.addEventListener(event, val);
    }
    else {
        el.setAttribute(key, val);
    }
}
function insert(el, container) {
    container.append(el);
}
function createApp(...args) {
    return render.createApp(...args);
}

export { createApp, createRenderer, createTextVnode, getCurrentInstance, h, inject, provide, proxyRefs, ref, renderSlots };
