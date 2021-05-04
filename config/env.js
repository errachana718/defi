const mongodb = {
	database:'defieleven'
}

const jwt = {
	secret:'supersecret',
	expiresIn:'1800s' // expires after half and hour (1800 seconds = 30 minutes)
}

exports.mongodb = mongodb;
exports.jwt = jwt;