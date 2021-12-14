const gulp = require('gulp');
const run = require('gulp-run');

const installTo = process.argv[process.argv.indexOf("--to") + 1];
const relativePath = installTo.match(/(\.*\/)+/g)[0];
const packages = [
  'angular-generator',
  'react-generator',
  'preact-generator',
  'inferno-generator',
  'core-generator',
  'declarations',
  'build-helpers',
  'runtime'
];

const prepareInstallTask = (installTo, relativePath) => {
  packages.forEach((package) => {
    gulp.task(`install:${package}`, () => run(`npm i ${relativePath}devextreme-renovation/packages/${package}/package.tgz`, { cwd: installTo }).exec());
  });
};

prepareInstallTask(installTo, relativePath);

gulp.task('pack', () => {
    return run('npm run pack').exec();
});

gulp.task('install', gulp.series(
  packages.map((package) => `install:${package}`),
));

gulp.task('install-generators', gulp.series(
    'pack',
    'install')
);
