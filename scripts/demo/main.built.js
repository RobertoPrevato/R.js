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
//
// extend function taken from Backbone
//
R("extend", [], function () {
  
  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  return function (protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };
});
//
// events function taken from Backbone
//
R("events", [], function () {
  
  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, X.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // X events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = { listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });
  
  return Events;
});
R("progress",[],function(){return function(a){function b(){v.clearRect(0,0,r.width,r.height),v.save(),v[d](),v[e]="#f8f8f8",v[f]="#aeaeae",v[g]=1,v[h](s,t,u,0,2*c,!1),v[i](),v[j](),v[k](),v[d](),v[h](s,t,u,0,2*c,!1),v[l](),v[d](),v[f]="black",v[g]=5,v[m]=20,v[n]="rgba(0,0,0,.9)",v[o]=0,v[p]=0,v[h](s,t,u+3,0,2*c,!1),v[k](),v[q](),v[d](),v[f]="#aeaeae",v[e]="#fff",v[h](s,t,55,0,2*c,!1),v[i](),v[j](),v[d](),v[f]="#aeaeae",v[g]=1,v[m]=20,v[n]="rgba(0,0,0,.9)",v[o]=0,v[p]=0,v[h](s,t,55,0,2*c,!1),v[k](),v[n]="transparent",v[q](),B+=z,v[d](),v[g]=15,v[h](s,t,65,c*A,c*B,!1),v[f]="red",v[k](),v[i](),v[q](),B>A+2.15&&(window.clearInterval(E),a&&a()),D++,D%x==0&&(D=0,C--),v[d](),v[e]="#004683",v.font="80px Verdana",v.textAlign="center",v.fillText(C?C.toString():"!",s,t+30),v[i]()}var c=Math.PI,d="beginPath",e="fillStyle",f="strokeStyle",g="lineWidth",h="arc",i="closePath",j="fill",k="stroke",l="clip",m="shadowBlur",n="shadowColor",o="shadowOffsetX",p="shadowOffsetY",q="restore",r=document.getElementById("canvas"),s=100,t=85,u=75,v=r.getContext("2d"),w=2,x=30,y=3,z=w/(x*y),A=new Date,A=1.5,B=A,C=y,D=0,E=window.setInterval(b,1e3/x)}});
//
// Base model for Knockout applications
//
R("model", ["extend", "events"], function (Extend, Events) {

  //
  // Base model definition
  //
  var Model = function (attrs, staticProperties) {
    if (staticProperties)
      _.extend(this, staticProperties);
    this.cid = _.uniqueId('c');
    this.disposables = [];
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    var p = "attrsFilter";
    if (this[p])
      attrs = this[p](attrs);
    this.set(attrs).initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    initialize: function () { },

    result: function (name, args) {
      //similar to _.result, but with arguments
      if (this[name])
        return _.isFunction(this[name]) ? this[name](args) : this[name];
      return null;
    },

    set: function (name, value) {
      //sets observable properties in this object
      //passing a plain object as first parameter, will set multiple properties and values
      //if this object already contains a function with the name, calls it passing the value (useful for observables)
      if (typeof name == 'object') {
        _.each(name, function (v, k) {
          this.set(k, v);
        }, this);
        return this;
      }
      _.isFunction(this[name]) ? this[name](value) : this[name] = ko.o(value);
      return this;
    }

  });

  Model.extend = Extend;
  
  return Model;
});

//
//defines the model for the dashboard page
//
R("models.dashboard", ["model", "code", "progress"], function (Model, Code, Progress) {

  return Model.extend({

    initialize: function () {

    },

    spademo: function () {
      $(".spa-demo .btn-warning").remove();
      $("#canvas").attr("width", "200").attr("height", "200");
      if (!R("example-area"))
        //simulate a delay, and dynamic load of a new view
        Progress(function () {
          //simulated call end: append HTML view to #partial
          var view = ko.templates['example-area'];//view would be a partial view from server side

          //$("#partial").html(view);//NB: jQuery internally would run the <script> elements inside the view; but this would require a running web server; so we use another implementation

          //load code from html:
          Code.fromHtml(view);
          document.getElementById("partial").innerHTML = view;
          $("#canvas").fadeOut("fast", function () {
            $("#partial").addClass("foo");
          });//remove canvas
        });

      //defines a function to run when the example area module is defined
      R("example-area-runner", ["example-area"], function (ExampleArea) {
        var message = "The module is now loaded!";
        console.log("%c" + message, "color:darkgreen;");
      });
    }

  });

});
//
//Knight generated templates file
//
"use strict";
if (!ko.templates) ko.templates = {};
(function (templates) {
	var o = {
		'dashboard': '<h2>scalability made easy!</h2> <h4>R.js makes easy to load scripts in blocks (as they become needed), and fire callbacks when dependencies are ready</h4> <p>all entities, except third party libraries, in this page are loaded in the <strong>wrong</strong> order (see the page source code and the script elements).<br />R.js executes the modules functions in the right order, to satisfy dependencies.</p> <h4>why is it easier?</h4> <ol> <li>R.js doesn\'t throw exception if a module is defined and its dependencies are not available: instead it waits until the dependencies will eventually become available</li> <li>R.js doesn\'t inject script tags in your head: it cares just about the business logic and executing functions, that\'s it!</li> <li>You can define as many modules as you desire in a single file: thanks to point 2., there is no connection between scripts location (src) and what they contain; this behavior differs from RequireJs and is similar to Angular mechanism, which allows to define multiple things in the same file.</li> </ol> <hr /> <h4>Live example</h4> <p>click the button below to simulate the dynamic loading of JavaScript for a new area, after a delay (like an AJAX call)</p> <div class="spa-demo"> <button class="btn btn-warning" data-bind="click: spademo">Click to load a new area (partial view)</button> <hr /> <canvas id="canvas" width="0" height="0"></canvas> <div id="partial"></div> <br class="break" /> </div> <h2>Features:</h2> <ol> <li>Supports asynchronous module definition</li> <li>Keeps synchronous what can stay synchronous</li> <li>Evaluates the function that defines an object, only when all dependencies are ready</li> <li>Includes grunt task to implement minify and obfuscate the module keys <a href="https://www.npmjs.com/package/robscure">robscure</a></li> </ol>',
		'example-area': '<div class="area-view"> <hr /> <h2>Example sub-view</h2> <p>this example demonstrates how to load and execute JavaScript only when they are actually needed (for scalability).</p> <p>you can see inside your browser tools, under the network section, how the script gets loaded; and in the browser console the message displayed only after this new script is evaluated.</p> <img src="images/browser-console-network.png" alt="browser network console" /> <script src="scripts/demo/example-area/example-area.js"></script> </div>'
	};
	var x;
	for (x in o) {
		templates[x] = o[x];
	}
})(ko.templates);
//
//  Demo app object
//
R("app", ["models.dashboard"], function (Dashboard) {
	console.log("%cApplying first binding!", "color:darkgreen;");
	var element = document.getElementById("content");

	//set template data-bind
	element.setAttribute("data-bind", "template: 'dashboard'");
	
	ko.applyBindings(new Dashboard(), element);
});