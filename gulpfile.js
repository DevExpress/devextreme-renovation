const ts = require("gulp-typescript");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const { spawn } = require("child_process");
const plumber = require("gulp-plumber");

const TEST_CASES_SRC = "test/**/*";

gulp.task("copy-test-cases", function copyTestCases() {
  return gulp.src(TEST_CASES_SRC).pipe(gulp.dest("dist/test"));
});

// gulp.task("copy-packages", function copyTestCases() {
//   return gulp.src("packages/**/*").pipe(gulp.dest("dist/packages"));
// });

// gulp.task("copy-package", function copyTestCases() {
//   return gulp
//     .src(["package.json",
//       // "LICENSE", "README.md", ".npmignore"
//     ])
//     .pipe(gulp.dest("build"));
// });

// gulp.task("compile", function compile() {
//   const tsProject = ts.createProject("tsconfig.json");
//   return tsProject
//     .src()
//     .pipe(plumber(() => null))
//     .pipe(sourcemaps.init())
//     .pipe(tsProject())

//     .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: "./" }))
//     .pipe(gulp.dest(tsProject.options.outDir));
// });

// gulp.task("tests", function (done) {
//   const tests = spawn("npm", ["test"]);
//   const data = [];
//   tests.stdout.on("data", (d) => {
//     data.push(d.toString());
//   });
//   tests.stderr.pipe(process.stdout);

//   tests.on("exit", (code) => {
//     if (code === 0) {
//       console.log(data[data.length - 1]);
//     } else {
//       console.log(data.join(""));
//     }
//     done();
//   });
// });

// gulp.task("compile-inferno-modules", function compile() {
//   const tsProject = ts.createProject(
//     "./test/test-cases/expected/inferno/tsconfig.json",
//     ts.reporter.fullReporter
//   );
//   return gulp
//     .src("modules/inferno/**/*.ts")
//     .pipe(tsProject())
//     .pipe(gulp.dest("build/modules/inferno"));
// });

// gulp.task(
//   "build",
//   gulp.parallel([
//     "copy-test-cases",
//     // "compile",
//     "compile-inferno-modules",
//   ])
// );

// gulp.task(
// "build-dist",
//   gulp.series(
//     "copy-package",
//     "copy-test-cases",
//     function () {
//       const tsProject = ts.createProject("tsconfig.dist.json");

//       return tsProject
//         .src()
//         .pipe(tsProject())
//         .pipe(gulp.dest(tsProject.options.outDir));
//     },
//     "compile-inferno-modules"
//   )
// );

// gulp.task(
//   "watch",
//   gulp.parallel("build", "copy-test-cases", function watch() {
//     gulp.watch(TEST_CASES_SRC, gulp.series("copy-test-cases"));
//     return gulp.watch(
//       ["./**/*.ts", "!./node_modules", "!./**/*.d.ts"],
//       gulp.series("compile")
//     );
//   })
// );

// gulp.task("compile-declaration-check", function compile() {
//   const tsProject = ts.createProject(
//     "./test/test-cases/tsconfig.json",
//     ts.reporter.fullReporter
//   );
//   return gulp
//     .src("test/test-cases/declarations/src/**/*.tsx")
//     .pipe(tsProject());
// });

// gulp.task("compile-react-check", function compile() {
//   const tsProject = ts.createProject(
//     "./test/test-cases/tsconfig.json",
//     ts.reporter.fullReporter
//   );
//   return gulp.src("test/test-cases/expected/react/**/*.tsx").pipe(tsProject());
// });

// gulp.task("compile-inferno-check", function compile() {
//   const tsProject = ts.createProject(
//     "./test/test-cases/expected/inferno/tsconfig.json",
//     ts.reporter.fullReporter
//   );
//   return gulp
//     .src("test/test-cases/expected/inferno/**/*.tsx")
//     .pipe(tsProject());
// });

// gulp.task("compile-angular-check", function compile() {
//   const tsProject = ts.createProject(
//     "./test/test-cases/tsconfig.json",
//     ts.reporter.fullReporter
//   );
//   return gulp
//     .src("test/test-cases/expected/angular/**/*.tsx")
//     .pipe(tsProject());
// });

// gulp.task(
//   "compile-check",
//   gulp.parallel(
//     "compile-declaration-check",
//     "compile-react-check",
//     "compile-angular-check"
//   )
// );
