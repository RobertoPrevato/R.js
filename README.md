# R.js
Ultralight solution to dependencies management, freely inspired by RequireJs and Angular dependency injection mechanism; desiring to be simpler and framework-independent.

[Live demo](http://ugrose.com/content/demos/rjs/index.html)

## Features:
- Provides a way to organize the code in modules
- Makes scalability easy
- Supports asynchronous module definition
- Keeps synchronous what can stay synchronous
- Allows further minification and obfuscation of code, combined to the *robscure* grunt task

## Usage:
_R(key, dependencies, function);_
> to define an object with its dependencies

_R(key);_
> to require an object

_R([key1, key2, key3, ...])_
> to require an array of objects

## Notes:
Despite being inspired by RequireJs, R.js does not follow the AMD API specification: in R.js the same function _R_ is used both to _define_ and to _require_ the dependencies.

R.js follows a different philosophy and behaves similarly to Angular dependency mechanism: modules can be defined in random order, but the keys are chosen during development and JavaScript are normally loaded using script elements. While in Angular different functions are used to define modules (_controller_, _directive_, _factory_, _module_, _etc..._), in R.js the function _R_ is always used to define modules.

## Why is it easier to use?
1. R.js doesn't throw exception if a module is defined and its dependencies are not available: instead it waits until the dependencies will eventually become available
2. R.js doesn't inject script tags in your head: it cares just about the business logic and executing functions, that's it!
3. You can define as many modules as you desire in a single file: thanks to point 2., there is no connection between scripts location (src) and what they contain; this behavior differs from RequireJs and is similar to Angular mechanism, which allows to define multiple things in the same file:
```javascript
//example:
angular.module("some-module", [])
  .controller("ControllerOne", ["$scope", "$element", "$attrs", 
    function ($scope, $element, $attrs) { ... })

  .controller("ControllerTwo", ["$scope", "$element", "$attrs", 
    function ($scope, $element, $attrs) { ... })

  .directive("DirectiveOne", function () {
    return {
      controller: "ControllerOne",
      scope: true
    };
  });//etc.
```

## Examples:
- Hello World.
```javascript
//defines HelloWorld; its dependencies are: "Hello" and "World"; gets resolved when both "Hello" and "World" becomes defined.
R("HelloWorld", ["Hello", "World"], function (Hello, World) {
  return Hello + " " + World;
});

//defines Hello
R("Hello", [], function () {
  return "Hello";
});

//defines World
R("World", [], function () {
  return "World";
});
```
- Asynchronous definition.
```javascript
//defines "SomeModule", its dependency is "LateModule"; gets resolved when "LateModule" becomes defined
R("SomeModule", ["LateModule"], function (LateModule) {
  //this function is called when the "LateModule" becomes available
  //for example, this may happen when loading dynamically JavaScript with an AJAX call
  console.log("LateModule was resolved!");
  return "";
});

window.setTimeout(function () {
  //defines "LateModule" after 5 seconds
  R("LateModule", [], function () {  
    return "foo";
  });
}, 5e3);
```
- Functions to be called after some dependencies are ready
```javascript
+function () {
  var k;
  
  //"Q" doesn't return anything, but depends upon "Something", therefore its function is called after "Something" function.
  R("Q", ["Something"], function () {
    //gets fired after "Something" function
    console.log("@", k);
  });

  //defines "Something": its function does not return anything; but interacts with external variable "k"
  R("Something", [], function () {
    k = 30;
  });
}();
```

## Use the ♥
Normally after minification the keys of the modules would stay in clear, so:
```js
R("model", [], function () { ... });
R("dashboard"), ["model"], function () { ... });
```

Using **robscure** task is possible to further obfuscate the code organized using **R.js**, obtaining something like:
```js
R("♥", [], function () { ... });
R("♪"), ["♥"], function () { ... });
```
robscure task
[https://www.npmjs.com/package/robscure](https://www.npmjs.com/package/robscure)

## Why another implementation for dependency management?
I used RequireJs for a long time, and came to the conclusion that it makes things too complicated.
This is just my personal opinion and I don't want to discuss it in depth. After all: why _not to_ write something alternative?
AngularJs dependency injection is pleasant to use, but I prefer to keep my code framework-independent, as much as possible. If I write code in plain JavaScript and it can be used in any kind of application, I *don't want to* bind it to a specific framework.
The third option: i.e. defining a single global variable and extend it with different objects, works perfectly, but organizing code in modules in AMD-like fashion gives advantages, like:
- the possibility to load scripts without caring about the exact order
- the possibility to further obfuscate and minify the code, by minifying the module _keys_ representing functions and objects
