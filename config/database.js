var user = require('./credentials').user
var pass = require('./credentials').pass
var db = require('./credentials').db

var database = {
	local: '',
	remote: 'mongodb://'+user+':'+pass+'@jello.modulusmongo.net:27017/'+db
}

module.exports = database;
