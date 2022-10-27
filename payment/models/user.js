const mongoose=require('mongoose')
//const Product=require('./product');
const userSchema=new mongoose.Schema({   
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    cart:{
        items:[{
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }]
    }
});

userSchema.methods.addToCart=function(product){
    //console.log("Inside add to cart",this);
    const cartProductIndex=this.cart.items.findIndex(cp=>{
        return cp.productId.toString() === product._id.toString();
    })
    let netQuantity=1
    const updatedCartItems=[...this.cart.items];
    if(cartProductIndex >=0)
    {
        netQuantity=this.cart.items[cartProductIndex].quantity+1
        updatedCartItems[cartProductIndex].quantity=netQuantity;
    }
    else{
        updatedCartItems.push({productId:product._id,quantity:netQuantity})
    }
    const updatedCart={items:updatedCartItems};
    this.cart=updatedCart;
   return this.save();
}
userSchema.methods.deleteItemFromCart=function(prodId){
    const updatedCartItems=this.cart.items.filter(item=>{
        return item.productId.toString() !==prodId.toString();
    })
    const updatedCart={items:updatedCartItems};
    this.cart=updatedCart;
   return this.save();
}
userSchema.methods.clearCart=function(){
    this.cart={items:[]};
    return this.save();
}
module.exports=mongoose.model('User',userSchema);

/*for mongodb
const getdb=require('../utils/database').getdb;
const mongodb=require('mongodb');
class User{
    constructor(username,email,cart,id){
        this.name=username;
        this.email=email;
        this.cart=cart;
        this._id=id;
    }
    save(){
        const db=getdb();
       return db.collection('user').insertOne(this);
    }
    addToCart(product){
        //console.log(product._id);
        const cartProductIndex=this.cart.items.findIndex(cp=>{
            return cp.productId.toString() === product._id.toString();
        })
        let netQuantity=1
        const updatedCartItems=[...this.cart.items];
        if(cartProductIndex >=0)
        {
            netQuantity=this.cart.items[cartProductIndex].quantity+1
            updatedCartItems[cartProductIndex].quantity=netQuantity;
        }
        else{
            updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:netQuantity})
        }
        const updatedCart={items:updatedCartItems};
        const db=getdb();
       return db.collection('users').updateOne({
            _id: new mongodb.ObjectId(this._id)
        },
        {$set:{cart:updatedCart}})
    }
    static findById(userId){
        const db=getdb();
        return db.collection('users').findOne({_id:new mongodb.ObjectId(userId)})
                .then(user=>{
                   // console.log(user);
                    return user;
                })
                .catch(err=>console.log(err));
    }
    getCart() {
        const db = getdb();
        const productIds = this.cart.items.map(i => {
          return i.productId;
        });
        return db
          .collection('products')
          .find({ _id: { $in: productIds } })
          .toArray()
          .then(products => {
            return products.map(p => {
              return {
                ...p,
                quantity: this.cart.items.find(i => {
                  return i.productId.toString() === p._id.toString();
                }).quantity
              };
            });
          });
      }
      deleteItemFromCart(prodId){
        const updatedCart=this.cart.items.filter(item=>{
            return item.productId.toString() !==prodId.toString();
        })
            const db = getdb();
            return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{items:updatedCart}}});
    }
    addOrder(){
        const db = getdb();
       return this.getCart().then(products=>{
            const order={
                items:products,
                user:{
                    _id:new mongodb.ObjectId(this._id),
                    name:this.name
                }
            }
            return db.collection('orders').insertOne(order)   
        })               
                .then(result=>{
                    this.cart={items:[]};
                    return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{items:[]}}});
                })
                .catch(err=>console.log(err));
    }
    getOrders(){
        const db = getdb();
        return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray()
                
    }

}
*/

/*const Sequelize=require('sequelize')
const sequelize=require('../utils/database')
const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:Sequelize.STRING
});
*/
//module.exports=User;