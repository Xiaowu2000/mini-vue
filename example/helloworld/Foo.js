import { h } from "../../lib/mini-vue.esm.js";

window.xxx = null;
export const Foo = {
  name: "Foo",
  setup(props) {
    window.xxx = this;
    console.log(props);
    props.count++;
  },
  render() {
    window.xxx = this;
    return h("div", {}, "foo: " + this.count);
  },
};
