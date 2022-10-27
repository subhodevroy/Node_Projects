import express from 'express';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { product } from './models/product.js';
import { farm } from './models/farm.js';
import path from 'path';
var methodOverride = require('method-override');
import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/farmstand2')
.then(()=>{
    console.log("Connection open")
})
.catch(err=>{
console.log("ERRor",err);
})
const categories=['fruit','vegetable','diary'];
const app=express();
app.use(methodOverride('_method'))
const __dirname = path.resolve();
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.send("HI");
})
app.use(express.urlencoded({ extended: true}))
//Farm Routes
app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})
app.get('/farms',async(req,res)=>{
    
        const Farm=await farm.find({});
        res.render('farms/index',{Farm});
    
})
app.post('/farms',async(req,res)=>{
    const newp=new farm(req.body);
    await newp.save();
    res.redirect(`/farms`);
})



//Product Routes

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const Product = await product.find({ category })
        res.render('products/index', { Product, category })
    } else {
        const Product = await product.find({})
        res.render('products/index', { Product, category: 'All' })
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/newproduct', { categories })
})

app.post('/products', async (req, res) => {
    const newproduct = new product(req.body);
    res.send(req.body);
    await newproduct.save();
    res.redirect(`/products/${newproduct._id}`)
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const Product = await product.findById(id)//.populate('farm', 'name');
    res.render('products/show', { Product })
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const Product = await product.findById(id);
    res.render('products/edit', { Product, categories })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const Product = await product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${Product._id}`);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000,()=>{
    console.log("App is listening");
})