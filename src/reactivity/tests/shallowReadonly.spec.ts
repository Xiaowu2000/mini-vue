import { isReactive, isReadonly, reactive, readonly, shallowReadonly } from "../reactive";
describe("shalowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const original = { foo: { bar: 10 } };
    const obj = shallowReadonly(original);
    expect(isReadonly(obj)).toBe(true);
    expect(isReadonly(obj.foo)).toBe(false);
  });
});
