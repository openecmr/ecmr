/*
  this file will loop through all js modules which are uploaded to the lambda resource,
  provided that the file names (without extension) are included in the "MODULES" env variable.
  "MODULES" is a comma-delimmited string.
*/

let modulesEnv = process.env.MODULES;
if (modulesEnv) {
  modulesEnv = 'custom';
}

exports.handler = (event, context, callback) => {
  const modules = modulesEnv.split(',');
  for (let i = 0; i < modules.length; i += 1) {
    console.log(modules[i])
    const { handler } = require("./" + modules[i]);
    handler(event, context, callback);
  }
};
