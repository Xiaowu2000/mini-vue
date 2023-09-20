import { h, provide, inject, ref, proxyRefs } from "../../lib/mini-vue.esm.js";

export const App = {
  name: "App",
  render() {
    return h("div", { ...this.props }, [
      h("div", { ...this.props }, "Count: " + this.count),
      h("button", { onClick: this.onClick }, "click"),
      h("button", { onClick: this.onUpdateProps }, "改变props"),
      h("button", { onClick: this.onDeleteProps2 }, "删除props"),
      h("button", { onClick: this.onDeleteProps }, "undefine删除props"),
    ]);
  },

  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };
    const props = ref({
      foo: "foo",
      bar: "bar",
    });

        function onUpdateProps() {
      props.value.foo = "new-foo";
    }
    function onDeleteProps2() {
      props.value = {
        foo: "foo",
      };
      // props.value.delete('bar')
    }
    function onDeleteProps() {
      props.value.bar = null;
    }

    return {
      props,
      count,
      onClick,
      onUpdateProps,
      onDeleteProps2,
      onDeleteProps,
    };
  },
};


