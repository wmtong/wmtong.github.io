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

const siteRoot = '_site';
const scssPath     = ['_scss/**/*.scss'];
const jsPath       = ['_scripts/*.js'];
const imgPath      = ['img/**/*.+(png|jpg|gif|svg)']
const templatePath = [ '*.html', '+(_includes|_layouts)/*.html', '*.yml', '_data/*.yml'];

gulp.task( 'sass', () => {
    return gulp.src( scssPath )
    .pipe( sass( { includePaths: ['scss'] } ) )
    .pipe( cleanCSS( {compatibility: 'ie8'} ) )
    .pipe( gulp.dest( '_site/css' ) )
    .pipe( gulp.dest( 'css' ) );
  });

gulp.task('images', () => {
  return gulp.src( imgPath )
  .pipe( imagemin() )
  .pipe(gulp.dest( '_site/img' ));
});

gulp.task( 'scripts', () => {
    return gulp.src( jsPath )
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

gulp.task('jekyll-build', done => {
    return cp.spawn( 'jekyll' , ['build'], {stdio: 'inherit'})
    .on('close', done);
  });

// run `jekyll build` with _config_dev.yml
gulp.task('jekyll-dev', done => {
  return cp.spawn( 'jekyll' , ['build', '--config', '_config.yml,_config_dev.yml'], {stdio: 'inherit'})
  .on('close', done);
});

// Rebuild Jekyll then reload the page
gulp.task('jekyll-rebuild', ['jekyll-dev'], () => {
  browserSync.reload();
});

gulp.task('default', ['jekyll-dev'], () => {
  browserSync.init({
    port: 4000,
    server: {
      baseDir: '_site'
    }
  });

  gulp.watch(scssPath, ['sass', 'jekyll-rebuild']);
  gulp.watch(jsPath, ['scripts', 'jekyll-rebuild']);
  gulp.watch(templatePath, ['jekyll-rebuild']);
});


gulp.task('build', ['sass', 'scripts', 'images', 'jekyll-build']);
