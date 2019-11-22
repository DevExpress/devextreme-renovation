const compile = require("../component-compiler")

before(function() {
    compile(`${__dirname}\\declarations`, `${__dirname}/componentFactory`);
});
