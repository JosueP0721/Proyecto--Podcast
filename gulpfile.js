const { src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css( done ) {
    src('src/scss/app.scss')
        .pipe( plumber() )
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') )

    done();
}
function javascript(done) {
    src('src/js/**/*.js')
        .pipe(dest('build/js'))

    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe( cache(imagemin({ optimizationLevel: 3 })) )
        .pipe( dest('build/img') )
}

function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('build/img') )
}
function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img'))
}

function dev() {
    watch( 'src/scss/**/*.scss', css );
    watch( 'src/img/**/*', imagenes );
    watch('src/js/**/*.js', javascript);
}


exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif,javascript, css, dev  );
