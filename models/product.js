const fs = require('fs');
const path = require('path');

const p = path.join( path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = callback => {
        fs.readFile( p, (err,fileContent) =>{
            if (err){
                callback([]);
            } else{
                callback(JSON.parse(fileContent));
            }
        });  
}

module.exports = class Product{
    constructor(title){
        this.title = title;
    }

    save(){
        getProductsFromFile( products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.error(err);
            });
        });
    }

    static fetchAll(callback){
        getProductsFromFile(callback);              
    }

}