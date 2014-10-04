// Load plugins
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({ camelize: true });
	lr = require('tiny-lr');
	livereload = require('gulp-livereload');
	server = lr();

// Styles
gulp.task('styles', function() {
  return gulp.src('assets/styles/*.scss')
	.pipe(plugins.rubySass({ style: 'expanded', sourcemap: true }))
	.pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
	.pipe(gulp.dest('assets/styles/build'))
	.pipe(plugins.minifyCss({ keepSpecialComments: 1 }))
	// .pipe(plugins.livereload(server))
	.pipe(plugins.livereload())
	.pipe(gulp.dest('./'))
	.pipe(plugins.notify({ message: 'Styles task complete' }));
});

// Vendor Plugin Scripts
gulp.task('plugins', function() {
  return gulp.src(['assets/js/source/plugins.js', 'assets/js/vendor/*.js'])
	.pipe(plugins.concat('plugins.js'))
	.pipe(gulp.dest('assets/js/build'))
	.pipe(plugins.rename({ suffix: '.min' }))
	.pipe(plugins.uglify())
	// .pipe(plugins.lr())
	.pipe(plugins.livereload())
	.pipe(gulp.dest('assets/js'))
	.pipe(plugins.notify({ message: 'Scripts task complete' }));
});

// Site Scripts
gulp.task('scripts', function() {
  return gulp.src(['assets/js/source/*.js', '!assets/js/source/plugins.js'])
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter('default'))
	.pipe(plugins.concat('main.js'))
	.pipe(gulp.dest('assets/js/build'))
	.pipe(plugins.rename({ suffix: '.min' }))
	.pipe(plugins.uglify())
	.pipe(plugins.livereload())
	// .pipe(plugins.lr())
	.pipe(gulp.dest('assets/js'))
	.pipe(plugins.notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
	.pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
	// .pipe(plugins.livereload(server))
	// .pipe(plugins.lr())
	.pipe(plugins.livereload())
	.pipe(gulp.dest('assets/images'))
	.pipe(plugins.notify({ message: 'Images task complete' }));
});

// Watch
gulp.task('watch', function() {

  // Listen on port 35729
 //  server.listen(35729, function (err) {
	// if (err) {
	//   return console.log(err)
	// };

	livereload.listen();

	// Watch .scss files
	gulp.watch('assets/styles/**/*.scss', ['styles']).on('change', livereload.changed);

	// Watch .js files
	gulp.watch('assets/js/**/*.js', ['plugins', 'scripts']).on('change', livereload.changed);

	// Watch image files
	gulp.watch('assets/images/**/*', ['images']).on('change', livereload.changed);

  // });

});

// Default task
gulp.task('default', ['styles', 'plugins', 'scripts', 'images', 'watch']);
