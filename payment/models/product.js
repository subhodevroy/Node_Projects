const mongoose=require('mongoose')
//const User=require('./user')
const productSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
});
module.exports=mongoose.model('Product',productSchema);


/*for mongodb
const mongodb=require('mongodb')
const getdb=require('../utils/database').getdb;
class Product {
  constructor(title,imageUrl,description,price,id,userId) {
    
    this.title = title;
    this.imageUrl=imageUrl;
    this.description=description;
    this.price=price;
    this._id=id?new mongodb.ObjectId(id):null;
    this.userId=userId;
  } 
 
save() {
  const db=getdb();
  let dbOp;
 //console.log((this._id));
  if(this._id)
  {
    //Update product
    dbOp=db.collection('products').updateOne({_id:this._id},{$set:this});
  }
  else{
    dbOp=db.collection('products').insertOne(this);
  }
  return dbOp 
    .then(result=>{
      //console.log(result);
    }) 
    .catch(err=>{
      console.log(err);
    })
  }
  static fetchAll(){
    const db=getdb();
    return db.collection('products').find().toArray()
            .then(products=>{
              //console.log(products);
              return products;
            })
            .catch(err=>{
              console.log(err);
            })
  }
  static findById(prodId){
    const db=getdb();
    return db.collection('products').find({_id:new mongodb.ObjectId(prodId)}).next()
                .then(product=>{
                  //console.log(product);
                  return product;
                })
                .catch(err=>{
                  console.log(err);
                })
  }
  static deleteById(prodId){
    const db=getdb();
    return db.collection('products').deleteOne({_id:new mongodb.ObjectId(prodId)})
            .then(result=>{
              console.log("Deleted")
            })
            .catch(err=>{
              console.log(err);
            })
  }
}
*/

/* for  files
const fs = require('fs');
const path = require('path');
const rootDir=require('../utils/path');

const db=require('../utils/database')
const Cart = require('./cart');
const p = path.join(
  rootDir,
  'data',
  'products.json'
);

const getProductsFromFile=(cb)=>{
  
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    }
    cb(JSON.parse(fileContent));
  });
}
*/

/* for files and mysql
module.exports = class Product {
  constructor(title,imageUrl,description,price,id) {
    
    this.title = title;
    this.imageUrl=imageUrl;
    this.description=description;
    this.price=price;
    this.id=id;
  }
 */ 

/* for files
  save() {
    getProductsFromFile(products => {
      //console.log(products);
      if (this.id) {
        //console.log(this.id)
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
       // console.log(existingProductIndex);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          if(err)
          {
            console.log(err);
          }
          
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          if(err)
          {
            console.log(err);
          }
        });
      }
    });
  }


  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static findById(id,cb){
    getProductsFromFile(products=>{
      const product=products.find(p=>p.id===id);
      cb(product);
    })
  }
  static deleteById(id){
    getProductsFromFile(products=>{
      const product=products.find(p=>p.id===id);
      //console.log(product);
      const updatedproduct=products.filter(p=>p.id!==id);
      fs.writeFile(p, JSON.stringify(updatedproduct), err => {
        if(!err)
        {
          Cart.deleteProduct(id,product.price);
        }
      });
    })
  }
*/

/*for mySQL database
save(){
 return db.execute('INSERT INTO products(title,price,description,imageUrl) VALUES(?,?,?,?)',[this.title,this.price,this.description,this.imageUrl]);
}
static deleteById(id){

}

static fetchAll(){
  return db.execute('SELECT * FROM products');
    
}
static findById(id)
{
  return db.execute('SELECT * FROM products where products.id=?',[id]);
}

};
*/

/*for sequelize
const Sequelize=require('sequelize');
const sequelize=require('../utils/database')

//defining product model
const Product=sequelize.define('product',{
  id:{
   type:Sequelize.INTEGER,
   autoIncrement:true,
   allowNull:false,
   primaryKey:true 
  },
  title:{
    type: Sequelize.STRING,
    allowNull:false
  },
  price:{
    type:Sequelize.DOUBLE,
    allowNull:false,
  },
  imageUrl:{
    type:Sequelize.STRING,
    allowNull:false
  },
  description:{
    type:Sequelize.STRING,
    allowNull:false
  }

})
*/
//module.exports=Product;