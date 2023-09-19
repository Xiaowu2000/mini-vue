import { h, provide, inject } from "../../lib/mini-vue.esm.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", 1);
    provide("bar", 10);
  },
  render() {
    return h("div", {}, [h("p", {}, "provider"), h(Provider2)]);
  },
};
const Provider2 = {
  name: "Provider",
  setup() {
    provide("foo", 2);
    const foo = inject("foo");
    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, "provider" + "foo: " + this.foo),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    return {
      foo,
      bar,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, "Consumer: " + this.foo + " - " + this.bar),
    ]);
  },
};

export const App = {
  name: "App",
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      [h(Provider)]
      // [h("p", { class: "blue" }, "hi"),h("p", { class: "blue" }, "hsi")],
    );
  },

  setup() {
    return {
      msg: "mini-vue111",
    };
  },
};
