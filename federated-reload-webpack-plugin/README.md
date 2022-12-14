# Dynamic import

Webpack creates a cache of dynamically imported modules.

This can be a problem when using federated modules since the load can fail at runtime because
the code generated by webpack will return the failure if the dynamic import is re-executed.

This plugin removes the failed import from the webpack cache, forcing a reload.

# Debugging

Use the App1 and federated-reload-webpack-plugin projects to debug

- Make changes to index.js in federated-reload-webpack-plugin

- (re-)start app1, e.g. Task >  Start App1

  do this every time a change is made and saved, so that the changes will be compiled into app1

- start browser in debug.
  Use launch config in vs code debug, e.g. App1 (federated-retry)

- open inspector and set break in main.js, do a find for __federated_retry

- Click the reload button (assuming app2 is not running)