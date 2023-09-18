import { h } from "../../lib/mini-vue.esm.js";

window.xxx = null;
export const Foo = {
  setup(props) {
    console.log(props);
    props.count++
  },
  render() {
    window.xxx = this;
    return h("div", {}, "foo: " + this.count);
  },
};
