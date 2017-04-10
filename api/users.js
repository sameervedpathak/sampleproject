var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var async = require("async");
var fs = require('fs-extra')
var env = require('./environment');
var connection = env.Dbconnection;
var usersCRUD = CRUD(connection,'users');
/*var Mailjet = require('node-mailjet').connect('44f830c3b1aa1e805868b467fdea336c
', 'a9cdc408be1651eb516aa00adab0cc38');*/


/**
 * @api {get} /allusers generate list of users
 * @apiName findAll
 * @apiGroup users
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from users where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /getuser/:id get particuler user details
 * @apiName findById
 * @apiGroup users
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from users where user_id =" + id, function(err, rows) {
		if (err) res.sendStatus(403);

		if (rows) {
			res.jsonp(rows);
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectUser = function(req,res){
  	  usersCRUD.load({
  	  	'user_id':req.body.user_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'users List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'users List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /adduser/   add new user
 * @apiName insertUser
 * @apiGroup users
 * @apiParam {Number} first_name    Mandatory first_name.
 * @apiParam {Number} last_name   	Mandatory last_name.
 * @apiParam {String} email_id  	Mandatory email_id.
 * @apiParam {String} user_type  Mandatory user_type.
 * @apiParam {String} password 	Mandatory password.
 * @apiParam {Number} [company_name] optional company_name
 * @apiParam {Number} mobile_number   Mandatory mobile_number.
  * @apiParam {Number} country_id    Mandatory country.
 * @apiParam {Number} address   	Mandatory address.
 * @apiParam {String} apartment  	Mandatory apartment.
 * @apiParam {String} city_id  Mandatory city.
 * @apiParam {String} state_id 	Mandatory state.
 * @apiParam {Number} [zip]	     Optional zip code.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertUser = function(req,res){
  	  usersCRUD.create({
  	  	'first_name':req.body.first_name,
  	  	'last_name':req.body.last_name,
  	  	'email_id':req.body.email_id,
  	  	'user_type': req.body.user_type,
  	  	'password': req.body.password,
  	  	'company_name': req.body.company_name,
  	  	'mobile_number':req.body.mobile_number,
  	  	'country_id':req.body.country_id,
  	  	'address':req.body.address,
  	  	'apartment': req.body.apartment,
  	  	'city_id': req.body.city_id,
  	  	'state_id': req.body.state_id,
  	  	'zip': req.body.zip,
  	  	'avatar': req.body.zip,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {

	    	// 1st para in async.each() is the array of items
			async.eachSeries(req.body.attachment.images,
			  // 2nd param is the function that each item is passed to
			  function(item, callback){
			    // Call an asynchronous function, often a save() to DB

				uploadPic(result.insertId, item,'add', function (responsd){
						console.log("done");
						callback();
			        });
				},
			  // 3rd param is the function to call when everything's done
			  function(err){
			    // All tasks are done now
			    console.log(err);
			  }
			);


	      responsedata = {
	        status: true,
	        record: result,
	        user_id: result.insertId,
	        message: 'User inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'User Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /editUser/   update category details
 * @apiName updateUser
 * @apiGroup users
 * @apiParam {Number} user_id     	Mandatory user id (primary key) to update user details .
 * @apiParam {Number} first_name    Mandatory first_name.
 * @apiParam {Number} last_name   	Mandatory last_name.
 * @apiParam {String} email_id  	Mandatory email_id.
 * @apiParam {String} user_type  Mandatory user_type.
 * @apiParam {String} password 	Mandatory password.
 * @apiParam {Number} [company_name] optional company_name
 * @apiParam {Number} mobile_number   Mandatory mobile_number.
  * @apiParam {Number} country_id    Mandatory country.
 * @apiParam {Number} address   	Mandatory address.
 * @apiParam {String} apartment  	Mandatory apartment.
 * @apiParam {String} city_id  Mandatory city.
 * @apiParam {String} state_id 	Mandatory state.
 * @apiParam {Number} [zip]	     Optional zip code.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateUser = function(req, res) {
 	 	userid = req.body.user_id;
  usersCRUD.update({'user_id' : userid}, {
  		'first_name':req.body.first_name,
  	  	'last_name':req.body.last_name,
  	  	'email_id':req.body.email_id,
  	  	'user_type': req.body.user_type,
  	  	'gender' : req.body.gender,
  	  	//'password': req.body.password,
  	  	'company_name': req.body.company_name,
  	  	'mobile_number':req.body.mobile_number,
  	  	'country_id':req.body.country_id,
  	  	'address':req.body.address,
  	  	'apartment': req.body.apartment,
  	  	'city_id': req.body.city_id,
  	  	'state_id': req.body.state_id,
  	  	'zip': req.body.zip,
  	  	'modified_on': env.timestamp(),
  	  	'IsActive':1
  	  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){

  			// 1st para in async.each() is the array of items
			async.eachSeries(req.body.attachment.images,
			  // 2nd param is the function that each item is passed to
			  function(item, callback){
			    // Call an asynchronous function, often a save() to DB

				uploadPic(req.body.user_id, item,'edit', function (responsd){
						console.log("done");
						callback();
			        });
			},
			  // 3rd param is the function to call when everything's done
			  function(err){
			    // All tasks are done now
			    console.log(err);
			  }
			);

  		var resdata={status:true,
  		    message:'User successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /deleteuser/:id delete particuler user from database
 * @apiName deleteUser
 * @apiGroup users
 * @apiParam {Number} user_id   User id to delete particule record from primary key.
 *
 */

