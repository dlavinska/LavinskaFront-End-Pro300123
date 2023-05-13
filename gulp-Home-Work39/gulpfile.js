const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    sourcemap = require("gulp-sourcemaps"),
    cleanCSS = require('gulp-clean-css'),
    mediaQueries = require('gulp-group-css-media-queries'),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    htmlMin = require('gulp-htmlmin'),
    imagemin = require("gulp-imagemin"),
    webp = require("gulp-webp"),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify-es').default;

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('code', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sourcemap.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js-script', function () {
    return gulp.src('app/js/script.js')
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'app/js/script.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean', function (done) {
    del.sync('dist');
    done();
});

gulp.task('js-prod', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'app/js/script.js'])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    return gulp.src('app/sass/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(mediaQueries())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(replace('style.css', 'style.min.css'))
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('optimize-images', function () {
    return gulp.src(["app/img/**/*.{png,jpg,svg}"])
        .pipe(imagemin([
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-dist', function (done) {
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
    done();
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.+(scss|sass)', gulp.parallel('sass'));
    gulp.watch('app/js/script.js', gulp.parallel('js', 'js-script'));
    gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'js', 'js-script', 'browser-sync', 'watch')); 
gulp.task('build', gulp.series('clean', 'css', 'js-prod', 'html', 'optimize-images','copy-dist'));

gulp.task('webp', function () {
    return gulp.src("app/img/**/*.{jpg,png}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("app/img"))
});

gulp.task('webp-prod', function () {
    return gulp.src("app/img/**/*.{jpg,png}")
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest("dist/img"))
});