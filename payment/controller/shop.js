const fs=require('fs')
const path=require('path')
const PDFDocument=require('pdfkit') //for generating pdf dynamically
const rootDir=require('../utils/path');
const Product=require('../models/product')
const User=require('../models/user')
// const Cart=require('../models/cart')
const Order=require('../models/order');
const ITEMS_PER_PAGE=2;
exports.getProducts=(req,res,next)=>{
  //for mongoose
  const page=+req.query.page || 1;
  let totalItems;
  Product.find()
  .countDocuments()
  .then(numProducts=>{
    totalItems=numProducts;
    return Product.find()
    .skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
   .then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE*page<totalItems,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)                        
    });
  })
  .catch(err=> {
    const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
  });




/*for mongodb
  Product.fetchAll()
  .then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'          
    });
  })
 .catch(err=>console.log(err));
*/

  /*for sequelize
  Product.findAll()
  .then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'          
    });
  })
 .catch(err=>console.log(err));
*/

    //res.sendFile(path.join(rootDir,'views','shop.html')); without template

  /*for files using templates
     Product.fetchAll(products => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Products',
            path: '/products'          
        });
      });
      */

     /*for mysql
     Product.fetchAll()
        .then(([rows])=>{
          //console.log(rows);
          res.render('shop/product-list', {
            prods: rows,
            pageTitle: 'All Products',
            path: '/products'        
          });
        })
        .catch(err=> console.log(err)) 
      */         

}
exports.getProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  //console.log(prodId);
  Product.findById(prodId)
    .then((product)=>{
    //console.log(product);
    res.render('shop/product-detail',{
      product:product,
      pageTitle:'Product Details',
      path:`/products`
      });
  })
  .catch(err=> {
    const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
  })

  /*for mongodb
  Product.findById(prodId)
  .then((product)=>{
    //console.log(product);
    res.render('shop/product-detail',{product:product,pageTitle:'Product Details',path:`/products`});
  })
  .catch(err=>{
    console.log(err)
  })
*/
/*for sequelize
  const prodId=req.params.productId;
  Product.findByPk(prodId)
        .then((row)=>{
          console.log(row.dataValues);
          res.render('shop/product-detail',{product:row.dataValues,pageTitle:'Product Details',path:`/products`});
        })
        .catch(err=>{
          console.log(err)
        })
*/

 /* for files
 Product.findById(prodId,product=>{
    //console.log(product);
    res.render('shop/product-detail',{product:product,pageTitle:'Product Details',path:`/products`});
  })*/

  /*for mysql
  Product.findById(prodId)
        .then(([row])=>{
          res.render('shop/product-detail',{product:row[0],pageTitle:'Product Details',path:`/products`});
        })
        .catch(err=>{
          console.log(err)
        })
   */
        
      }    
        

exports.getIndex=(req,res,next)=>{
  //for mongoose
  const page=+req.query.page || 1;
  let totalItems;
  Product.find()
  .countDocuments()
  .then(numProducts=>{
    totalItems=numProducts;
    return Product.find()
    .skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
   .then(products=>{
    res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
              path: '/',
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE*page<totalItems,
            hasPreviousPage:page>1,
            nextPage:page+1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)                        
    });
  })
  .catch(err=> {
    const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
  });

/*for mongodb
  Product.fetchAll()
  .then(products=>{
    res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
              path: '/'          
    });
  })
 .catch(err=>console.log(err));
*/

/*for sequelize
  Product.findAll()
  .then(products=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
        path: '/'          
    });
  })
 .catch(err=>console.log(err));
*/
    /*for files
    Product.fetchAll(products => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
          path: '/'          
      });
    })
    */

    /*for mysql
      Product.fetchAll()
        .then(([rows])=>{
          //console.log(rows);
          res.render('shop/index', {
            prods: rows,
            pageTitle: 'Shop',
              path: '/'          
          });
        })
        .catch(err=> console.log(err)) 
       */ 
      
        //for sequelize
       
}

exports.getCart=(req,res,next)=>{
  //console.log(req.userBody);
  
  User.findById({_id:req.userBody._id})
  .populate('cart.items.productId') //populate didn't return a promise so use this function to return a promise
.exec((err,user) => {
  if(err) {
    console.log(err);
    // const error=new Error(err);
    //     error.httpStatusCode=500;
    //     return next(error);
  }
//console.log(user.cart.items);
 const products=user.cart.items;
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    products: products
  });
})


  
  
/*for sequelize
req.userBody.getCart()
  .then(cart=>{
    return cart.getProducts()
      .then(product=>{
        res.render('shop/cart',{path:'/cart',pageTitle:'Your Cart',products:product});
      })
      .catch(err=>console.log(err))
  })
  .catch(err=>console.log(err))
*/

  /*for files
  Cart.getCart(cart=>{
    Product.fetchAll(products=>{
      const cartProducts=[]
      for(let product of products){
        const cartProductData=cart.products.find(prod=>prod.id===product.id);
        if(cartProductData)
        {
          cartProducts.push({productData:product,qty:cartProductData.qty});
        }  
        
        
      }
      res.render('shop/cart',{path:'/cart',pageTitle:'Your Cart',products:cartProducts});
    })
    
  })
    */

}
 exports.postCart = (req, res, next) => {
  const prodId=req.body.productId;
  Product.findById(prodId)
          .then(product=>{
            return req.userBody.addToCart(product);
          })
          .then(result=>{
           console.log(result);
           res.redirect('/cart');
          })
          .catch(err=> {
            const error=new Error(err);
                error.httpStatusCode=500;
                return next(error);
          });

/*for sequelize
  let fetchedCart;
  let newQuantity=1;
  req.userBody.getCart()
    .then(cart=>{
      fetchedCart=cart;
      return cart.getProducts({where:{id:prodId}});
    })
    .then(products=>{
      let product;
      if(products.length>0){
        product=products[0];
      }
     
      if(product){
        const oldQuantity=product.cartItem.quantity;
        newQuantity=oldQuantity+1;
        return product;
      }
      return Product.findByPk(prodId);
    })
      .then(product=>{
          return fetchedCart.addProduct(product,{through:{ quantity:newQuantity}});
         })    
    .then(()=>{
      res.redirect('/cart');
    })
    .catch(err=>console.log(err))
*/

  /*files
  Product.findById(prodId,product=>{
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
  */

 };

