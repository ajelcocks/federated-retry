This is an example of using federated modules with dynamic imports

It demonstrates that if a remote is not available when the app first starts then trying to reload the remote once it is available has no effect
because the result of the initial dynamic import is cached

The browser (entire application) must be refreshed

# Start app1

Open terminal to app1 folder

```
npm install
npm run start
```

open browser to http://localhost:3001

See reload button

Open terminal to app2

```
npm install
npm run start
```

app2 > npm run start

Adding a debugger statement before the dynamic import in app1/src/App.js allows us to step into the webpack code in main.js

main.js has the following code at or near line 290...

```js
function __webpack_require__(moduleId) {
	// Check if module is in cache
	var cachedModule = __webpack_module_cache__[moduleId];
	if (cachedModule !== undefined) {
		if (cachedModule.error !== undefined) throw cachedModule.error;
		return cachedModule.exports;
	}
	// Create a new module (and put it into the cache)
	var module = __webpack_module_cache__[moduleId] = {
		id: moduleId,
		loaded: false,
		exports: {}
	};

	// Execute the module function
	try {
		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
		module = execOptions.module;
		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
	} catch(e) {
		module.error = e;
		throw e;
	}

	// Flag the module as loaded
	module.loaded = true;

	// Return the exports of the module
	return module.exports;
```

Clicking the reload button and stepping through the code from the debugger to the line after cachedModule is allocated
reveals that the object created in the initial (failed) import and now stored in __webpack_module_cache__ has the following attributes (amongst others)

```json
{
  "error": {
    "message": "Loading script failed.\n...",
    "name": "ScriptExternalLoadError",
    "request": "http://localhost:3002/remoteEntry.js",
    "type": "error"
  },
	"id" : "webpack/container/remote/app2/App2Button",
  "loaded": false
}
```

As a result the following code ...

```js
	if (cachedModule !== undefined) {
		if (cachedModule.error !== undefined) throw cachedModule.error;
		return cachedModule.exports;
	}
```
results in the error always being reported. There is now no way of reloading the import once the remote is available.

If only it did a retry if the error was present or loaded === false

There is no apparent way to override this and force a retry