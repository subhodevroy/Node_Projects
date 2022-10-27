const Product=require('../models/product')
const mongodb=require('mongodb')
const deleteFile=require('../utils/file')
const {validationResult}=require('express-validator')
const ITEMS_PER_PAGE=2;
exports.getAddProduct=(req,res,next)=>{
    //console.log('In second middleware');
    //console.log(rootDir);
   // res.sendFile(path.join(rootDir,'views','add-product.html'));
  
   res.render('admin/add-product',{
      pageTitle:'Add Product',
      path:'/admin/add-product',
      errorMessage:null,
      })
}
exports.postAddProduct=(req,res,next)=>{
   // products.push({title:req.body.title});

   const title=req.body.title;
   const imageUrl=req.file;
   const description=req.body.description;
   const price=req.body.price;
  //console.log(imageUrl);
  if(!imageUrl){
    return res.status(422).render('admin/add-product',{
      pageTitle:'Add Product',
      path:'/admin/add-product',
      errorMessage:'Attached file is not an image'
      })
  }
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
      //console.log(errors.array());
    return res.status(422).render('admin/add-product',{
        pageTitle:'Add Product',
        path:'/admin/add-product',
        errorMessage:errors.array()[0].msg
        })
    }
    const imagePath=imageUrl.path;
   const product=new Product({title:title,
    price:price,
    imageUrl:imagePath,
    description:description,
    userId:req.userBody._id});
    //console.log(imageUrl);
    
   product.save()
          .then(result=>{
           // console.log("Created Product");          
            res.redirect('/admin/products');
          })
          .catch(err=>{
          // res.redirect('/500');
          const error=new Error(err);
          error.httpStatusCode=500;
          return next(error);
          })


   /*for mongodb
   const product=new Product(title,imageUrl,description,price,null,req.userBody._id);
   product.save()
          .then(result=>{
           // console.log("Created Product");            
            res.redirect('/admin/products');
          })
          .catch(err=>{
            console.log(err);
          })
*/
   /* for sequelize
   req.userBody.createProduct({
     title: title,
     price: price,
     imageUrl: imageUrl,
     description: description,
   })
   .then(result => {
     // console.log(result);
     console.log('Created Product');
     res.redirect('/admin/products');
   })
   .catch(err => {
     console.log(err);
   });
    */
    /* for files
     const product=new Product(title,imageUrl,description,price,null);
    product.save();
      res.redirect('/');
      */

    /*for mysql
     const product=new Product(title,imageUrl,description,price,null);
    product.save()
          .then(()=>{
            res.redirect('/');
          })
          .catch(err=>{
            console.log(err)
          })
      */      
  
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error=new Error(err);
          error.httpStatusCode=500;
          return next(error);
    });
};

  /*for sequelize
  Product.findByPk(prodId)
  req.userBody.getProducts({ where: { id: prodId } })
.then(products => {
  const product = products[0];
  if (!product) {
    return res.redirect('/');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
})
 .catch(err => console.log(err));
*/

  /* for files
  Product.findById(prodId,product=>{
    if(!product)
  {
    return res.redirect('/');
  }
    res.render('admin/edit-product',{pageTitle:'Edit Product',path:'/admin/edit-product',editing:editMode,product:product})
  })
  */



  exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.file;
    console.log(updatedImageUrl);
    const updatedDesc = req.body.description;
  
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      //console.log(errors.array())
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDesc,
          _id: prodId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
  
    Product.findById(prodId)
      .then(product => {
        if (product.userId.toString() !== req.userBody._id.toString()) {
          return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if(updatedImageUrl){
          deleteFile(product.imageUrl);
          product.imageUrl = updatedImageUrl.path;
        }
        ;
        return product.save().then(result => {
          //console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        });
      })
      .catch(err =>  {
        const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
      });
  };

   /* FOR MONGODB
   const updatedProduct=new Product(updatedtitle,updatedimageUrl,updateddescription,updatedprice,prodId);  
   updatedProduct.save();
   res.redirect('/admin/products');
  */
   /*for files
   const updatedProduct=new Product(updatedtitle,updatedimageUrl,updateddescription,updatedprice,updatedprodId);  
   updatedProduct.save();
   res.redirect('/admin/products');
   */
  /*for sequlelize
  Product.findByPk(updatedprodId)
          .then(product=>{
            product.title=updatedtitle;
            product.price=updatedprice;
            product.imageUrl=updatedimageUrl;
            product.description=updateddescription;
            product.userId=req.userBody.id;
            return product.save()
          })
          .then(result=>{
            res.redirect('/admin/products');
          })
          .catch(err=>console.log(err))
          */


//for deleting product using ajax
exports.deleteProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  Product.findById(prodId)
    .then(product=>{
      if(!product){
        return next(new Error('Product Not Found'));
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({_id:prodId,userId:req.userBody._id})
    })   
        .then(()=>res.status(200).json({message:'Success'}))
        .catch(err=> {
          res.status(500).json({message:'Deleting Product Failed'});
        });

      }

/*without using ajax
exports.postDeleteProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  Product.findById(prodId)
    .then(product=>{
      if(!product){
        return next(new Error('Product Not Found'));
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({_id:prodId,userId:req.userBody._id})
    })   
        .then(()=>res.redirect('/'))
        .catch(err=> {
          const error=new Error(err);
              error.httpStatusCode=500;
              return next(error);
        });
*/
  /*for mongodb
  Product.deleteById(prodId)
        .then(()=>res.redirect('/'))
        .catch(err=>console.log(err));
  */

  
  /* for files
  Product.deleteById(prodId);
  res.redirect('/');
  */

 /* for sequelize
 Product.findByPk(prodId)
        .then(product=>{
          return product.destroy();
        })
        .then((result)=>{
          res.redirect('/');
        })
        .catch(err=>console.log(err))
        

}
*/
exports.getAllProducts=(req,res,next)=>{
  //for mongoose
Product.find({userId:req.userBody._id})
// .select('title price -_id') to select title price from Product
//  .populate('userId',name)  to select name id from User
const page=+req.query.page || 1;
let totalItems;
Product.find()
.countDocuments()
.then(numProducts=>{
  totalItems=numProducts;
  return Product.find({userId:req.userBody._id}).populate('userId')
  .skip((page-1)*ITEMS_PER_PAGE)
  .limit(ITEMS_PER_PAGE)
})
 .then(products=>{
 // console.log(products);
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
      path: '/admin/products', 
          currentPage:page,
          hasNextPage:ITEMS_PER_PAGE*page<totalItems,
          hasPreviousPage:page>1,
          nextPage:page+1,
          previousPage:page-1,
          lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)                        
  });
})
.catch(err=> {
  console.log(err);
  // const error=new Error(err);
  //     error.httpStatusCode=500;
  //     return next(error);
});



 /*for mongodb
      req.userBody.getProducts()
      .then(products=>{
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
            path: '/admin/products'          
        });
      })
      .catch(err=>console.log(err));
      */

  /*files
    Product.fetchAll(products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
            path: '/admin/products'          
        });
      });
     */

   
}