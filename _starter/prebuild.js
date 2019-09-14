// import global functions
const g = require('./global.js');

// load package file
let pkg = require(`${ process.cwd() }/package.json`);

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runCssTemplates = argv.options.csstemplates || false,
      runPrettier     = argv.options.prettier || false,
      runScssIncludes = argv.options.scssincludes || false,
      verbose         = pkg.overrideVerbose || argv.options.verbose || false;

// set variables based on pkg options
let paths = g.getPaths(pkg.paths);
let ejsVars = Object.assign({
    paths: paths,
    pkg: pkg,
}, pkg.ejs);

async function run() {
    if (runPrettier) {
        g.prebuildPrettier(pkg.prettier, null, verbose);
    }
    if (runCssTemplates) {
        const cssTemplates = g.asyncFunction(
            `Compiling CSS Templates`, `CSS Templates Compiled`, (resolve) => {
                g.prebuildCssTemplates(resolve, paths, ejsVars, verbose);
            }
        );
        let cssTemplatesComplete = await cssTemplates;
    }

    if (runScssIncludes) {
        const scssIncludes = g.asyncFunction(
            `Combining SCSS Files`, `SCSS Files Combined`, (resolve) => {
                g.prebuildScssIncludes(resolve, paths, verbose);
            }
        );
        let scssIncludesComplete = await scssIncludes;
    }
}

run();