'use strict';

const gulp = require('gulp');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');

//Склейка в один бандл, 
//процессинг JS (BabelJs), 
//минификация и создание map-файла
var browserify = require('browserify');
var source = require('vinyl-source-stream');
gulp.task('browserify', function() {
  var files = require('glob').sync("frontend/scripts/index.js");
  return browserify({
      enteries: ['frontend/scripts/index.js'],
      debug: true
    })
    .transform(require('babelify'))
    .bundle()
    .on('error', gutil.log)
    .pipe(source('bundle.js'))
    .pipe(require('vinyl-buffer')())
    .pipe(require('gulp-uglify')())
    .pipe(gulp.dest('public/scripts/browserify'));
});

//Unit-тестирование
gulp.task('test', function() {
  return gulp
    .src(['frontend/test/**/*.spec.js'], {read: false})
    .pipe(require('gulp-mocha')({ reporter: 'spec' }))
    .on('error', gutil.log);
;
});

//Очистка дирректории
gulp.task('clean', function() {
    return require('del')('public');
});

//Процессинг css
const debug = require('gulp-debug');
gulp.task('styles', function() {
	return gulp
    .src('frontend/styles/main.styl', {base: 'frontend'})
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(require('gulp-stylus')())
    .pipe(require('gulp-concat')('style.css'))
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
  gulp.watch('frontend/**/*.html',
    gulp.series('assets'));
});

gulp.task('assets', function() {
    return gulp
      .src('frontend/**/*.html', {
            since: gulp.lastRun('assets')
        })
        .pipe(debug({
            title: 'assets'
        }))
        .pipe(gulp.dest('public'));
});

const browserSync = require('browser-sync').create();
gulp.task('serve', function() {
    browserSync.init({
        server: 'public'
    });
    browserSync.watch('public/**/*.*')
      .on('change', browserSync.reload);
});

gulp.task('build', gulp.series(
  'clean',  
  gulp.parallel('styles', 'autoprefixer'))
);

gulp.task('default', gulp.series('test', 'build', 'browserify'));

//Запуск странички в браузере 
//+ мониторинг и изменения в реальном времени
gulp.task('dev',
    gulp.series(
      gulp.series('default', 'assets'), 
      gulp.parallel('watch', 'serve')));
