//
// string utilities (example)
//
R("string", [], function () {

  return {
    repeat: function (s, t) {
      return new Array(t + 1).join(s);
    },
    trim: function (s) {
      return s ? s.replace(/^\s+|\s+$/g, "") : s;
    }
  };

});