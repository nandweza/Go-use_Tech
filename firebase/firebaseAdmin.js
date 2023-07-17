// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const firebaseConfig = require("./firebaseConfig");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: firebaseConfig.storageBucket,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
