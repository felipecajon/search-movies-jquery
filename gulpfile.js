const gulp = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const pump = require('pump');
const uglify = require('gulp-uglifyes');
const runSequence = require('run-sequence');
const del = require('del');
const jshint = require('gulp-jshint');
const imagemin = require('gulp-imagemin');
const fs = require('fs');
const notifier = require('node-notifier');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const iconfont = require('gulp-iconfont');    
const iconfontCss = require('gulp-iconfont-css');
const babel = require('gulp-babel');
const lineReader = require('line-reader');
const throwError = true;



const pathInTheme = 'src';
const pathOutTheme = 'dist';

const pathToWatchLess = [pathInTheme + '/less/**/*.less'];
const pathToWatchLessYBase = [pathInTheme + '/../../lib/ybase-0.1.0/less/**/*.less'];
const pathInCss = [pathInTheme + '/less/**/style.less'];
const pathInPureCss = [pathInTheme + '/less/**/*.css',  pathInTheme + '/assets/**/*.css'];
const pathOutCss = pathOutTheme + '/css';
const pathInJs = pathInTheme + '/js/**/*.js';
const pathOutJs = pathOutTheme + '/js';
const pathInImgs = pathInTheme + '/images/**/*.';
const pathOutImgs = pathOutTheme + '/img';

const pathInJsLIB = [pathInTheme + '/lib/**/*.js'];
const pathOutJsLIB = pathOutTheme + '/lib';

const pathIconsIn = [pathInTheme + '/icons/*.svg' , pathInTheme + '/icons/icon_tracking/*.svg'];
const pathIconsOut = pathInTheme + '/fonts/icons/';
const pathTemplateIcons = pathInTheme + '/lib/icon_template.less';

// Addons
const sufixPathAddon = '/LIBeleratoraddon/web/webroot/WEB-INF/_ui-src/responsive';
const sufixPathAddonHTML = '/LIBeleratoraddon/web/webroot/WEB-INF/views';
const sufixPathAddonTAG = '/LIBeleratoraddon/web/webroot/WEB-INF/tags/responsive';
const pathOutAddonsHTML = pathInTheme + '/less/addons/';
const pathOutAddonsLESS = pathInTheme + '/less/addons/';
const pathOutAddonsJS = pathInTheme + '/js/addons/';
const pathRootAddons = ['fheventaddon'];

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('copyAddonsJS', function () {
  return ( () => {
    // del.sync([pathOutAddonsJS]);

    for (var i = 0; i < pathRootAddons.length; i++) {
      let  pathRootAddons_JS_in =  '../../../ext-event-list/' +pathRootAddons[i] + sufixPathAddon + '/js/**/*.*';

      pump([
        gulp.src(pathRootAddons_JS_in),
        gulp.dest(pathOutAddonsJS + pathRootAddons[i])
        ]);
    }

    return true;
  })();
});

gulp.task('copyAddonsLESS', function () {
  return ( () => {
    del.sync([pathOutAddonsLESS]);

    for (var i = 0; i < pathRootAddons.length; i++) {
      let  pathRootAddons_LESS_in =  '../../../ext-event-list/' + pathRootAddons[i] + sufixPathAddon + '/less/**/*.less';

      pump([
        gulp.src(pathRootAddons_LESS_in),
        gulp.dest('webroot/WEB-INF/_ui-src/addons/'+ pathRootAddons[i] +'/responsive/less') 
        ]);
    }

    return true;
  } )();
});

gulp.task('copyAddonsTAG', function () {
  return ( () => {
    for (var i = 0; i < pathRootAddons.length; i++) {
      let  pathRootAddons_HTML_in =  '../../../ext-event-list/' +pathRootAddons[i] + sufixPathAddonTAG + '/**/*.tag';

      pump([
        gulp.src(pathRootAddons_HTML_in),
        gulp.dest('webroot/WEB-INF/tags/addons/' + pathRootAddons[i] + '/responsive')
        ]);
    }

    return true;
  } )();
});

gulp.task('copyAddonsJSP', function () {
  return ( () => {
    for (var i = 0; i < pathRootAddons.length; i++) {
      let  pathRootAddons_HTML_in =  '../../../ext-event-list/' + pathRootAddons[i] + sufixPathAddonHTML + '/**/*.jsp';

      pump([
        gulp.src(pathRootAddons_HTML_in),
        gulp.dest('webroot/WEB-INF/views/addons/' + pathRootAddons[i])
        ]);
    }

    return true;
  } )();
});

