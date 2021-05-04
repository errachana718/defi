const jwT = require('jsonwebtoken');
const {jwt} = require('../config/env');
// userId is in the form { userId: 2 }
// ^^the above object structure is completely arbitrary
function generateAccessToken(userId) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwT.sign(userId, jwt.secret, { expiresIn: jwt.expiresIn });
}
//Authenticate the jwt token
function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({message:'Unauthorized',status:401}) // if there isn't any token

  jwT.verify(token, jwt.secret, (err, user) => {
    if (err) return res.status(403).json({message:'Forbidden',status:403});
    req.user = user
    next() // pass the execution off to whatever request the client intended
  });
}

exports.generateAccessToken = generateAccessToken;
exports.authenticateToken = authenticateToken;