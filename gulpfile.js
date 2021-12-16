const gulp = require('gulp');
const run = require('gulp-run');
const path = require('path');
const pareseArgs = require('minimist');

const devextremePath = pareseArgs(process.argv, { string: ['path'] }).path || '../devextreme';
//console.log(process.argv, pareseArgs(process.argv, { string: ['path'] }), devextremePath)
const installTo = path.join(__dirname , devextremePath);
const relativePath = path.relative(installTo, __dirname);
const packages = [
  'core-generator',
  'angular-generator',
  'react-generator',
  'preact-generator',
  'inferno-generator',
  'declarations',
  'build-helpers',
  'runtime'
];

const prepareInstallTask = (installTo, relativePath) => {
  packages.forEach((package) => {
    gulp.task(`install:${package}`, () => run(`npm i ${relativePath}/packages/${package}/package.tgz`, { cwd: installTo }).exec());
  });
};

prepareInstallTask(installTo, relativePath);

gulp.task('pack', () => {
    return run('npm run pack').exec();
});

gulp.task('install', gulp.series(
  packages.map((package) => `install:${package}`),
));

gulp.task('add-generators', gulp.series(
    'pack',
    'install')
);
