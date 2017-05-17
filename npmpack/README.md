# R.js
Ultralight solution for dependency injection, simple and framework independent.

[Live demo](https://robertoprevato.github.io/demos/rjs/index.html)

```bash
npm install rodi
```

## Features:
- Provides a way to organize the code in modules
- Makes lazy loading and scalability easy, thanks to its trustful behavior _(see details below)_
- Allows to define modules that work seamlessly within [NodeJs](https://nodejs.org/) and inside the browsers
- Supports asynchronous module definition
- Keeps synchronous what can stay synchronous

**Recommended**: see the [live demo](https://robertoprevato.github.io/demos/rjs/index.html), click on the yellow button and observe in browser console, to see an example of lazily loaded application area. 

![Example](https://robertoprevato.github.io/demos/rjs/images/browser-console-network.png)

## Usage:
_R(key, dependencies, function);_
> to define an object with its dependencies

_R(key);_
> to require an object

_R([key1, key2, key3, ...])_
> to require an array of objects

## Why is it easy to use?
1. R.js doesn't throw exception if a module is defined and its dependencies are not available: instead it waits until the dependencies will _eventually_ become available
2. R.js only cares about the business logic and executing functions (no loading of JavaScript)
3. You can define as many modules as you desire in a single file: thanks to point 2., there is no connection between scripts location (src) and what they contain.

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

## How to debug
Since R.js is trustful and doesn't throw exception if a dependency is not resolved; it may happen that your code never gets executed because a key was misspelt. To understand which modules are not resolved and are waiting, you may call the method "queue", which returns the queue of modules waiting for definitions.
```js
//call the queue function to see which modules are waiting for definitions of other modules
R.queue();
```
Another option is to set a "debug" property inside the R object to a truthy value. This way, R.js logs into console those dependencies that cannot be resolved immediately.
```js
//NB: after r.js has been loaded (e.g. after the script element loading r.js)
//activate R.debug, so it logs the dependencies that cannot be resolved immediately
R.debug = true;
```
