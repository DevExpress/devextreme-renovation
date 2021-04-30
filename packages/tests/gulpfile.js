const ts = require("gulp-typescript");
const gulp = require("gulp");

gulp.task("compile-declaration-check", function compile() {
  const tsProject = ts.createProject(
    "./unit-tests/test-cases/tsconfig.json",
    ts.reporter.fullReporter
  );
  return gulp
    .src("unit-tests/test-cases/declarations/src/**/*.tsx")
    .pipe(tsProject());
});

gulp.task("compile-react-check", function compile() {
  const tsProject = ts.createProject(
    "./unit-tests/test-cases/tsconfig.json",
    ts.reporter.fullReporter
  );
  return gulp.src("unit-tests/test-cases/expected/react/**/*.tsx").pipe(tsProject());
});

gulp.task("compile-inferno-check", function compile() {
  const tsProject = ts.createProject(
    "./unit-tests/test-cases/expected/inferno/tsconfig.json",
    ts.reporter.fullReporter
  );
  return gulp
    .src("unit-tests/test-cases/expected/inferno/**/*.tsx")
    .pipe(tsProject());
});

gulp.task("compile-angular-check", function compile() {
  const tsProject = ts.createProject(
    "./unit-tests/test-cases/tsconfig.json",
    ts.reporter.fullReporter
  );
  return gulp
    .src("unit-tests/test-cases/expected/angular/**/*.tsx")
    .pipe(tsProject());
});

gulp.task(
  "compile-check",
  gulp.parallel(
    "compile-declaration-check",
    "compile-react-check",
    "compile-angular-check"
  )
);