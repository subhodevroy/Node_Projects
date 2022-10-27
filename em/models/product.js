import mongoose from 'mongoose';
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        lowercase:true,
        enum:['fruit','vegetable','diary']
    },
    farm:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'farm'
    }
})
const product=mongoose.model('product',productSchema);
export{product};