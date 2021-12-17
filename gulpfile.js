const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf')
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');



// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 8000,
            baseDir: "build"
        }
    });

    gulp.watch("build/**/*").on('change', browserSync.reload);
});

// Pug compile 
gulp.task('templates:compile', function buildHTML(){
    return gulp.src('source/pug/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
})


/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/style.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('build/css'));
  });
  

// js
gulp.task('js', function(){
  return gulp.src([
    'source/js/init.js',
    'source/js/validation.js',
    'source/js/form.js',
    'source/js/navigation.js',
    'source/js/main.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/js'));
})



// Sprites
gulp.task('sprite', function (cd) {
    const spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../img/sprite.png',
      cssName: 'sprite.css'
    }));

    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cd()
  });


  //Delete
  gulp.task('clean', function del(cd){
    return rimraf('build', cd);
  })


  // Copy Fonts
  gulp.task('copy:fonts', function(){
      return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
  });

  // Copy Images
  gulp.task('copy:images', function(){
    return gulp.src('./source/img/**/*.*')
      .pipe(gulp.dest('build/img'));
});

//Copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


/* ------------ Watchers ------------- */
gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/js/**/*.js', gulp.series('js'));
  });


  gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'js', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
  );
  


// Autoprefixer Task

gulp.task('autoprefixer', function(){
    gulp.src('source/styles/style.scss')
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('build/css/'));
});