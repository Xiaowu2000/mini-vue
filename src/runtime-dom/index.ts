import { createRenderer } from "../runtime-core";

const render: any = createRenderer({ createElement, patchProp, insert });

function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, key, val) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    document.addEventListener(event, val);
  } else {
    el.setAttribute(key, val);
  }
}
function insert(el, container) {
  container.append(el);
}

export function createApp(...args) {
  return render.createApp(...args);
}

export * from "../runtime-core";