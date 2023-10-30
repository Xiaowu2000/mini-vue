// Promise.prototype.myfinally = function (callback) {
//     return this.then(
//       async (res) => {
//         await callback();
//         return res; //finally本质起传递的作用,这里的res是上一个then函数的返回值
//       },
//       async (err) => {
//         await callback();
//         throw err;
//       }
//     );
//   };

function runAsyncTask(cb) {
  queueMicrotask(cb);
}

class myPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  #handler = [];

  constructor(executor) {
    this.status = myPromise.PENDING;
    this.result = undefined;

    const resolve = (result) => {
      if (this.status !== myPromise.PENDING) return;
      this.status = myPromise.FULFILLED;
      this.result = result;

      this.#handler.forEach(({ onResolved }) => {
        onResolved(result);
      });
    };

    const reject = (result) => {
      if (this.status !== myPromise.PENDING) return;
      this.status = myPromise.REJECTED;
      this.result = result;

      this.#handler.forEach(({ onRejected }) => {
        onRejected(result);
      });
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onResolved, onRejected) {
    if (typeof onResolved !== "function") {
      onResolved = (x) => x;
    }
    if (typeof onRejected !== "function") {
      onRejected = (x) => {
        throw x;
      };
    }

    let p2 = new Promise((resolve, reject) => {
      if (this.status === myPromise.FULFILLED) {
        queueMicrotask(() => {
          try {
            let res = onResolved(this.result);
            processRes(res, p2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === myPromise.REJECTED) {
        queueMicrotask(() => {
          try {
            let res = onRejected(this.result);
            processRes(res, p2, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === myPromise.PENDING) {
        this.#handler.push({
          onResolved: () =>
            queueMicrotask(() => {
              try {
                let res = onResolved(this.result);
                processRes(res, p2, resolve, reject);
              } catch (err) {
                reject(err);
              }
            }),
          onRejected: () =>
            queueMicrotask(() => {
              try {
                let res = onRejected(this.result);
                processRes(res, p2, resolve, reject);
              } catch (err) {
                reject(err);
              }
            }),
        });
      }
    });
    return p2;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(onFinally, onFinally);
  }
}

function processRes(res, p2, resolve, reject) {
  if (res === p2) {
    throw "循环引用";
  }
  if (res instanceof myPromise) {
    res.then(
      (result) => {
        resolve(result);
      },
      (result) => {
        reject(result);
      }
    );
  }
  resolve(res);
}

console.log("start");

let p = new myPromise((resolve, reject) => {
  // setTimeout(() => {
  // resolve(1);
  throw "NEED TO CATCH";
  // reject("cuo");
  // }, 100);
});

p.then(() => {}).catch((err) => {
  console.log("i'm Catch: ", err);
});

// let p2 = p.then(
//   (x) => {
//     // return p2;
//     // console.log("result1: ", x);
//     throw ".then: cuo";
//     // return new Promise((resolve, reject) => {
//     //   resolve(2);
//     // });
//   },
//   (err) => {
//     console.log("err1: ", err);
//     return new Promise((resolve, reject) => {
//       resolve(2);
//     });
//     // throw "new cuo";
//   }
// );

// p2.then(
//   (result) => {
//     console.log("p2.then: ", result);
//   },
//   (err) => {
//     console.log("捕捉: ", err);
//   }
// );

// p.then(
//   (x) => {
//     console.log("result2: ", x);
//   },
//   (err) => {
//     console.log("err2: ", err);
//   }
// );

console.log("end");
