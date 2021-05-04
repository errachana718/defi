var express = require('express');
var router = express.Router();
const moment = require('moment');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const User = require('../models/user');
const mongoose = require('mongoose');

/* GET users listing. */
router.get('/',auth.authenticateToken, function(req, res, next) {
	 User.find({})
       .exec()
       .then(result=>{
       	 const resData = {data:result,message:'success',status:200};
         res.status(200).json(resData);
       })
       .catch(err=>{
       	 if(err) throw err;
       });
});
/* POST the user . */
router.post('/create',auth.authenticateToken, function(req, res, next) {
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
          });
    });
});
/* GET the user . */
router.get('/:id',auth.authenticateToken, function(req, res, next) {
	const id = req.params.id;
	User.findById(id).exec()
	    .then(result=>{
          const resData = {data:result,message:'success',status:200};
          res.status(200).json(resData);
	    })
	    .catch(err=>{
           if(err) throw err;
	    });
});
/* Update the user . */
router.put('/:id',auth.authenticateToken, function(req, res, next) {
	const id = req.params.id;
	const updateOps = {};
	const body = req.body;

	for(const ops in body){
        updateOps[ops] = body[ops];
	}
    //console.log(updateOps)
	User.update({_id:id}, { $set: updateOps}).exec()
	    .then(result=>{
           const resData = {data:result,message:'success',status:200};
           res.status(200).json(resData);
	    })
	    .catch(err=>{
           if(err) throw err;
	    });
});
/* DELETE the user . */
router.delete('/:id',auth.authenticateToken, function(req, res, next) {
    const id = req.params.id;
    User.remove({_id:id}).exec()
        .then(result=>{
           const resData = {data:result,message:'success',status:200};
           res.status(200).json(resData);
        })
        .catch(err=>{
        	if(err) throw err;
        });
});

module.exports = router;
