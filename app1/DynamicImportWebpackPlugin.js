class DynamicImportWebpackPlugin {
  constructor(options) {
    this._options = options;
  }

  __nuance__require__ = (moduleId, cache) => {
    const referenceId = "webpack/container/reference/app2";
    const remoteId = "webpack/container/remote/app2";
  
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
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('NuanceImport', (compilation) => {
      compilation.mainTemplate.hooks.localVars.tap('Require', (source) => {
        return `
          // Nuance Import Plugin
          var __nuance__require__ = ${this.__nuance__require__}
          `;
      });
      compilation.mainTemplate.hooks.require.tap("Resolve", (source) => {
        return `
          // Nuance import plugin
          __nuance__require__(moduleId, __webpack_module_cache__);
          ${source}
        `;
      });
    });
  }
};

module.exports = DynamicImportWebpackPlugin