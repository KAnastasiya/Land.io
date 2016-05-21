'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      html: {
        files: {
          './': ['src/html/index.jade']
        },
        options: {
          client: false
        }
      }
    },
    htmllint: {
      all: { src: './*.html' }
    },
    less: {
      target: {
        files: {
          'sources/styles/styles.css': 'src/styles/styles.less'
        }
      }
    },
    ucss: {
      target: {
        pages: { crawl: ['./*.html'] },
        css: ['sources/styles/styles.css']
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', '> 5%'],
        diff: true
      },
      '<%= pkg.name %>': { src: 'sources/styles/styles.css' }
    },
    cssmin: {
      files: {
        src: ['sources/styles/styles.css'],
        dest: 'sources/styles/styles.min.css'
      }
    },
    concat: {
      '<%= pkg.name %>': {
        src: ['src/scripts/*.js'],
        dest: 'sources/scripts/output.js'
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['babel-preset-es2015']
      },
      dist: {
        files: {
          'sources/scripts/output.js': 'sources/scripts/output.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*<%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>*/\n'
      },
      '<%= pkg.name %>': {
        src: 'sources/scripts/output.js',
        dest: 'sources/scripts/output.min.js'
      }
    },
    jsdoc: {
      dist: {
        src: ['sources/scripts/*.js'],
        options: {
          destination: 'sources/scripts/doc'
        }
      }
    },
    watch: {
      options: {
        livereloader: true
      },
      jade: {
        files: ['src/html/*.jade'],
        tasks: ['jade']
      },
      htmllint: {
        files: './*.html',
        tasks: ['htmllint']
      },
      style: {
        files: 'src/styles/*.less',
        tasks: ['less', 'autoprefixer', 'ucss', 'cssmin']
      },
      script: {
        files: 'src/scripts/*.js',
        tasks: ['concat', 'babel', 'uglify', 'jsdoc']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('style', ['less', 'ucss', 'autoprefixer', 'cssmin']);
  grunt.registerTask('script', ['concat', 'babel', 'uglify', 'jsdoc']);

  grunt.registerTask('default', [
    'jade',
    'less', 'ucss', 'autoprefixer', 'cssmin',
    'concat', 'babel', 'uglify', 'jsdoc',
    'watch']);
};
