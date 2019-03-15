// At the top of test/index.test.js
const testLuminous = require('firebase-functions-test')({
  databaseURL: 'https://luminous-fire-6577.firebaseio.com',
  storageBucket: 'luminous-fire-6577.appspot.com',
  projectId: 'luminous-fire-6577',
}, '../../src/environments/secrets.luminous-fire-6577-da78feb8be71.json');