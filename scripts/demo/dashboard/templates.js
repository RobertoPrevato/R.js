//
//Knight generated templates file
//
"use strict";
if (!ko.templates) ko.templates = {};
(function (templates) {
	var o = {
		'dashboard': '<h2>scalability made easy!</h2> <h4>R.js makes easy to load scripts in blocks (as they become needed), and fire callbacks when dependencies are ready</h4> <ol> <li>all entities in this page are loaded in the <strong>wrong</strong> order (see the page source code and the script elements)</li> <li>R.js executes the modules functions in the right order, to satisfy dependencies</li> <li>why is it easier? because R.js doesn\'t throw exception if a dependency is not available for a module: it waits, until eventually it will come</li> <li>Live example: click the button below to simulate the dynamic loading of JavaScript for a new area, after a delay (like an AJAX call)</li> </ol> <div class="spa-demo"> <button class="btn btn-warning" data-bind="click: spademo">Click to load a new area (partial view)</button> <hr /> <canvas id="canvas" width="0" height="0"></canvas> <div id="partial"></div> <br class="break" /> </div> <h2>Features:</h2> <ol> <li>Supports asynchronous module definition</li> <li>Keeps synchronous what can stay synchronous</li> <li>Evaluates the function that defines an object, only when all dependencies are ready</li> <li>Includes grunt task to implement <strong>super minification</strong> (minification of objects keys)</li> </ol>',
		'example-area': '<div class="area-view"> <hr /> <h2>Example sub-view</h2> <p>this example demonstrates how to load and execute JavaScript only when they are actually needed (for scalability)</p> <script src="scripts/demo/example-area/example-area.js"></script> </div>'
	};
	var x;
	for (x in o) {
		templates[x] = o[x];
	}
})(ko.templates);