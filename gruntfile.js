module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('app/package.json'),
    nodewebkit: {
      options: {
        build_dir: './dist',
        // specifiy what to build
        mac: true,
        win: true,
        linux32: false,
        linux64: false
      },
      src: './app/**/*'
    },
  });
 
  grunt.loadNpmTasks('grunt-node-webkit-builder');
 
  grunt.registerTask('default', ['nodewebkit']);
};