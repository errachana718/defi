const { body } = require('express-validator');;

exports.validate = (method)=>{
	switch(method){
		case 'login' : {
			return [body('email').exists().isEmail(),
			        body('password').exists()];
			
		}
		case 'register' : {
			return [body('email').exists().isEmail(),
			        body('password').exists(),
			        body('name').exists(),
			        body('mobile').exists(),
			        ];

		}
	}
}