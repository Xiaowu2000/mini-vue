import { getCurrentInstance, h } from "../../lib/mini-vue.esm.js";
import {Foo} from './Foo.js';

window.self = null;

export const App = {
  name:"App", 
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick(){
          console.log('click')
        },
        onMousedown(){
          console.log('mouseDown')
        }
      },
      [h("p",{},"hi, " + this.msg),h(Foo,{count:1 })]
      // [h("p", { class: "blue" }, "hi"),h("p", { class: "blue" }, "hsi")],
    );
  },

  setup() {
    console.log('app',getCurrentInstance())
    return {
      msg: "mini-vue111",
    };
  },
};
