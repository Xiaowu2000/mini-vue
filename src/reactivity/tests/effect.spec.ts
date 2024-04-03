import { effect, stop } from "../effect";
import { reactive } from "../reactive";
describe("effect", () => {
  it("happy path ", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    // //update
    user.age++;
    expect(nextAge).toBe(12);

    // 4/3/2024 直接改变一个对象的属性，看看会不会触发effect 
    let a0value
    const a = reactive( [{ value: 1 }, { value: 2 }]);
    effect(() => {
      a0value = a[0].value;
    });
    expect(a0value).toBe(1);

    a[0]={}
    expect(a0value).toBe(undefined);
  });

  it("should return runner when call effect", () => {
    // 1. effect(fn) -> function  (runner) -> fn -> return
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);

    let r = runner();
    expect(r).toBe("foo");
    expect(foo).toBe(12);
  });

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3;
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
