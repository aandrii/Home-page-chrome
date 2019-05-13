const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");

const cssFiles = [
  "./node_modules/normalize.css/normalize.css", //or bower
  "./src/scss/style.scss"
];

const jsFiles = ["./src/js/main.js"];

function template() {
  return gulp
    .src("./src/**/*.html")
    .pipe(gulp.dest("build"))
    .pipe(browserSync.stream());
}

function styles() {
  return gulp
    .src(cssFiles)
    .pipe(concat("all.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["> 0.1%"],
        cascade: false
      })
    )
    .pipe(
      cleanCss({
        compatibility: "ie8",
        level: 2
      })
    )
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return (
    gulp
      .src(jsFiles)
      .pipe(concat("all.js"))
      /* .pipe(
      uglify({
        toplevel: true
      })
    ) */
      .pipe(gulp.dest("./build/js"))
      .pipe(browserSync.stream())
  );
}
function images() {
  return gulp.src("./src/images/*.*").pipe(gulp.dest("build/images"));
}
function fonts() {
  return gulp.src("./src/fonts/*.*").pipe(gulp.dest("build/fonts"));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
    //tunnel: true
  });
  gulp.watch("./src/scss/**/*.scss", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./src/**/*.html", template);
}

function dell() {
  return del(["build/*"]);
}

gulp.task(
  "build",
  gulp.series(dell, gulp.parallel(styles, scripts, template, images, fonts))
);
gulp.task("dev", gulp.series("build", watch));

// module.exports.watch = watch;
// module.exports.clean = clean;
