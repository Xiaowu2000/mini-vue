(function () {
  window.$jsonp = function (url, data, cb) {
    const fnName = "myCallBack";
    let script = document.createElement("script");
    script.src = url + "callback=" + fnName;

    window[fnName] = (data) => {
      cb(data);
      document.body.removeChild(script);
    };
    document.body.appendChild(script);
  };
})(document, window);
