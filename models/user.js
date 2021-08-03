const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
    //this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('users')
      .find()
      .toArray()
      .then(users => {
        return users;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new mongodb.ObjectId(userId) })
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findByName(userName) {
    const db = getDb();
    return db
      .collection('users')
      .find({ name: userName })
      .next()
      .then(user => {
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .deleteOne({ _id: new mongodb.ObjectId(userId) })    
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

}
  
module.exports = User;