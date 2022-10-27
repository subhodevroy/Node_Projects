const User=require('../models/user');
const bcrypt=require('bcryptjs')//for generating hashed passwords
const nodemailer=require('nodemailer') //for sending mails
const sendGridTransport=require('nodemailer-sendgrid-transport') //for sending mails
const crypto=require('crypto')//for generating unique random values
const {validationResult}=require('express-validator') //stores errors thrown by check in routes

const transporter=nodemailer.createTransport(sendGridTransport({
    auth:{
     
        api_key:'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'
    }
}))

exports.getLogin=(req,res,next)=>{
    //console.log(req.get('Cookie'));
    //const isLoggedIn=req.get('Cookie').split('=')[1]==='true';
   //console.log(req.session.isLoggedIn);
   let message=req.flash('error')
   if(message.length>0)
   {
    message=message[0];
   }
   else{
    message=null;
   }
    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        errorMessage:message,
        oldInput:{email:"",password:""},
        validationErrors:[]
    })
}
exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
       console.log(errors.array());
      return  res.status(422).render('auth/login',{
            path:'/login',
            pageTitle:'Login',
            isAuthenticated:false,
            errorMessage:errors.array()[0].msg,
            oldInput:{email:email,password:password},
            validationErrors:errors.array()
        });
    }
    User.findOne({email:email})
        .then(user=>{
            if(!user){
                 return  res.status(422).render('auth/login',{
            path:'/login',
            pageTitle:'Login',
            isAuthenticated:false,
            errorMessage:'Invalid email or password',
            oldInput:{email:email,password:password},
            validationErrors:[]
        });
            }
            bcrypt.compare(password,user.password)
                .then(result=>{
                    if(result){   //Password matches
                        req.session.isLoggedIn = true;
                        req.session.userBody = user;
                     return  req.session.save(err=>{
                            if(err)
                            {
                                 console.log(err);
                            }
                            return res.redirect('/');
                        })
                    }
                    req.flash('error','Invalid email or password')
                    return res.redirect('/login'); //Password dont
                })
        })
        .catch(err=>{
            //console.log(err);
            res.redirect('/login');
        })    
}
exports.postLogout=(req,res,next)=>{
    req.session.destroy(err=>{
        if(err)
        {
            const error=new Error(err);
                error.httpStatusCode=500;
                return next(error);
        }
    
        res.redirect('/');
    })
}
exports.getSignUp=(req,res,next)=>{
    let message=req.flash('error')
   if(message.length>0)
   {
    message=message[0];
   }
   else{
    message=null;
   }
res.render('auth/signup',{
    path:'/signup',
    pageTitle:'SignUp',
    isAuthenticated:false,
    errorMessage:message,
    oldInput:{email:"",password:""},
    validationErrors:[]
});
}
exports.postSignUp=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
       console.log(errors.array());
      return  res.status(422).render('auth/signup',{
            path:'/signup',
            pageTitle:'SignUp',
            isAuthenticated:false,
            errorMessage:errors.array()[0].msg,
            oldInput:{email:email,password:password},
            validationErrors:errors.array()
        });
    }
    User.findOne({email:email})
        .then(userExists=>{
            if(userExists){
                req.flash('error','Email exists already!')
                return res.redirect('/signup');
            }
           return bcrypt.hash(password,12)
           .then(hashedPassword=>{
            const user=new User({
                email:email,
                password:hashedPassword,
                cart:{items:[]}
        })

        return user.save();
    })
        .then(result=>{
            res.redirect('/login');
           
            return transporter.sendMail({
                to:email,
                from:'subharoy305@gmail.com',
                subject:'SignUp succeeded',
                html:'<h1>You successfully signed in!!</h1>'
                
            })
            
        })
        })
       
        .catch(err=> {
            const error=new Error(err);
                error.httpStatusCode=500;
                return next(error);
          }
        )
}
exports.getReset=(req,res,next)=>{
    let message=req.flash('error')
    if(message.length>0)
    {
     message=message[0];
    }
    else{
     message=null;
    }
 res.render('auth/reset',{
     path:'/reset',
     pageTitle:'Reset Password',
     errorMessage:message
 });
}
exports.postReset=(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/login');
        }
        const token=buffer.toString('hex');
        User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    req.flash('error','No account found with that email');
                    return res.redirect('/reset');
                }
                user.resetToken=token;
                user.resetTokenExpiration=Date.now()+3600000;
                return user.save();
            })
            .then(result=>{
                res.redirect('/');
                transporter.sendMail({
                    to:req.body.email,
                     from:'subharoy305@gmail.com',
                    subject:'Password reset',
                    html:`'
                    <p>You requested password reset</p>
                    <p>Click this<a href="http://localhost:3000/reset/${token}"> link</a> to set a new password</p>'                    
                    `
            })           
    })
    .catch(err=> {
        const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
      })
    
})
}

exports.getNewPassword=(req,res,next)=>{
const token=req.params.token;
//console.log(token);
User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(user=>{
        let message=req.flash('error')
        if(message.length>0)
        {
         message=message[0];
        }
        else{
         message=null;
        }
     res.render('auth/new-password',{
         path:'/new-password',
         pageTitle:'New Password',
         errorMessage:message,
         userId:user._id.toString(),
         passwordToken:token
     });
    })
    .catch(err=> {
        const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
      })

}
exports.postNewPassword=(req,res,next)=>{
const newPassword=req.body.password;
const userId=req.body.userId;
const passwordToken=req.body.passwordToken;
let resetUser;
User.findOne({
    resetToken:passwordToken,
    resetTokenExpiration:{$gt:Date.now()},
    _id:userId
})
.then(user=>{
    resetUser=user;
    return bcrypt.hash(newPassword,12);
})
.then(hashedPassword=>{
    resetUser.password=hashedPassword;
    resetUser.resetToken=undefined;
    resetUser.resetTokenExpiration=undefined;
    return resetUser.save();
})
.then(result=>{
    res.redirect('/login');
    transporter.sendMail({
        to:resetUser.email,
         from:'subharoy305@gmail.com',
        subject:'Password Changed!!',
        html:`'
        <p>Password changed successfully</p>                    
        `
})       
})
.catch(err=> {
    const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
  })
}