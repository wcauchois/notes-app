var PouchDB = require('pouchdb');

function swLog(m) {
  console.log("%c" + m, "font-style: italic");
}

swLog("Hi from the service worker");

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.entry.js',
        '/favicon.ico',
        '/vendor/bootstrap.min.css',
        '/vendor/bootstrap.min.js',
        '/vendor/jquery-3.1.1.slim.min.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // Attempts to fetch live resource first.
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    }).then(function(response) {
      /*
      caches.open('v1').then(function(cache) {
        cache.put(event.request, response);
      });
      */
      return response.clone();
    })
  );
});

self.addEventListener('message', function(event) {
  console.log("Handling message event:", event);
});

