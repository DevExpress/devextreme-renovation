const ts = require('gulp-typescript');
const gulp = require('gulp');
const replace = require('gulp-replace');
const shell = require('gulp-shell');
const platforms = ['angular', 'react', 'vue', 'inferno'];

platforms.forEach(function(platform) {
  gulp.task(`copy-package-json-file.${platform}`, function() {
    return gulp
      .src(`./${platform}/package.json`)
      .pipe(replace('../dist/', '../'))
      .pipe(gulp.dest(`dist/${platform}`))
  });
});

gulp.task('compile.esm', function(done) {
  gulp
    .src('./**/*.ts')
    .pipe(ts('tsconfig.esm.build.json'))
    .pipe(gulp.dest('./dist/esm'))
  done();
});

gulp.task('compile.cjs', function(done) {
  gulp
    .src('./**/*.ts')
    .pipe(ts('tsconfig.cjs.build.json'))
    .pipe(gulp.dest('./dist/cjs'))
  done();
});

gulp.task('npm.license', function(done) {
  gulp
    .src('./LICENSE')
    .pipe(gulp.dest('./dist'))
  done();
});

gulp.task('npm.package', () => gulp
    .src('./package.json')
    .pipe(gulp.dest('./dist'))
);

gulp.task('npm.build',
  gulp.series(
    gulp.parallel('npm.license', 'npm.package'),
    shell.task(['npm pack'], { cwd: './dist' }),
    () => {
      return gulp.src('./dist/*.tgz')
        .pipe(gulp.dest('./'));
    }
));

gulp.task('copy-package-json-file', gulp.parallel(
  platforms.map(function(name) { return `copy-package-json-file.${name}` })
));

gulp.task('build', gulp.series(
  'compile.esm',
  'compile.cjs',
  'copy-package-json-file')
);
