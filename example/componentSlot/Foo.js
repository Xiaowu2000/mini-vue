import { h, renderSlots } from "../../lib/mini-vue.esm.js";
export const Foo = {
  render() {
    const foo = h("div", {}, "foo");
    return h("div", {}, [foo, renderSlots(this.$slots)]);
  },

  setup(props, { emit }) {},
};
