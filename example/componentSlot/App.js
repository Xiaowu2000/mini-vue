import { h, createTextVnode } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    //<div>App</div>
    //<div>
    //<p>header18</p>
    //<div>foo</div>
    //<p>footer</p>
    //</div>

    const app = h("div", {}, "App");
    // const foo = h(Foo, {}, h('p',{},"234"));
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h("p", {}, "header" + age),
          createTextVnode("你好呀"),
        ],
        footer: () => h("p", {}, "footer"),
      }
    );
      console.log(createTextVnode('te'))
    return h("div", {}, [app, foo]);
  },

  setup() {
    return {};
  },
};
