import { isObject } from "../shared";
import { createAppApi } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
import { effect } from "../reactivity/effect";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;

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
        } else if (isElement(n2)) {
          processElement(n1, n2, container, parentComponent);
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

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    const el = (n2.el = n1.el);
    const oldProps = n1.props;
    const newProps = n2.props;

    patchProps(newProps, oldProps, hostPatchProp, el);
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const { children, props, shapeFlag } = vnode;
    const el = (vnode.el = hostCreateElement(vnode.type as string));

    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent);
    }

    // container.append(el);
    hostInsert(el, container);
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function processComponent(n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent);
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
      } else {
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
  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  return {
    createApp: createAppApi(render),
  };
}
function patchProps(newProps: any, oldProps: any, hostPatchProp: any, el: any) {
  
  for (const key in newProps) {
    const newProp = newProps[key];
    const oldProp = oldProps[key];
    if (newProp !== oldProp) {
      hostPatchProp(el, key, oldProp, newProp);
    }
  }

  for (const key in oldProps) {
    if (!(key in newProps)) {
      hostPatchProp(el, key, oldProps[key], null);
    }
  }
}
