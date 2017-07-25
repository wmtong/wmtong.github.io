'use strict';

const gulp      = require('gulp');
const sass      = require('gulp-sass');
const prefix    = require('gulp-autoprefixer');
const cleanCSS  = require('gulp-clean-css');
const imagemin  = require('gulp-imagemin');
const eslint   = require('gulp-eslint');
const babel    = require('gulp-babel');
const uglify   = require('gulp-uglify');
const browserSync  = require('browser-sync').create();
const cp           = require('child_process');

gulp.task('sass', () => {
  return gulp.src('_scss/**/*.scss')
      .pipe( sass())
      .pipe(gulp.dest('_site/css'))
});

gulp.task('images', () => {
  return gulp.src( 'img/**/*.+(png|jpg|gif|svg)' )
  .pipe( imagemin() )
  .pipe(gulp.dest( '_site/img' ));
});

gulp.task('fonts', () => {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})


gulp.task( 'scripts', () => {
    return gulp.src( '_scripts/*.js' )
    .pipe( eslint( {
      useEslintrc: true
    } ) )
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe( uglify() )
    .pipe( gulp.dest( '_site/js' ) )
    .pipe( gulp.dest( 'js' ) );
  });

// Deletes the entire _site directory.
gulp.task('clean:jekyll', function(callback) {
    del(['_site']);
    callback();
});

// Main clean task.
// Deletes _site directory and processed assets.
gulp.task('clean', ['clean:jekyll',
    'clean:fonts',
    'clean:images',
    'clean:scripts',
    'clean:styles']);

gulp.task('jekyll-build', done => {
    return cp.spawn( 'jekyll' , ['build'], {stdio: 'inherit'})
    .on('close', done);
  });

gulp.task('build', ['sass', 'scripts', 'images']);
