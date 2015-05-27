# R.js
Ultra-light solution to dependencies management, freely inspired by RequireJs and Angular dependency injection mechanism; desiring to be simpler and lighter.

**Features**:
- Provides a way to organize the code in modules, to avoid polluting the global namespace
- Supports asynchronous module definition
- Keeps synchronous what can stay synchronous
- Includes Grunt task to implement super minification (minification of objects keys)

**Notes**:
Despite being inspired by RequireJs, R.js does not follow the AMD API specification: the function used to _define_ is the same function used to call the dependencies (RequireJs *define* would be *R*; RequireJs *require* is always *R*).
- R.js follows a different philosophy and behaves similarly to Angular dependency mechanism: modules can be defined in random order, but the keys are chosen during development and JavaScript are normally loaded using <script> tags. While in Angular different functions are used to define modules (_controller_, _directive_, _factory_, _module_, _etc..._), in R.js the function _R_ is always used to define modules.

**Examples**:
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
