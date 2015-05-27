/*!
 * R.js, ultra-light solution to dependencies management.
 * https://github.com/RobertoPrevato/R.js
 *
 * Copyright 2015, Roberto Prevato
 * http://ugrose.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function () {

  var bag = {}, queue = {};

  function indexOf(arr, val) {
    var p = "indexOf";
    if (arr[p]) return arr[p](val);
    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i] === val) return i;
    }
    return -1;
  }

  function onDefined(key, val) {
    var x, resolved = [];
    for (x in queue) {
      //x is a key
      var def = queue[x];
      if (def.resolved) continue;
      var waitingfor = def[0], ix = indexOf(waitingfor, key);
      if (ix != -1)
        //remove key from waiting for
        waitingfor.splice(ix, 1);

      if (!waitingfor.length) {
        queue[x].resolved = true;
        resolved.push(x);
        R(x, def[1], def[2]);
      }
    }
    //clean queue
    for (var i = 0, l = resolved.length; i < l; i++)
      delete queue[resolved[i]];
  }

  R = function (key, deps, fn) {
    var len = "length", al = arguments[len];
    if (al === 0) return R;
    if (al === 1) {
      //get
      var keys = arguments[0];
      if (typeof keys === "string") {
        if (al === 1) return bag[keys];
        var a = [];
        for (var i = 0, l = al; i < l; i++) {
          a.push(arguments[i]);
        }
        return R(a);
      }
      //multiple get
      var d = [];
      for (var i = 0, l = keys[len]; i < l; i++)
        d.push(bag[keys[i]]);
      return d;
    }

    if (al === 2)
      //set
      return bag[key] = deps;

    //define
    //key is a key; deps is an array of dependencies keys; fn is the callback function that returns the object
    var d = R(deps), waitingfor = [];
    if (!d) return null;
    for (var i = 0, l = d[len]; i < l; i++)
      if (d[i] === undefined)
        waitingfor.push(deps[i]);

    if (waitingfor[len]) {
      queue[key] = [waitingfor, deps, fn];
      return null;
    }
    var call = "call", w = window, result;
    switch (d[len]) {
      case 0:
        result = fn[call](w);
        break;
      case 1:
        result = fn[call](w, d[0]);
        break;
      case 2:
        result = fn[call](w, d[0], d[1]);
        break;
      case 3:
        result = fn[call](w, d[0], d[1], d[2]);
        break;
      case 4:
        result = fn[call](w, d[0], d[1], d[2], d[3]);
        break;
      case 5:
        result = fn[call](w, d[0], d[1], d[2], d[3], d[4]);
        break;
      default:
        result = fn.apply(w, d);
        break;
    }
    if (result === undefined) result = "";
    bag[key] = result;
    //notify definition
    onDefined(key, result);
    return result;
  };
})();