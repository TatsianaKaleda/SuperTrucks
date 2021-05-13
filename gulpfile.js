const gulp = require('gulp');

const plumber = require('gulp-plumber');
const fileInclude = require('gulp-file-include');
const htmlValidator = require('gulp-w3c-html-validator');
const sourcemaps = require('gulp-sourcemaps');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const shorthand = require('gulp-shorthand');
const cleanCSS = require('gulp-clean-css');
const browserSync = require("browser-sync");
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const imageMin = require('gulp-imagemin');
const rigger = require('gulp-rigger');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const reload = browserSync.reload;
const pug = require('gulp-pug');
const jade = require('gulp-jade');
const watch = require('gulp-watch');
const data = require('gulp-data');
const replace = require('gulp-replace');

const path = {
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        css: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        jade: 'src/*.jade'
    },
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        jade: 'build/'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/*.js',
        css: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        jade: 'src/**/*.jade'
    },
    clean: './build'
};

const config = {
    server: {
        baseDir: "./build"
    },

    host: 'localhost',
    port: 9000,
    logPrefix: "Legal_tech"
};

const html = () => {
    return gulp
        .src(path.src.jade)
        .pipe(data(file => require('./src/data/data.json')))
        .pipe(jade({
            pretty: true
        }))
        // .pipe(replace('style/main.scss', 'css/main.min.css'))
        .pipe(htmlValidator())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
};


// gulp.task('jade', function() {
//     return gulp.src('src/**/*.jade')
//         .pipe(jade())
//         .pipe(gulp.dest('build/development')); // указываем gulp куда положить скомпилированные HTML файлы
// });


const css = () => {
    return gulp
        .src(path.src.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer({
            cascade: false
        }))
        .pipe(shorthand())
        .pipe(cleanCSS({
            debug: true,
            compatibility: '*'
        }, details => {
            console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
};

const js = () => {
    return gulp
        .src(['./node_modules/jquery/dist/jquery.js',
            './node_modules/materialize-css/dist/js/materialize.min.js',
            './node_modules/slick-carousel/slick/slick.js',
            path.src.js])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
};

const img = () => {
    return gulp
        .src(path.src.img)
        .pipe(imageMin())
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}))
};

const font = () => {
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}))
};

// gulp.task('pug', function () {
//     return gulp.src('./src/**/*.jade')
//         .pipe(pug({
//             doctype: 'html',
//             pretty: false
//         }))
//         .pipe(gulp.dest('build/test/'));
// });


// чтобы запустить эту задачу, наберите в командной строке gulp jade
// gulp.task('jade', function() {
//     return gulp.src('src/**/*.jade')
//         .pipe(jade())
//         .pipe(gulp.dest('build/development')); // указываем gulp куда положить скомпилированные HTML файлы
// });


gulp.task('build', gulp.series(gulp.parallel(html, css, img, font), js));

gulp.task('watch', function () {
    gulp.watch(path.watch.jade, html);
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img, img);
    gulp.watch(path.watch.fonts, font);
});

// gulp.task('watch', function () {
//     return watch(path.watch.pug, {ignoreInitial: false})
//         .pipe(gulp.dest('pug'));
// });


gulp.task('webServer', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', gulp.series('clean', 'build', gulp.parallel('webServer', 'watch')));
