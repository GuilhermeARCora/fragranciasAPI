const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

const connect = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {
    dbName: 'test-db'
  });
};

const cleanup = async () => {
  // limpa coleções entre testes
  const { collections } = mongoose.connection;
  // eslint-disable-next-line no-restricted-syntax
  for (const name of Object.keys(collections)) {
    // eslint-disable-next-line no-await-in-loop
    await collections[name].deleteMany({});
  }
};

const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
};

module.exports = {
  disconnect,
  connect,
  cleanup
};
