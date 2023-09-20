import { reactive } from "./reactive";

describe("reactive", () => {
  it("happy path", () => {
    let a1 = reactive({ val: 1 });
    let b1 = a1.val;
    expect(b1).toBe(1);
    a1.val = 2;
    expect(a1.val).toBe(2);
    // expect(b1).toBe(2);
  });
});
