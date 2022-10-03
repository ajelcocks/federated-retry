const FEDERATED_RELOAD = '__federated_reload';

class DynamicImportWebpackPlugin {
  constructor(options) {
    this._options = options;
    this._remotes = options.remotes;
  }

  // This gets translated to a string in the tap('Require' method inside the apply method (below)
  __federated_require = (moduleId, cache, remotes) => {
    const WEBPACK_CONTAINER = 'webpack/container/';
    remotes.forEach((appName) => {
      const referenceId = `${WEBPACK_CONTAINER}reference/${appName}`;
      const remoteId = `${WEBPACK_CONTAINER}remote/${appName}`;
    
      if(moduleId.startsWith(remoteId)) {
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

  apply(compiler) {
    compiler.hooks.compilation.tap('DynamicImportReload', (compilation) => {
      // This gets inserted above the webpack function that detects the cached modules
      compilation.mainTemplate.hooks.localVars.tap('Require', (source) => {
        return `
          var ${FEDERATED_RELOAD} = ${this.__federated_require}
          `;
      });
      // This gets inserted inside of and before code in the webpack function that processes dynamic imports
      compilation.mainTemplate.hooks.require.tap("Resolve", (source) => {
        return `
          const remotes = ['${this._remotes.join("','")}'];
          ${FEDERATED_RELOAD}(moduleId, __webpack_module_cache__, remotes);
          ${source}
        `;
      });
    });
  }
};

module.exports = DynamicImportWebpackPlugin