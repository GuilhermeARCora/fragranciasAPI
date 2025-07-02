const {ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

module.exports = mongoose.connect(DB, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}).then(console.log('DB connection sucessful!'));