'use strict';

const gulp = require('gulp');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const gulpIf = require('gulp-if');
const rename = require('gulp-rename'); 
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');

//Склейка в один бандл
var browserify = require('browserify');
var source = require('vinyl-source-stream');
gulp.task('browserify', function() {
  return browserify(['frontend/scripts/index.js', 'frontend/scripts/subIndex.js'])
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/scripts/browserify'));
});

//Unit-тестирование
gulp.task('test', function() {
  return gulp.src(['frontend/test/**/*.spec.js'], {read: false})
    .pipe(require('gulp-mocha')({ reporter: 'spec' }))
    .on('error', gutil.log);
;
});

//Очистка дирректории
gulp.task('clean', function() {
    return require('del')('public');
});

//Процессинг JS (BabelJs), минификация и создание map-файла
gulp.task('babel', () =>
	gulp.src('frontend/scripts/**/*.js')
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(require('gulp-babel')())
        .pipe(gulp.dest('public/scripts/babel'))
        .pipe(require('gulp-uglify')())
        .pipe(rename('scripts.min.js'))
		.pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
		.pipe(gulp.dest('public/scripts/minify'))
);

//Процессинг css
const debug = require('gulp-debug');
gulp.task('styles', function() {
	return gulp.src('frontend/styles/main.styl', {base: 'frontend'})
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(debug({title: 'after src'}))
		.pipe(require('gulp-stylus')())
		.pipe(debug({title: 'after stylus'}))
		.pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
		.pipe(gulp.dest('public'));
});

//Автопрефиксер
gulp.task('autoprefixer', function() {
    return gulp.src('frontend/styles/**/*.css', {base: 'frontend'})
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(require('gulp-postcss')([ 
            require('autoprefixer')({ browsers: ['last 3 versions'] }) 
        ]))
        .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
        .pipe(gulp.dest('public'));
});


gulp.task('assets', function() {
	return gulp.src('frontend/**/*.html')
		.pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
	'clean',	
	gulp.parallel('babel', 'styles', 'autoprefixer', 'assets'))
);

//Инкрементальная сборка
gulp.task('watch', function() {
  gulp.watch('frontend/scripts/**/*.js', 
    gulp.parallel('browserify', 'test'));
  gulp.watch('frontend/test/**/*.spec.js', 
    gulp.series('test'));
  gulp.watch('frontend/styles/**/*.styl',
    gulp.series('styles'));
  gulp.watch('frontend/styles/**/*.css',
    gulp.series('autoprefixer'));
  gulp.watch('frontend//**/*.html',
    gulp.series('assets'));
});

gulp.task('default', gulp.series('test', 'build', 'browserify', 'watch'));
