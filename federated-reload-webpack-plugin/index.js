'use strict'
const JavascriptModulesPlugin = require("webpack/lib/javascript/JavascriptModulesPlugin");

const FEDERATED_RELOAD = '__federated_reload';

class FederatedReloadWebpackPlugin {
  constructor(options) {
    this._options = options;
    this._remotes = options.remotes;
  }

  __federated_reload = (moduleId, cache, remotes) => {
    var WEBPACK_CONTAINER = 'webpack/container/';
    if(remotes) {
      //TODO: How can we determine this call is for one of the remotes?
      try {
        const module = cache[moduleId];
        if(parseInt(moduleId) !== NaN) {
          // Cache key is a number. Seen in an angular 14 project
          if(module && module.exports && module.exports.__zone_symbol__value && module.exports.__zone_symbol__value.type === 'error') {
            // Previous call failed. 
            delete cache[moduleId];
          } else if(module && !module.loaded) {
            // Previous call failed.
            delete cache[moduleId];
          }
        } else {
          // Cache key is a string. Seen in a react 18 project
          remotes.forEach((appName) => {
            const referenceId = `${WEBPACK_CONTAINER}reference/${appName}`;
            const remoteId = `${WEBPACK_CONTAINER}remote/${appName}`;
          
            if(moduleId && moduleId.startsWith && moduleId.startsWith(remoteId)) {
              Object.keys(cache).forEach((key) => {
                if(key.match(`^${referenceId}|^${remoteId}`)) {
                  const cachedModule = cache[key];
                  if (cachedModule !== undefined && !cachedModule.loaded) {
                    delete cache[referenceId];
                    delete cache[moduleId];
                  }
                }
              });
            }
          })
        }
      } catch(e) {
        console.warn(`federated-reload-webpack-plugin: reload failed`, e);
      }
    }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('FederatedImportReload', (compilation) => {
    try {
        // This gets inserted above the webpack function that detects the cached modules
        compilation.mainTemplate.hooks.localVars.tap('Require', (source) => {
          return `var ${FEDERATED_RELOAD} = ${this.__federated_reload}`;
        });

        // This gets inserted inside of and before code in the webpack function that processes dynamic imports
        compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderRequire.tap("Resolve", (source) => {
          return `var remotes = ['${this._remotes.join("','")}'];
${FEDERATED_RELOAD}(moduleId, __webpack_module_cache__, remotes);
${source}`;
        });
      } catch(e) {
        console.log(`federated-reload-webpack-plugin: inserting code block failed`, e);
      }
    });
  }
};

module.exports = FederatedReloadWebpackPlugin