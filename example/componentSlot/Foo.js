import { h, renderSlots } from "../../lib/mini-vue.esm.js";
export const Foo = {
  render() {
    const foo = h("div", {}, "foo");
    const age = 18;
    console.log(renderSlots(this.$slots, "header", { age }));
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },

  setup(props, { emit }) {},
};
