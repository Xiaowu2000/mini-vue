import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    let a = reactive({ age: 1 });
    let b = computed(() => {
      return a.age;
    });
    expect(b.value).toBe(1);
  });

  it("should compute lazily", () => {
    const a = reactive({ age: 1 });
    const getter = jest.fn(() => {
      return a.age;
    });
    let b = computed(getter);
    expect(b.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    b.value //get
    expect(getter).toHaveBeenCalledTimes(1);

    a.age = 2
    expect(getter).toHaveBeenCalledTimes(1);
    expect(b.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

  });
});
