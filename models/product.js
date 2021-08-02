const pool = require('../util/database');
const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const text = 'INSERT INTO products (title, price, description) VALUES ($1, $2, $3) RETURNING id';
    const values = [this.title, this.price, this.description];
    
    return pool.query(text, values);
  }

  static deleteById(id){ 
  }

  static fetchAll() {
    return pool.query('SELECT * FROM PRODUCTS');
  }

  static findById(id) {
    return pool.query('SELECT * FROM PRODUCTS WHERE id = $1',[id]);
  }
};
