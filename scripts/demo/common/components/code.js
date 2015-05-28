R("code", [], function () {

  var scriptSplitter = /<script([^>]*)>([\s\S]*)<\/script>/,
    srcSplitter = /src=['"]([^"']+)['"]/;

  return {

    inject: function (code) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      if (typeof code == "function") code = ";(" + code.toString() + ")();";
      try {
        s.appendChild(document.createTextNode(code));
        document.body.appendChild(s);
      } catch (e) {
        s.text = code;
        document.body.appendChild(s);
      }
    },

    fromHtml: function (html) {
      var scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>/g);
      if (!scripts) return html;

      var head = document.getElementsByTagName("head")[0];

      for (var i = 0, l = scripts.length; i < l; i++) {
        var s = scripts[i], parts = s.match(scriptSplitter),
          scriptElement = document.createElement("script");
        scriptElement.setAttribute('type', 'text/javascript');

        if (s.indexOf("src") > -1)
          //has external script
          scriptElement.setAttribute("src", parts[1].match(srcSplitter)[1]);
        else
          //has internal code
          scriptElement.innerText = parts[2];

        head.appendChild(scriptElement);
        head.removeChild(scriptElement);
      }
    }
  };

});