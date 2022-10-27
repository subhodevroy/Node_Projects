//const http=require('http')
const express=require('express')
const bodyParser=require('body-parser') //for parsinng request body
const path=require('path')
const mongoose=require('mongoose');
const session=require('express-session') //for session
const mongodbstore=require('connect-mongodb-session')(session);//for storing sessions in mongodb
const csrf=require('csurf')//for security give protection against croos origin equest forgery
const flash=require('connect-flash');//for flash messages
const multer=require('multer');/*
multer: parses incoming requests but this package parses incoming requests for files,
so it is able to handle file requests as well or requests with mixed data, 
with text and file data.
*/
const User=require('./models/user')
const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const authRoutes=require('./routes/auth');
const errorController=require('./controller/error')

const url='mongodb+srv://subho:subho@cluster0.lcvq6bo.mongodb.net/shop?retryWrites=true&w=majority';

const app=express();
const store=new mongodbstore({
  uri:url,
  collection:'sessions'
});
const csrfProtection=csrf();

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

const fileStorage = multer.diskStorage({ //for storing files
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "-" + file.originalname);
  }
});
const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png' ||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg')
  {
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}
//const db=require('./utils/database') for mysql2

//const mongoConnect=require('./utils/database').mongoConnect;   for mongodb

/*sequelize
const sequelize=require('./utils/database')
const Product=require('./models/product')
const User=require('./models/user')
const Cart=require('./models/cart')
const CartItem=require('./models/cart-item')
const Order=require('./models/order');
const OrderItem=require('./models/order-item')
*/

app.use(bodyParser.urlencoded({extended:false}))//for parsing request body
app.use(multer({ storage:fileStorage,fileFilter:fileFilter }).single('imageUrl'));
app.use(express.static(path.join(__dirname,'public')))//for accessing css folders publicly
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(session
  ({secret:'my secret',
  resave:false,
  saveUninitialized:false,
  store:store},
  ))

  app.use(csrfProtection);
  app.use(flash())

  app.use((req,res,next)=>{
    /*
  res.locals=>This allows us to set local variables that are passed into the views, local simply 
  because well they  will only exist in the views which are rendered.
    */
    res.locals.isAuthenticated=req.session.isLoggedIn; //
    res.locals.csrfToken=req.csrfToken();
    //console.log(res.locals.isAuthenticated,res.locals.csrfToken);
    next();            
  })
  

  app.use((req, res, next) => {
    if (!req.session.userBody) {
      return next();
    }
    User.findById(req.session.userBody._id)
      .then(user => {
        if(!user)
        {
          return next;
        }
        req.userBody = user;
        next();
      })
      .catch(err => {
        next(new Error(err)) //since it is an async operation or callbacks,throw will not work here.
      });
  });

/*for mongodb without session
app.use((req, res, next) => {
  User.findById("62f1bfdbc83466a2adf7e486")
    .then(user => {
      
      req.userBody = user;
      //console.log(req.userBody);
      next();
    })
    .catch(err => console.log(err));
});
*/
/*sequelize
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      
      req.userBody = user;
      //console.log(req.userBody);
      next();
    })
    .catch(err => console.log(err));
});
*/

/*for mongodb
app.use((req, res, next) => {
  User.findById('62efba42beb98bbccf48420b')
    .then(user => {
      
      req.userBody = new User(user.name,user.email,user.cart,user._id);
      //console.log(req.userBody);
      next();
    })
    .catch(err => console.log(err));
});
*/

app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes)
app.get('/500',errorController.get500);
app.use(errorController.get404);
//for error handling
app.use((error,req,res,next)=>{
  //console.log(req.session.isLoggedIn);
  res.status(500).render('500',{pageTitle:'Error!',
  path:'/500',
  isAuthenticated:req.session.isLoggedIn });
})
mongoose.connect(url)
    .then(result=>{

      /*User.findOne()
          .then(user=>{
            if(!user)
            {
              const user=new User({
                name:'Subho',
                email:'abc@g.com',
                cart:{
                  items:[]
                }
              });
              user.save();
            }
          })
      */
     
      app.listen(3000);
    })
    .catch(err=>console.log(err));

/*for mongodb
mongoConnect(()=>{

  app.listen(3000);
})
*/

/*sequelize
//One user can have many products.Linking user with Products or we can use
// User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{ through:CartItem});
Product.belongsToMany(Cart,{ through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});
Product.belongsToMany(Order,{through:OrderItem});

//create tables into database

   //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Subho', email: 'bhsbj@g.com' });
    }
    return user;
  })
  .then(user => {
    return user.createCart();
   })
  .then(cart => {
   // console.log(user);
   app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
*/
  
// const server=http.createServer(app)

// server.listen(3000);
