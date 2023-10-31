function uniqueArr1(arr) {
  return arr.filter((x, index) => {
    return arr.indexOf(x) === index;
  });
}

function uniqueArr2(arr) {
  const tmp = new Set(arr);
  return Array.from(tmp);
}

function uniqueArr3(arr) {
  const tmp = new Set(arr);
  return [...tmp];
}

function uniqueArr4(arr) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    if (res.indexOf(arr[i]) === -1) {
      res.push(arr[i]);
    }
  }
  return res;
}
