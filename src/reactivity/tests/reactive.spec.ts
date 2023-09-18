import {
  isReactive,
  isReadonly,
  reactive,
  readonly,
  isProxy,
} from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 10 };
    const observerd = reactive(original);
    expect(original).not.toBe(observerd);
    expect(observerd.foo).toBe(10);
    expect(isReactive(observerd)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(original)).toBe(false);
  });

  it("nested reactive", () => {
    const original = { foo: 10, bar: { val: 20 }, arr: [{ x1: 1 }] };
    const observerd = reactive(original);
    expect(isReactive(observerd.bar)).toBe(true);
    expect(isReactive(observerd.arr)).toBe(true);
    expect(isReactive(observerd.arr[0])).toBe(true);
  });
});
