require('dotenv').config();
const { MongoClient } = require("mongodb");

const username = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const clusterUrl = process.env.MONGODB_CLUSTERURL;
const database = process.env.MONGODB_DATABASE;

const uri =
  `mongodb+srv://${username}:${password}@${clusterUrl}/${database}?retryWrites=true&w=majority`;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(uri)
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;