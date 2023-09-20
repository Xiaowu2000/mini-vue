import { isObject } from "../shared";
import { createAppApi } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;

  function render(vnode, container) {
    patch(vnode, container, null);
  }

  function patch(vnode, container, parentComponent) {
    const { type } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (isComponent(vnode)) {
          processComponent(vnode, container, parentComponent);
        } else if (isElement(vnode)) {
          processElement(vnode, container, parentComponent);
          break;
        }
    }
  }

  function isComponent(vnode) {
    return vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
  }

  function isElement(vnode) {
    return vnode.shapeFlag & ShapeFlags.ELEMENT;
  }

  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const { children, props, shapeFlag } = vnode;
    const el = (vnode.el = createElement(vnode.type as string));

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

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent);
    }

    // container.append(el);
    insert(el, container);
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }

  function processComponent(vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent);
  }

  function mountComponent(initialVNode: any, container, parentComponent) {
    //createComponentInstance 就是把Vnode里面的数据处理
    //vnode -> { {render(){...} , setup(){...} },props,children} 组件
    //vnode -> {'div',props,children} element
    //再用proxy代理，传给render去里面用this.去拿到
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, container);
  }

  function setupRenderEffect(instance: any, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance);
    // subTree 就是 instance对应的node节点的render return的Vnode
    // 目前来说每一个组件必有一个render且至少返回一个div
    // subTree 被 patch 后 ,必然把渲染div的真实element挂在subTree的el下
    // 这个div就是当前Instance对应的root Element
    instance.vnode.el = subTree.el;
  }
  function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode.children, container, parentComponent);
  }
  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  return {
    createApp: createAppApi(render),
  };
}
