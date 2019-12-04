const ts = require("gulp-typescript");
const gulp = require("gulp");
var sourcemaps = require('gulp-sourcemaps');
const { spawn } = require('child_process');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile', function compile() {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: './' } ))
        .pipe(gulp.dest("./"));
});

gulp.task("tests", function(done) {
    const tests = spawn("npm", ["test"]);
    const data = [];
    tests.stdout.on("data", (d) => {
        data.push(d.toString());
    });
    tests.stderr.pipe(process.stdout);

    tests.on("exit", (code) => {
        if (code === 0) {
            console.log(data[data.length - 1]);
        } else {
            console.log(data.join(""));
        }
        done();
    });
});

gulp.task('watch', function watch() {
    return gulp.watch(["./**/*.ts", "!./node_modules"], gulp.series("compile", "tests"));
});