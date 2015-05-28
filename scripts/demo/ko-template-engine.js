//
//Roberto Prevato
//custom template engine for knockout js, to support templates cached in memory (inside ko.templates variable).
//
"use strict";
(function (ko, _) {
	//override base templateEngine makeTemplateSource to extend it, to load cached templates
	ko.templateEngine.prototype['makeTemplateSource'] = function (template, templateDocument) {
		// Named template
		if (typeof template == "string") {
			templateDocument = templateDocument || document;
			var elem = templateDocument.getElementById(template);
			//if the element is not a script, we don't care about it
			if (elem && !/script/i.test(elem.tagName)) elem = null;
			if (!elem) {
				//check if the template is defined inside templates object
				if (!ko.templates || !ko.templates[template]) throw new Error("Cannot find template with ID " + template);
				//take template from cache object
				var s = document.createElement('script');
				s.setAttribute('type', 'text/html');
				s.setAttribute('id', template);
				//compile for translations
				var t = _.template(ko.templates[template], {});
				s.text = t;
				//set reference to s
				elem = s;
			} else {
				//check if the template id is used in two different places
				if (ko.templates && ko.templates[template]) throw new Error("Two templates with the same ID " + template + " exist in the document and in the templates definition.");
			}
			return new ko.templateSources.domElement(elem);
		} else if ((template.nodeType == 1) || (template.nodeType == 8)) {
			// Anonymous template
			return new ko.templateSources.anonymousTemplate(template);
		} else
			throw new Error("Unknown template type: " + template);
	};
	return;
})(ko, _);