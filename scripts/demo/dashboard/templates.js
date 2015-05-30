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