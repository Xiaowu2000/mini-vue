import { camalize, toHandlerKey } from "../shared";

export function emit(instance, event, ...params) {
  console.log("emit", event);

  const { props } = instance;

  const handlerName = toHandlerKey(camalize(event));
  const handler = props[handlerName];
  handler && handler(...params);
}
