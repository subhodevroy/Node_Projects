const express=require('express')
const authController=require('../controller/auth')
const {check}=require('express-validator')//for validation purpose

const router=express.Router();

router.get('/login',authController.getLogin);
router.get('/signup',authController.getSignUp);
router.get('/reset',authController.getReset);
router.get('/reset/:token',authController.getNewPassword)
router.post('/reset',authController.postReset);
router.post('/signup',[check('email')    //check for email field in request body,params,cookies
                        .isEmail()
                        .withMessage('Please enter a valid email')
                        .custom((value,{req})=>{
                            if(value ==='test@test.com')
                            {
                                throw new Error("This email address is forbidden");
                            }
                            return true;
                        })
                        .normalizeEmail(), //for sanitizing purpose
                        check('password','Password should be valid')    
                        .trim()
                        .isLength({min:5}) //check for validation in request body only
                        .isAlphanumeric()
                        ,                       
                        check('confirmPassword')                        
                        .custom((value,{req})=>{
                            if(value !== req.body.password)
                            {
                                throw new Error('Passwords should match')
                            }
                            return true;
                        })],                        
                        authController.postSignUp);
router.post('/login',[check('email')    //check for email field in request body,params,cookies
                    .isEmail()
                    .withMessage('Please enter a valid email')
                    .normalizeEmail(),
                    check('password','Please enter a valid password')    
                    .trim()    
                    .isLength({min:5}) //check for validation in request body only
                        .isAlphanumeric()
                        ],
                    authController.postLogin);
router.post('/new-password',authController.postNewPassword);
router.post('/logout',authController.postLogout);
module.exports=router;