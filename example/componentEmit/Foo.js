import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  render() {
    const btn = h("button", { onClick: this.emitAdd }, "emitAdd");
    const foo = h("p", {}, "foo");
    return h("div", {}, [foo, btn]);
  },

  setup(props, { emit }) {
    const emitAdd = () => {
      emit("add", 1, 2);
      emit("add-foo", 1, 2);
    };

    return { emitAdd };
  },
};
