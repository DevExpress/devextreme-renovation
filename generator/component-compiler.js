const ts = require("typescript");
const fs = require("fs");
const { generateFactoryCode } = require("./factoryCodeGenerator");

function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
          var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
      }
  };

module.exports = function compile(dir, outDir) {
    if (fs.existsSync(outDir)) {
        deleteFolderRecursive(outDir);
    }
    fs.mkdirSync(outDir);
    fs.readdirSync(dir, { withFileTypes: "tsx" }).forEach(({ name }) => {
        const source = ts.createSourceFile(name, fs.readFileSync(`${dir}/${name}`).toString(), ts.ScriptTarget.ES2015, true);
        const factoryCode = generateFactoryCode(ts, source);
        fs.writeFileSync(`${outDir}/${name.replace(".tsx", ".js")}`, factoryCode);
    })
}
