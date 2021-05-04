var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
var multer = require('../middleware/uploadImage');
var authRequest = require('../requests/auth')
const { validationResult } = require('express-validator');
const User = require('../models/user');
const mongoose = require('mongoose');

/* Login the user . */
router.post('/login',authRequest.validate('login'), function(req, res, next) {
    try {
    	const errors = validationResult(req); //Finds the validation errors in this request and wrap them in object with handy functions

    	if(!errors.isEmpty()){
    		res.status(422).json({errors:errors.array()});
    		return;
    	} 
    }catch(err){
       return next(err);
    }

   const {email, password}= req.body;
   User.find({email:email})
       .exec()
       .then(user => {
         if(!user[0]){
            const resData = {data:[],message:'The mobile number is not registered yet',status:401};
            res.status(401).json(resData);
         }else{
              // Load hash from your password DB.
           bcrypt.compare(password, user[0]['password'],(err1,hash)=>{
              if(err1) throw err1;

             if(hash){
                   const token = auth.generateAccessToken({userId:user[0]['id']})
                   const  data = {token:token,user_id:user[0]['id'],name:user[0]['name'],mobile:user[0]['mobile'],email:user[0]['email']};
                   const resData = {data:data,message:'success',status:200}
                   res.status(200).json(resData);
             } 
           });
         }
       })
       .catch(err=>{
         if(err) throw err;
       })
});
/* Register the user . */
router.post('/register',[/*authRequest.validate('register'), */multer.uploadFile], function(req, res, next) {
	// try {
 //      const errors = validationResult(req); //Finds the validation errors in this request and wrap them in object with handy functions

 //      if(!errors.isEmpty()){
 //        res.status(422).json({errors:errors.array()});
 //        return;
 //      } 
 //    }catch(err){
 //       return next(err);
 //    }

    const {name,password,mobile,email} = req.body;
	  const {filename} = req.file;
	
    const saltRounds = 10;
    bcrypt.hash(password,saltRounds,(err,hash)=>{
        if(err) throw err;
        let pass = hash;
        var user =  new User({
            _id: new mongoose.Types.ObjectId(),
            name:name,
            mobile:mobile,
            email:email,
            password:pass,
            image:filename
        });

        user
          .save()
          .then(result => {
            const resData = {data:result,message:'success',status:200};
            res.status(200).json(resData);
          })
          .catch(err=>{
            if(err) throw err;
          })
    });
});

module.exports = router;