// LIBRARY FUNCTIONS
let methods = {};

// import node modules
const chalk = require('chalk');
const ejs = require('ejs');
const exec = require('child_process');
const fs = require('fs-extra');
const glob = require('glob-all');

// Synchronously run a function and wait for a callback to fire
methods.asyncFunction = async function asyncFunction(startMessage, endMessage, func) {
  methods.log('title', startMessage);

  const p = await new Promise(resolve => {
    func(resolve);
  }).then(() => '');
  methods.log('title', endMessage);
  return p;
};

// Compile EJS files and move them to destination directory
methods.globEjs = function globEjs(pattern, replaceSrc, replaceDist, callback, verbose = false) {
  glob(pattern, { dot:true, nodir: true }, function (er, files) {
    let count = files.length;
    if (count > 0) {
      files.forEach((item) => {
        ejs.renderFile(item, ejsVars, {}, function(err, str) {
          if (err) {
            methods.log('warn', err);
          }
          fs.outputFile(item.replace(replaceSrc, replaceDist), str, (err) => {
            if(!err) {
              methods.log('verbose', `Compiled ${ item } → ${ item.replace(replaceSrc, replaceDist) }`, verbose);
              count--;
              if (count === 0) {
                callback();
              }
            }
          });
        });
      });
    } else {
      callback();
    }
  });
}

// Move files to destination directory
methods.globMove = function globMove(pattern, replaceSrc, replaceDist, callback, verbose = false) {
  glob(pattern, { dot:true, nodir: true }, function (er, files) {
    let count = files.length;
    if (count > 0) {
      files.forEach((item) => {
        fs.move(item, item.replace(replaceSrc, replaceDist), { overwrite: true }).then(() => {
          methods.log('verbose', `Moved ${ item } → ${ item.replace(replaceSrc, replaceDist) }`, verbose);
          count--;
          if (count === 0) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  });
}

// Remove files
methods.globRemove = function globRemove(pattern, callback, verbose = false) {
  glob(pattern, { dot:true, nodir: true }, function (er, files) {
    let count = files.length;
    if (count > 0) {
      files.forEach((item) => {
        fs.remove(item).then(() => {
          methods.log('verbose', `Removed ✄ ${ item }`, verbose);
          count--;
          if (count === 0) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  });
}

// display a message in the command line
methods.log = function log(type = 'message', message, verbose = false) {
  switch (type) {
    case 'app':
      console.log(chalk.bgRgb(230, 20, 20)(`  ${message}  `));
      break;
    case 'dump':
      if (verbose) {
        console.log(chalk.magenta.bold(`📦 ${JSON.stringify(message, null, 2)}`));
      }
      break;
    case 'running':
      console.log(chalk.green.bold(`💻 ${chalk.green(message)}`));
      break;
    case 'title':
      console.log(chalk.blue.bold(`🛠 ${message}`));
      break;
    case 'verbose':
      if (verbose) {
        console.log(chalk.keyword('orange')(`👓 ${message}`));
      }
      break;
    case 'warn':
      console.warn(chalk.red.bold(`❗️ ${message}`));
      break;
    default:
      console.log(message);
  }
};

// parse process arguments into an array format
methods.parseArgv = function parseArgv() {
  let args = [];
  let options = {};

  process.argv.forEach(function(arg, i) {
    if (i > 1) {
      if (arg.substr(0, 2) === '--') {
        // remove leading dashes
        const str = arg.substr(2);

        // split out to key/value pairs
        if (str.indexOf('=') !== -1) {
          const strSplit = str.split('=');
          options[strSplit[0]] = strSplit[1];
        } else {
          options[str] = true;
        }
      } else {
        args.push(arg);
      }
    }
  });

  return {
    args: args,
    options: options,
  };
};








// PREBUILD
methods.prebuildClean = function prebuildClean(callback, paths, verbose) {
  glob(`${paths.js.src}automated/dev/**/*`, function(er, files) {
    methods.log('verbose', `Removing Files: ${JSON.stringify(files, null, 2)}`, verbose);
    let count = files.length;

    if (count > 0) {
      files.forEach((item) => {
        fs.remove(item, err => {
          if (err) {
            return console.error(err);
          }

          count--;
          if (count === 0) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  });
};

methods.prebuildConfigToEsm = function prebuildConfigToEsm(callback, paths, config, outputFilename, verbose) {
  const options = {
    config: config,
  };

  ejs.renderFile(`${paths.wb.templates}_js/config.js`, options, {}, function(err, str) {
    if (err) {
      methods.log('warn', err);
    }
    fs.outputFile(paths.js.src + `automated/${outputFilename}.js`, str, (err) => {
      if (!err) {
        methods.log('verbose', `JS templates compiled: automated/${outputFilename}.js`, verbose);
        callback();
      }
    });
  });
};

methods.prebuildWbConfig = function prebuildWbConfig(callback, paths, wb, verbose) {
  const clonedWb = Object.assign({}, wb);
  delete clonedWb.paths;

  const options = {
    config: clonedWb,
  };

  ejs.renderFile(`${paths.wb.templates}_js/config.js`, options, {}, function(err, str) {
    if (err) {
      methods.log('warn', err);
    }
    fs.outputFile(paths.js.src + 'automated/wb.js', str, (err) => {
      if (!err) {
        methods.log('verbose', `JS templates compiled: wb.js`, verbose);
        callback();
      }
    });
  });
};

// Usage: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
methods.randomString = function randomString(length, chars) {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

methods.slugify = function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

methods.snake = function snake(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '_')           // Replace spaces with _
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '_')         // Replace multiple - with single _
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Determine if a command should be displayed in terminal when running shell commands
methods.verboseExec = function verboseExec(command, verbose = false) {
  if (verbose) {
    methods.log('running', command);
    exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
  } else {
    exec.execSync(`${command} > /dev/null 2>&1`);
  }
};

// INIT
module.exports = methods;
