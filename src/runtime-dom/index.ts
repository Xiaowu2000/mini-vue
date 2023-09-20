import { createRenderer } from "../runtime-core";

const render: any = createRenderer({ createElement, patchProp: patchProps, insert });

function createElement(type) {
  return document.createElement(type);
}

function patchProps(el, key, oldProp, newProp) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, newProp);
  } else {
    if (newProp === null || newProp === undefined) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, newProp);
    }
  }
}

function insert(el, container) {
  container.append(el);
}

export function createApp(...args) {
  return render.createApp(...args);
}

export * from "../runtime-core";
