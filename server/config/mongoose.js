const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

const config = require('./config');

// connect to mongo db
let mongoUrl = '';
if (!config.mongo.host) {
  console.error('mongo host is missing');
} else if (!config.mongo.port) {
  console.error('mongo port is missing');
} else if (!config.mongo.database) {
  console.error('mongo database is missing');
} else if (config.mongo.username && config.mongo.password) {
  mongoUrl =
    'mongodb://' +
    config.mongo.username +
    ':' +
    config.mongo.password +
    '@' +
    config.mongo.host +
    '/' +
    config.mongo.database;
} else {
  mongoUrl = 'mongodb://' + config.mongo.host + '/' + config.mongo.database;
}
console.log('mongoUrl', mongoUrl);
mongoose.connect(mongoUrl, { keepAlive: 1 });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUrl}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}
