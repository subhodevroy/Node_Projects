import mongoose from 'mongoose';
const farmSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Farm must have a name!']
    },
    city:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Email required']
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        }
    ]
})
const farm=mongoose.model('farm',farmSchema);
export {farm};
