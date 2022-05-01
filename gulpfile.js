//gulp-concat gulp-autoprefixer  gulp-imagemin  gulp-html-replace（gulp-rev-collector） gulp-rev(静态资源防缓存)
const Gulp = require('gulp');
const Minifycss = require('gulp-minify-css');
//const Uglify = require('gulp-uglify');
const FileInclude = require('gulp-file-include');
const WebServer = require('gulp-webserver');
const Clean = require('gulp-clean');
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector'); 
var minifyHTML   = require('gulp-minify-html');
const Dist = 'dist/';  //处理完成后生成的文件地址
 
function copyHtml(){
  return Gulp.src(['src/view/*', 'rev/**/*.json'])
        .pipe(revCollector())
        .pipe(FileInclude({
            prefix: '##',
            basepath: '@file'
        })).on('error', function(err) {
            console.error('Task:copyHtml,', err.message);
            this.end();
        }).pipe(minifyHTML()).pipe(Gulp.dest(Dist));
}
function copyJs(){
  return Gulp.src('src/js/**')
  //.pipe(Uglify())
  .pipe(Gulp.dest(Dist + '/js'));
}
function copyCss(){
  return Gulp.src('src/css/*.css').pipe(Minifycss()).pipe(rev()).pipe(Gulp.dest(Dist + '/css')).pipe(rev.manifest()).pipe(Gulp.dest('rev/css'))
}
function copyImages(){
  return Gulp.src('src/image/*').pipe(Gulp.dest(Dist + '/image'));
}
 
//监听文件变化
function watch(){
  //['src/view/*','src/include/*']
  Gulp.watch('src/view/**', copyHtml);
  Gulp.watch('src/js/**', Gulp.series(copyJs, copyHtml));
  Gulp.watch('src/css/*', Gulp.series(copyCss, copyHtml));
  Gulp.watch('src/images/*', copyImages);
}
 
function webServer(){
    return Gulp.src(Dist).pipe(WebServer({
          port: 8080,
          host: 'localhost',
          livereload: true,
          open: 'http://localhost:8080/index.html',
          proxies: [{
            source: '/api',
            target: 'http://106.52.176.228'//常江-'http://112.126.61.9:8070' // 代理的域名
          }]
      }));
};
 
function clean(){
    return Gulp.src(Dist).pipe(Clean());
};
 
exports.default= Gulp.series(clean, Gulp.parallel(copyHtml,copyJs, copyCss, copyImages),webServer, watch) 

//参考配置
//https://www.ibm.com/developerworks/cn/web/wa-using-gulp-to-build-lightweight-frontend-environment/index.html