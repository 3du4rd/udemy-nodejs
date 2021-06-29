const fs = require('fs');
const path = require('path');

module.exports = class Product{
    constructor(title){
        this.title = title;
    }

    save(){
        //products.push(this);
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, (err,fileContent) =>{
            let products = [];
            if (!err){
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.error(err);
            });            
        });
    }

    static fetchAll(callback){
        const p = path.join( path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile( p, (err,fileContent) =>{
            if (err){
                callback([]);
            }
            callback(JSON.parse(fileContent));
        });        
    }

}