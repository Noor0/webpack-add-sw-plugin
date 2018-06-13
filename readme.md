## webpack-add-sw-plugin

A webpack plugin to incorporate your own service worker to your build process by adding a unique hash for cache versioning and adding all the emitted assets.

### installation
``` yarn add -D webpack-add-sw-plugin ```
or
``` npm install --save-dev webpack-add-sw-plugin ```

### usage
require and add the plugin inside our webpack.config.js
```
const AddSW = require('webpack-add-sw-plugin');
module.exports {
	...
	plugin: [
		new AddSW({
			src: './src/sw.js',					// path to your service worker
			filename: 'service-worker.js'		// name of the emitted service worker by the plugin (a service worker with the name `service-worker.js` will be created inside your output directory)
		})
	]
}
```

consider the following directory structure
```
- src
-- *other files and folders*
-- sw.js
- node_modules
- package.json
- webpack.config.js
```

`%VERSION%` will be replaced by a unique hash & `%ASSETS%` will be replaced an array of paths to the emitted assets.
```
/* src/sw.js */

const cacheVersion =  '%VERSION%';
const assets =  %ASSETS%;

self.addEventListener('install', event  => {
	event.waitUntil(
		caches.open(cacheVersion)
			.then(cache  => cache.addAll(assets))
			.then(self.skipWaiting())
	);
});

self.addEventListener('fetch', event  => {
	event.respondWith(
		caches.match(event.request).then(cachedResponse  => {
		if (cachedResponse) {
			return cachedResponse;
		} else 
			throw new Error(':(')
	);
});
```
#### Note
register the service worker as you normally would in your any other js file but make sure that you register using the `filename` that you used in the options of the plugin in your `webpack.config.js`.