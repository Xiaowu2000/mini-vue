import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode: any, parent) {

  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: [],
    provides: parent ? parent.provides : {},
    parent,
    emit: () => {},
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  //TODO
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
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
function setCurrentInstance(instance: any) {
  currentInstance = instance;
}

function handleSetupResult(instance, setupResult: any) {
  //TODO setup return function 情况
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
let currentInstance;
export function getCurrentInstance() {
  return currentInstance;
}
