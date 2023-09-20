import { h, provide, inject, ref, proxyRefs } from "../../lib/mini-vue.esm.js";

export const App = {
  name: "App",
  render() {
    return h("div", {}, [
      h("div", {}, "Count: " + this.count),
      h("button", { onClick: this.onClick }, "click"),
    ]);
  },

  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };
    return {
      count,
      onClick,
    };
  },
};
