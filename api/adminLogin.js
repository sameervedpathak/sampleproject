var http = require('http');
var md5 = require('md5');
var mysql = require('mysql');
/*var db = mysql.createPool({
	database : 'icefire',
     user : 'root',
	password : '',
    host :'localhost',
 });*/
var env = require('./environment');
var connection = env.Dbconnection;
 var CRUD = require('mysql-crud');
 exports.login = function(req, res) {
 	var username=req.body.username;
 	var password=md5(req.body.password); 
 	  CRUD(connection, 'adminusers').load({email_id: username,password : password }, function (err, val) {	
 	  	var resdata={
 	  		status:false,
 	  		message :'err'
 	  	};
 	  	if(val.length>0){
 	  		resdata.status=true;
 	  		resdata.userdata=val;
 	  		resdata.message='successfully login welcome to admin panel.';  		
 	  	}else{
 	  		resdata.status=false;
 	  		resdata.message='wrong username or password please enter a valid ';
 	  	}
 	  	  
 	  	res.jsonp(resdata);
 	  });
 }; 