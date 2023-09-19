import { h, renderSlots } from "../../lib/mini-vue.esm.js";
export const Foo = {
  render() {
    const foo = h("div", {}, "foo");
    return h("div", {}, [
      renderSlots(this.$slots, "footer"),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },

  setup(props, { emit }) {},
};
