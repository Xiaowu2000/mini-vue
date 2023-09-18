import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      [
        h("div", {}, "App"),
        h(
          Foo,
          {
            onAdd(a, b) {
              console.log("onAdd", a, b);
            },
            onAddFoo(a, b) {
              console.log("onAddFOO", a, b);
            },
          },
          "hah"
        ),
      ]
      // [h("p", { class: "blue" }, "hi"),h("p", { class: "blue" }, "hsi")],
    );
  },

  setup() {
    return {
      msg: "mini-vue111",
    };
  },
};
