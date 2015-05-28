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
