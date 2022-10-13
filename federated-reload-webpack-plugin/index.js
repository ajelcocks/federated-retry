'use strict'
const JavascriptModulesPlugin = require("webpack/lib/javascript/JavascriptModulesPlugin");

const FEDERATED_RELOAD = '__federated_reload';

class FederatedReloadWebpackPlugin {
  constructor(options) {
    this._options = options;
    this._remotes = options.remotes;
  }

  // This gets translated to a string in the tap('Require' method inside the apply method (below)
  __federated_reload = (moduleId, cache, remotes) => {
    var WEBPACK_CONTAINER = 'webpack/container/';
    if(remotes) {
      remotes.forEach((appName) => {
        const referenceId = `${WEBPACK_CONTAINER}reference/${appName}`;
        const remoteId = `${WEBPACK_CONTAINER}remote/${appName}`;
      
        if(moduleId && moduleId.startsWith(remoteId)) {
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
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('FederatedImportReload', (compilation) => {
    try {
        // This gets inserted above the webpack function that detects the cached modules
        compilation.mainTemplate.hooks.localVars.tap('Require', (source) => {
          return `
    var ${FEDERATED_RELOAD} = ${this.__federated_reload}
`;
        });

        // This gets inserted inside of and before code in the webpack function that processes dynamic imports
        compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).renderRequire.tap("Resolve", (source) => {
          return `
    var remotes = ['${this._remotes.join("','")}'];
    ${FEDERATED_RELOAD}(moduleId, __webpack_module_cache__, remotes);
    ${source}
`;
        });
      } catch(e) {console.log(e);}
    });
  }
};

module.exports = FederatedReloadWebpackPlugin