(function (window, document) {

  window.$jsonp = function (url, data, cb) {
    let dataString = url.indexOf("?") === -1 ? "?" : "&";
    for (key in data) {
      dataString += "" + item + "=" + data[key] + "&";
    }
    let cbName = "my_callback" + Math.random().toString(16).replace(".", "");
    dataString += "callback=" + cbName;

    let script = document.createElement("script");
    script.src = url + dataString;

    window[cbName] = function (data) {
      cb(data);
      document.body.removeChild(script);
    };

    document.body.appendChild(script);

  };
})(window, document);
