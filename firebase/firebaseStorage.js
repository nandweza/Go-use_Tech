// firebaseStorage.js
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const firebaseConfig = require("./firebaseConfig");

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
