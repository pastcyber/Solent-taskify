const admin = require('firebase-admin')

const serviceAccount = require('./task-management-cffc1-firebase-adminsdk-cvmby-570fa137f8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports =  db