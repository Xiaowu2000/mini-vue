let num = 12345.6789;
function formatNum(num) {
  let str = "" + num;
  let [int, dec] = str.split(".");
  return formatInt(int) + (dec ? "." + formatDec(dec) : "");
}

function formatInt(str) {
  let res = [];
  let cnt = str.length;
  while (cnt > 3) {
    res.unshift(str.slice(cnt - 3, cnt));
    cnt -= 3;
  }
  if (cnt !== 0) res.unshift(str.slice(0, cnt));
  return res.toString();
}

function formatDec(str) {
  let res = [];
  let len = str.length;
  let cnt = 0
  while (len - cnt > 3) {
    res.push(str.slice(cnt, cnt+3));
    cnt += 3;
  }
  if (len - cnt !== 0) res.push(str.slice(cnt, len));
  return res.toString();
}

console.log(formatNum(num));
