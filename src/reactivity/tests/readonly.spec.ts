import { isReactive, isReadonly, reactive, readonly } from "../reactive";
describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 10, bar: { val: 20 } };
    const observerd = readonly(original);
    expect(original).not.toBe(observerd);
    expect(observerd.foo).toBe(10);
    expect(isReadonly(observerd)).toBe(true);
    expect(isReadonly(observerd.bar)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  });

  it("warn when call readonly set", () => {
    const user = readonly({ foo: 10 });
    console.warn = jest.fn();
    user.foo = 11;
    expect(console.warn).toBeCalled();
  });
});
