const express=require('express')
const path=require('path')

const rootDir=require('../utils/path')
const shopController=require("../controller/shop")
const isAuth=require('../middleware/is-auth');
const router=express.Router();
router.get('/',shopController.getIndex);
router.get('/products',shopController.getProducts);
router.get('/products/:productId',shopController.getProduct);
router.get('/cart',isAuth,shopController.getCart);
router.post('/cart',isAuth,shopController.postCart);
router.post('/cart-delete-item',isAuth,shopController.postCartDelete);
router.post('/create-order',isAuth,shopController.postOrder);
// router.get('/checkout',shopController.getCheckOut);
router.get('/orders',isAuth,shopController.getOrders);
router.get('/orders/:orderId',isAuth,shopController.getInvoice);
module.exports=router;