gulp.task('deleteAddons', function () {
  for (var i = 0; i < pathRootAddons.length; i++) {
    del.sync(['webroot/WEB-INF/_ui-src/addons/' + pathRootAddons[i] + '/responsive/js']);
  }

  return true
});

gulp.task('less', function () {
  // if ( process.argv[2] == undefined || process.argv[2] == 'watch') {
    return gulp.src(pathInCss)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(pathOutCss));
  // }

  if ( process.argv[2] == '--production' ) {
    return gulp.src(pathInCss)
    .pipe(less({paths: [ path.join(__dirname, 'less', 'includes') ]}))
    .pipe(cssmin())
    .pipe(gulp.dest(pathOutCss));
  }
});

gulp.task('moveCss', function () {
  if ( process.argv[2] == undefined || process.argv[2] == 'watch') {
    return pump([
      gulp.src(pathInTheme + '/less/style.css'),
      gulp.dest(pathOutCss)
      ]);
  }

  if ( process.argv[2] == '--production' ) {
    return pump([
      gulp.src(pathInPureCss),
      gulp.dest(pathOutCss)
      ]);
  }
});

gulp.task('moveJsLib', function () {
  return pump([
    gulp.src(pathInJsLIB),
    // uglify({ sourceMap: true }).on('error', errorHandler),
    gulp.dest(pathOutJsLIB)
    ]);
});

gulp.task('moveJs', function () {
  if ( process.argv[2] == undefined || process.argv[2] == 'watch') {
    return pump([
      gulp.src(pathInJs),
      gulp.dest(pathOutJs)
      ]);
  }

  if ( process.argv[2] == '--production' ) {
    return pump([
      gulp.src(pathInJs),
      babel({ presets: ['@babel/env'] }).on('error', errorHandler),
      uglify({ sourceMap: true }).on('error', errorHandler),
      gulp.dest(pathOutJs)
      ]);
  }
});

gulp.task('lint', function () {
  return pump([
    gulp.src(pathInJs),
    jshint( { esversion : 9 } ),
    jshint.reporter('default', { verbose: true })
    ]);
});

gulp.task('clean', function () {
  return del.sync(pathOutTheme);
});

gulp.task('images', function () {
  return pump([
    gulp.src(pathInImgs + '+(png|jpg|gif|svg|ico)'),
    imagemin(),
    gulp.dest(pathOutImgs)
    ]);
});

gulp.task('iconfont', () => {
  const fontName = 'icon-font';
  const iconCode = 0xf001;
  return gulp.src(pathIconsIn, { base: pathInTheme })
  .pipe(iconfontCss({
    fontName,
    path: pathTemplateIcons,
    targetPath: '../../less/_icon-font.less',
    fontPath: '../fonts/icons/',
    firstGlyph: iconCode
  }))
  .pipe(iconfont({
    fontName,
    formats: ['ttf', 'eot', 'woff', 'woff2'],
    normalize: true,
    fontHeight: 1001,
    centerHorizontally: true,
    startUnicode: iconCode
  }))
  .pipe(gulp.dest(pathIconsOut));
});

gulp.task('watchCSS', function(callback){
  runSequence('less', callback);
});

gulp.task('execAddonLess', function(){
  runSequence('copyAddonsLESS');
  setTimeout(() => {
    runSequence('less');
  }, 1000)
});

gulp.task('watchJS', function(callback){
  runSequence('lint', 'moveJs', callback);
});

gulp.task('copyFonts', function () {
  return pump([
    gulp.src([pathInTheme + '/fonts/**/*']),
    gulp.dest(pathOutTheme + '/fonts')
    ]);
});

gulp.task('default',  function () {
  runSequence('clean', 'images', 'iconfont', 'copyFonts', 'moveJsLib', 'lint', 'moveJs','less');
});

gulp.task('watch', function () {
  gulp.watch(pathToWatchLess, ['watchCSS']);
  gulp.watch(pathToWatchLessYBase, ['watchCSS']);
  gulp.watch(pathInJs, ['watchJS']);
  gulp.watch(pathInJsLIB, ['moveJsLib']);
});

gulp.task('start', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
    // proxy: {
    //   target: "https://zaffari.local:9002/zaffaristorefront/",
    //   proxyRes: [
    //   function(proxyRes, req, res) {
    //     console.log(proxyRes.headers);
    //   }
    //   ]
    // }
  });

  gulp.watch(pathInJs, ['moveJs']).on('change', browserSync.reload);
  gulp.watch('src/less/**/*.less', ['watchCSS']).on('change', browserSync.reload);
  gulp.watch(['index.html', 'src/**/*.html']).on('change', browserSync.reload);
});

