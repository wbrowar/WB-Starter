// import node modules
const _ = require('lodash');

// import global functions
const g = require('./functions.js');

// load config files
let wb = require(`${ process.cwd() }/wb.config.js`);

// set constants
const argv = g.parseArgv();

// use CLI arguments to set variables
const runMarketoVariables = argv.options.marketovars || false,
      verbose             = argv.options.verbose || false;

// set variables based on wb options
let ejsVars = _.merge({
    paths: wb.paths,
    wb: wb,
}, wb.ejs);

async function run() {
    if (runMarketoVariables) {
        const marketoVariables = g.asyncFunction(
            `Adding Marketo Variables to index.html`, `Marketo Variables added to index.html`, (resolve) => {
                g.postbuildMarketoVariables(resolve, wb.paths, ejsVars, verbose);
            }
        );
        let marketoVariablesComplete = await marketoVariables;
    }
}

run();