var uploadPic = function(userid, filedata,imageFor, callback1) {
	var imagedata = filedata;

	  //var imagedata1 = req.body.attachmentfile2;
	  var matches = "";
	  function decodeBase64Image(dataString) {
	      //console.log("dataString 83:", dataString);
	      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	          response = {};
	      if (matches.length !== 3) {
	          return new Error('Invalid input string');
	      }

	      response.type = matches[1];
	      response.data = new Buffer(matches[2], 'base64');
	      return response;
	  };

	  var decodedImg = decodeBase64Image(imagedata);
	  //var decodedImg1 = decodeBase64Image(imagedata1);
	  var imageBuffer = decodedImg.data;
	  //var imageBuffer1 = decodedImg1.data;
	  var type = decodedImg.type;
	  //var type1 = decodedImg1.type;
	  function getRandomSpan() {
	      return Math.floor((Math.random() * 99999999999) + 1);
	  };
	  var fileName = getRandomSpan() + "_avatar.jpg";
	  //var fileName1 = getRandomSpan() + "image.jpg";
	  //console.log(fileName1);
	  //console.log(fileName1);

	  try {
	      fs.writeFileSync( env.uploadpath + "avatar/" + fileName, imageBuffer, 'utf8');
	       /*fs.writeFileSync("F:/my work/client data/Amol-Chawathe/shopping-cart/shopcart/assets/productimages/" + fileName1, imageBuffer1, 'utf8');*/
	  } catch (err) {
	      console.log(err,'298');
	      var response = {
	          status: 0,
	          message: 'INTERNAL ERROR'
	      };
	      callback1(response);
	  }

	if(imageFor=='add'){
		usersCRUD.update({'user_id' : userid}, {
  		'avatar':fileName,
		},function (error, result) {
		    if (result) {
		        var response = {
		              status: true,
		              record: result,
		              avatarimage: fileName,
		              message: 'User profile Image successfully Updated.'
		          };
		          callback1(response);
		    } else {
		      var response = {
		            status: false,
		            message: 'INTERNAL ERROR'
		        };
		        callback1(response);
		    }
		});
	}else if(imageFor=='edit'){
		usersCRUD.update({'user_id' : userid}, {
  		'avatar':fileName,
		    },function (error, result) {
		    if (result) {
		        var response = {
		              status: true,
		              record: result,
		              avatarimage: fileName,
		              message: 'User profile Image successfully Updated.'
		          };
		          callback1(response);
		    } else {
		      var response = {
		            status: false,
		            message: 'INTERNAL ERROR'
		        };
		        callback1(response);
		    }
		});
	}

}

exports.updateprofileimage = function(req, res) {
	
	  var imagedata = req.body.imagedata.attachment;
	  var userid = req.body.user_id;
	  var matches = "";
	  
	  function decodeBase64Image(dataString) {
	      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	          response = {};
	      if (matches.length !== 3) {
	          return new Error('Invalid input string');
	      }

	      response.type = matches[1];
	      response.data = new Buffer(matches[2], 'base64');
	      return response;
	  };

	  var decodedImg = decodeBase64Image(imagedata);
	 
	  var imageBuffer = decodedImg.data;
	 
	  var type = decodedImg.type;
	  
	  function getRandomSpan() {
	      return Math.floor((Math.random() * 99999999999) + 1);
	  };
	  var fileName = getRandomSpan() + "_avatar.jpg";
	  var fullimageurl = env.assetpath + 'avatar/' + fileName;

	  try {
	      fs.writeFileSync( env.uploadpath + "avatar/" + fileName, imageBuffer, 'utf8');
	  } catch (err) {
	      console.log(err,'298');
	      var response = {
	          status: 0,
	          message: 'INTERNAL ERROR'
	      };
	      //callback1(response);
	  }

	
		usersCRUD.update({'user_id' : userid}, {
  		'avatar':fullimageurl,
		},function (error, result) {
		    if (result) {
		        var response = {
		              status: true,
		              record: result,
		              avatarimage: fullimageurl,
		              message: 'User profile Image successfully Updated.'
		          };
		          res.jsonp(response);
		    } else {
		      var response = {
		            status: false,
		            message: 'INTERNAL ERROR'
		        };
		       res.jsonp(response);
		    }
		});

}