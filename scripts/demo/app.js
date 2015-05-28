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