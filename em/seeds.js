import mongoose from 'mongoose';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import {product} from './models/product.js';
mongoose.connect('mongodb://localhost:27017/farmstand2')
.then(()=>{
    console.log("Connection open")
})
.catch(err=>{
console.log("ERRor",err);
})
const p=new product({
    name:'Grapes',
    price:60,
    category:'fruit'
})
p.save().then(p=>{
    console.log(p)
})
.catch(e=>{
    console.log(e)
})
const seedproduct=[
    {
        name:'Mango',
        price:120,
        category:'fruit'
    },
    {
        name:'Cabbage',
        price:40,
        category:'vegetable'
    }
]
product.insertMany(seedproduct);