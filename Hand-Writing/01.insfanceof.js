function myInstanceof(obj, target) {
  //需要判断obj为Object 或者 function(FUnction 也是 Obj)
  if (!(obj !== null && ["function", "object"].includes(typeof obj))) {
    return false;
  }

  while (obj) {
    if (obj.__proto__.constructor === target) {
      return true;
    }
    obj = obj.__proto__;
  }
  return false;
}

let a = [];
console.log(myInstanceof(1, Array));
console.log(myInstanceof(Function, Object));
