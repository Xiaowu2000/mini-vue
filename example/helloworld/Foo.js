import { getCurrentInstance, h } from "../../lib/mini-vue.esm.js";

window.xxx = null;
export const Foo = {
  name: "Foo",
  setup(props) {
    console.log("foo", getCurrentInstance());

    window.xxx = this;
    console.log(props);
    props.count++;
  },
  render() {

    window.xxx = this;
    return h("div", {}, "foo: " + this.count);
  },
};
