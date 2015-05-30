var path = require("path");

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      //main area
      main: {
        src: [
          "../scripts/demo/common/components/string.js",
          "../scripts/demo/common/components/code.js",
          "../scripts/demo/common/components/extend.js",
          "../scripts/demo/common/components/events.js",
          "../scripts/demo/common/components/progress.js",
          "../scripts/demo/common/models/model.js",
          "../scripts/demo/dashboard/models/dashboard.js",
          "../scripts/demo/dashboard/templates.js",
          "../scripts/demo/app.js"
        ],
        dest: "../scripts/demo/main.built.js",
      },

      //example area
      exampleArea: {
        src: [
          "../scripts/demo/example-area/example-area.js"
        ],
        dest: "../scripts/demo/example-area.built.js"
      }/*,

      anotherArea: {
        src: [
          "../scripts/demo/example-area-two/example-area-two.js"
        ],
        dest: "../scripts/demo/example-area-two.built.js"
      }*/
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      rjs: {
        files: {
          '../scripts/libs/r.min.js': ['../scripts/libs/r.js']
        }
      },
      demo: {
        files: {
          //main min file
          "../scripts/demo/main.min.js": ["../scripts/demo/main.built.js"],
          //example area min file
          "../scripts/demo/example-area.min.js": ["../scripts/demo/example-area.built.js"]
          //example another area min file
          //"../scripts/demo/example-area-two.min.js": ["../scripts/demo/example-area-two.built.js"]
        }
      }
    },
    
    robscure: {
      website: {
        // these are all the built or minified files of all areas: the task will look for each module in each file and assign them new keys.
        // for each file, a new file will be generated, with obfuscated module names
        areas: ["../scripts/demo/main.min.js", "../scripts/demo/example-area.min.js"]
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('robscure');

  grunt.registerTask('default', ['concat', 'uglify', 'robscure']);
};
