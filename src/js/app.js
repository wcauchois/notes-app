var PouchDB = require('pouchdb');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/build/worker.js', {scope: '/'})
    .then(function(reg) {
      console.log("%cService worker registration succeeded", "color: green");
    })
    .catch(function(error) {
      console.log("%cRegistration failed with " + error, "color: red");
    });
}

