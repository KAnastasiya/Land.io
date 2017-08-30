module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jade: {
      html: {
        files: {
          './': ['src/jade/index.jade'],
        },
        options: {
          client: false,
        },
      },
    },

    less: {
      target: {
        files: {
          'temp/styles.css': 'src/less/styles.less',
        },
      },
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', '> 5%'],
        diff: true,
      },
      '<%= pkg.name %>': { src: 'temp/styles.css' },
    },

    cssmin: {
      files: {
        src: ['temp/styles.css'],
        dest: './styles.min.css',
      },
    },

    concat: {
      '<%= pkg.name %>': {
        src: ['src/js/*.js'],
        dest: 'temp/script.js',
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['babel-preset-es2015'],
      },
      dist: {
        files: {
          'temp/script.js': 'temp/script.js',
        },
      },
    },

    uglify: {
      options: {
        banner: '/*<%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>*/\n',
      },
      '<%= pkg.name %>': {
        src: 'temp/script.js',
        dest: 'script.min.js',
      },
    },

    watch: {
      options: {
        livereloader: true,
      },
      jade: {
        files: ['src/jade/*'],
        tasks: ['jade'],
      },
      htmllint: {
        files: './*.html',
        tasks: ['htmllint'],
      },
      style: {
        files: 'src/less/*.less',
        tasks: ['less', 'autoprefixer', 'cssmin'],
      },
      script: {
        files: 'src/js/*.js',
        tasks: ['concat', 'babel', 'uglify'],
      },
    },
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('style', ['less', 'autoprefixer', 'cssmin']);
  grunt.registerTask('script', ['concat', 'babel', 'uglify']);

  grunt.registerTask('default', ['jade', 'less', 'autoprefixer', 'cssmin', 'concat', 'babel', 'uglify', 'watch']);
};
