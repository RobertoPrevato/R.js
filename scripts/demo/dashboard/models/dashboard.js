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