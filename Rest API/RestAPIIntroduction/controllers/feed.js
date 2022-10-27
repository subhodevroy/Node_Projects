const { validationResult } = require('express-validator/check');
const fs=require('fs');

const path=require('path');
const ITEMS_PER_PAGE=2;

const io=require('../socket');
const Post = require('../models/post');
const User=require('../models/user')

const clearImage=filePath=>{
  filePath=path.join(__dirname,'..',filePath);
  fs.unlink(filePath,err=>{
    if(err){
      console.log(err);
    }
  })    
}

exports.getPosts =async(req, res, next) => {
  const currentPage=req.query.page || 1;
  let totalItems;
  
  Post.find()
    .countDocuments()
    .then(count=>{
      totalItems=count;
      //console.log(totalItems);
      return  Post.find()
                  .populate('creator')
                  .sort({createdAt:-1})
                  .skip((currentPage-1)*ITEMS_PER_PAGE)
                  .limit(ITEMS_PER_PAGE)
                })
    .then(posts => {
      //console.log("Fetching posts");
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: posts,totalItems:totalItems });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
    
  //  try{
  //   totalItems=await Post.find().countDocuments();
  //   console.log(totalItems);
  //   const posts=await Post.find()
  //   .skip((currentPage-1)*ITEMS_PER_PAGE)
  //   .limit(ITEMS_PER_PAGE);
  //   console.log("Fetching posts");
  //   res.status(200).json({ message: 'Fetched posts successfully.', posts: posts,totalItems:totalItems })
    
  //  }
  //   catch(err) {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   };
  //   console.log("Getting posts");
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\" ,"/");
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  post
    .save()
    .then(result => {
      //console.log(result);
      return User.findById(req.userId);
    })
    .then(user => {
      //console.log(user);
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
     // console.log(result);
     io.getIO().emit('posts',{action:'create',post: post})
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator: { _id: creator._id, name: creator.name }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
 // console.log("Inside update",io.getIO());
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId).populate('creator')
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if (post.creator._id.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then(result => {
      io.getIO().emit('posts', { action: 'update', post: result });
      res.status(200).json({ message: 'Post updated!', post: result });
    })
    .catch(err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost=(req,res,next)=>{
  const postId=req.params.postId;
  Post.findById(postId)
    .then(post=>{
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId,{useFindAndModify:false});
    })
    .then(result=>{
      //console.log(result);
      return User.findById(req.userId)
    })
    .then(user=>{
      user.posts.pull(postId);
      return user.save();
      
    })
    .then(result=>{
      io.getIO().emit('posts', { action: 'delete', post: postId });
      res.status(200).json({message:'Deleted Post'})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}
