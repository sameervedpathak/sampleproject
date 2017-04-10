//for database connection
var mysql = require('mysql');
var http = require('http');
var nodemailer = require('nodemailer');


var enviroment = {
	Dbconnection : mysql.createPool({
			database : 'tifanee',
		  user : 'ftdev',
			password : '10gXWOqeaf',
		  host :'apps.fountaintechies.com',
		  // database : 'tifanee',
		  // user : 'root',
			// password : 'july1890',
		  // host :'localhost'
	}),

	/** Function For Time stamp**/
	timestamp: function() {
      var UTCtimestamp = new Date();
      return UTCtimestamp.getTime();
    }

}
enviroment.uploadpath = '/home/tifanee/tifanee/assets/';
enviroment.emailBaseUrl = 'http://node.fountaintechies.com:4500/';
enviroment.assetpath = 'http://tifanee.fountaintechies.com/assets/';
enviroment.transporter = nodemailer.createTransport({
     host : 'in-v3.mailjet.com',
     port: '587',
     auth: {
         user: '66ca4479851e0bd9cedc629bdff36ee6',
         pass: 'a3ec60f55a89f7fab98891e86818c8db'
     }
});
module.exports = enviroment;