exports.postCartDelete=(req,res,next)=>{
  const prodId=req.body.productId;
  req.userBody.deleteItemFromCart(prodId)
      .then(result=>{       
          res.redirect('/cart');
      })
      .catch(err=> {
        const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
      })
//   //console.log(prodId);
//   req.userBody.getCart()
//           .then(cart=>{
//             return cart.getProducts({where:{id:prodId}});
//           })
//           .then(products=>{
//             const product=products[0];
//            return product.cartItem.destroy();
//           })
//           .then(result=>{
//             res.redirect('/cart');
//           })
//           .catch(err=>console.log(err))

// /*for files
//   Product.findById(prodId,product=>{
//    // console.log(product);
//     Cart.deleteProduct(prodId, product.price);
//   });
//   res.redirect('/cart');
//    */ 
 
}

// exports.getCheckOut=(req,res,next)=>{
//     res.render('shop/checkout',{path:'/checkout',pageTitle:'CheckOut'});
// }

exports.getOrders=(req,res,next)=>{
Order.find({'user.userId':req.session.userBody._id})
      .then(orders=>{
        //console.log(orders);
        res.render('shop/orders',
        {path:'/orders',
        pageTitle:'Your Orders',
        orders:orders });
      })
      .catch(err=> {
        const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
      })
   
  /*for mongodb
  req.userBody.getOrders()
      .then(orders=>{
        console.log(orders);
        res.render('shop/orders',{path:'/orders',pageTitle:'Your Orders',orders:orders});
      })
      .catch(err=>console.log(err))
*/

  /*for sequelize
 req.userBody.getOrders({include:['products']})
      .then(orders=>{
        console.log(orders);
        res.render('shop/orders',{path:'/orders',pageTitle:'Your Orders',orders:orders});
      })
      .catch(err=>console.log(err));
  */
}

exports.postOrder=(req,res,next)=>{
  User.findById({_id:req.userBody._id})
  .populate('cart.items.productId') //populate didn't return a promise so use this function to return a promise
.exec((err,users) => {
  if(err){
    console.log(err)
  }
  const products=users.cart.items.map(i=>{
    return {quantity:i.quantity,product:{...i.productId._doc}};//productid is a metadata
  })
  //console.log(req.userBody.name,req.userBody._id);
  const order=new Order({
    user:{
      email:req.userBody.email,
      userId:req.userBody._id
    },
    products:products
  })
  //console.log(order)
   order.save()
   .then(result=>{
    return req.userBody.clearCart();
    
  })
  .then(result=>{
    res.redirect('/orders');
  })
  .catch(err=> {
    const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
  })

})
  /*for mongodb
  req.userBody.addOrder()
    .then(result=>{
      res.redirect('/orders');
    })
    .catch(err=>console.log(err))
    */
  /*for sequelize
  let fetchedCart;
  req.userBody.getCart()
    .then(cart=>{
      fetchedCart=cart;
      return cart.getProducts();
    })
    .then(products=>{
      return req.userBody.createOrder()
      .then(order=>{
      return  order.addProducts(products.map(product=>{
          product.orderItem={quantity:product.cartItem.quantity};
          return product;
        }))
      })
    })
    .then(result=>{
      return fetchedCart.setProducts(null);  
    })
    .then(result=>{
      res.redirect('/orders');
    })
    .catch(err=>console.log(err));
*/
 }
 exports.getInvoice=(req,res,next)=>{
  const orderId=req.params.orderId;
  Order.findById(orderId)
  .then(order=>{
    if(!order)
    {
      return next(new Error('No order found'));
    }
    if(order.user.userId.toString()!==req.userBody._id.toString()){
      return next(new Error('Unauthorized'));
    }
    const invoiceName='invoice-'+orderId+'.pdf';
  const invoicePath=path.join(rootDir,'data','Invoices',invoiceName);
 // console.log(invoicePath);

const pdfDoc=new PDFDocument();
res.setHeader('Content-Type', 'application/pdf');
res.setHeader(
          'Content-Disposition',
          'inline; filename="' + invoiceName + '"'
        );
pdfDoc.pipe(fs.createWriteStream(invoicePath));
pdfDoc.pipe(res);
pdfDoc.fontSize(26).text('Invoice',{
  underline:true
})
let totalPrice=0;
for(let prod of order.products){
  totalPrice+=prod.product.price*prod.quantity;
pdfDoc.fontSize(20).text(prod.product.title+' - '+ prod.quantity+' - Rs.'+prod.product.price);

}
pdfDoc.text('-----------------------------------');
pdfDoc.fontSize(20).text('Total Price    :Rs.'+totalPrice);
pdfDoc.end();
 /*streaming data into pdf response
 const file=fs.createReadStream(invoicePath);
 res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'inline; filename="' + invoiceName + '"'
        );
file.pipe(res);
*/
 /*reading files into pdf
  fs.readFile(invoicePath,(err,data)=>{
    if(err)
    {
      return next(err);
    }
    res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'inline; filename="' + invoiceName + '"'
        );
       // const headers = res.getHeaders();
    
        // Printing those headers
       // console.log(headers);
    res.send(data);
  })*/
  })
  .catch(err=>next(err));
  
 }