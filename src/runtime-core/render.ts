import { isObject } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  //处理组件
  if (isComponent(vnode)) {
    processComponent(vnode, container);
  } else if (isElement(vnode)) {
    processElement(vnode, container);
  }
}

function isComponent(vnode) {
  return vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
}

function isElement(vnode) {
  return vnode.shapeFlag & ShapeFlags.ELEMENT;
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { children, props, shapeFlag } = vnode;
  const el = (vnode.el = document.createElement(vnode.type as string));

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el);
  }

  for (const key in props) {
    const val = props[key];
    const isOn = (key: string) => /^on[A-Z]/.test(key);

    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      document.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }

  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.forEach((v) => {
    patch(v, container);
  });
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container) {
  //createComponentInstance 就是把Vnode里面的数据处理
  //vnode -> { {render(){...} , setup(){...} },props,children} 组件
  //vnode -> {'div',props,children} element
  //再用proxy代理，传给render去里面用this.去拿到
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
    // subTree 就是 instance对应的node节点的render return的Vnode
    // 目前来说每一个组件必有一个render且至少返回一个div
    // subTree 被 patch 后 ,必然把渲染div的真实element挂在subTree的el下
    // 这个div就是当前Instance对应的root Element
  instance.vnode.el = subTree.el;
}
