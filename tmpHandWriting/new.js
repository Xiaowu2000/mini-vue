function myNew(func,...args) {
  const res = Object.create(func.prototype);

  const result = func.call(res,...args);

  if (["object", "function"].includes(typeof result)) {
    return result;
  }
  return res;
}
