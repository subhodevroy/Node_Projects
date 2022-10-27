const express=require('express')
const path=require('path')
const { body } = require('express-validator')
const adminController=require("../controller/admin")
const isAuth=require('../middleware/is-auth');
 const router=express.Router();
 
router.get('/add-product',isAuth,adminController.getAddProduct);
router.get('/products',isAuth,adminController.getAllProducts);

router.post('/add-product',
[
    body('title','Title should be atleast 3')
       .trim()
        .isString()       
        .isLength({min:3}),        
   // body('imageUrl','Invalid URL').isURL(),
        
    body('price','Invalid Price')
        .isFloat(),
    body('description','Description should be between 5-400')
        .trim()
        .isLength({min:5,max:400})        
]
,isAuth,adminController.postAddProduct)
router.post('/edit-product',
[
    body('title','Title should be atleast 3')
       .trim()
        .isString()        
        .isLength({min:3}),        
   // body('imageUrl','Invalid URL').isURL(),
    body('price','Invalid price').isFloat(),
   
    body('description','Description should be between 5-400')
        .trim()
        .isLength({min:5,max:400})        
]
,isAuth,adminController.postEditProduct);
//router.post('/delete-product',isAuth,adminController.postDeleteProduct);
router.delete('/product/:productId',isAuth,adminController.deleteProduct);
router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);
exports.routes=router;
