import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 所有组件component 都 转为 虚拟节点 vnode
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    },
  };
}
