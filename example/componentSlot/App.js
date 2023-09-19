import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");
    // const foo = h(Foo, {}, h('p',{},"234"));
    const foo = h(
      Foo,
      {},
      { header: h("p", {}, "123"), footer: h("p", {}, "234") }
    );

    return h("div", {}, [app, foo]);
  },

  setup() {
    return {};
  },
};
