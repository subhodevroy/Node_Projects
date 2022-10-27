/*for sequelize
const Sequelize=require('sequelize');
const sequelize=require('../utils/database')
const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }
});
module.exports=Order;
*/
const mongoose=require('mongoose')
const orderSchema = new mongoose.Schema({
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    user: {
      email: {
        type: String,
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    }
  });
module.exports=mongoose.model('Order',orderSchema);