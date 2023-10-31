function myInstanceof(obj, target) {
  if (obj === null || !["object", "function"].includes(typeof obj)) {
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
console.log(myInstanceof(a, Array));
console.log(myInstanceof(Function, Object));
