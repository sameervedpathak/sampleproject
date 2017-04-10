var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var ratingCRUD = CRUD(connection,'productratings');

/**
 * @api {get} /getproductrating/:id get particuler product details
 * @apiName findById
 * @apiGroup product_rating
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from productratings where prate_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectProductRating = function(req,res){
  	  productCRUD.load({
  	  	'prate_id':req.body.prate_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'product rating rating List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'product rating List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /addproductrating/   add new product rating
 * @apiName insertProductRating
 * @apiGroup product_rating
 * @apiParam {date} prate_date  	auto populated rating date.
 * @apiParam {Number} user_id  		Mandatory user id foreign key.
 * @apiParam {Number} product_id 	Mandatory product id foreign key.
 * @apiParam {Number} vendor_id  	Mandatory vendor id foreign key.
 * @apiParam {float} ratings  Mandatory ratings.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertProductRating = function(req,res){
  	  ratingCRUD.create({
  	  	'prate_date':env.timestamp(),
  	  	'user_id':req.body.user_id,
  	  	'product_id':req.body.product_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'ratings': req.body.ratings,  	  	
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        product_id: result.insertId,
	        message: 'product ratings Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'product Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /editproductrating/   update product rating details
 * @apiName updateProductRating
 * @apiGroup product_rating 
 * @apiParam {Number} prate_id  	primary key to update particuler record.
 * @apiParam {date} prate_date  	auto populated rating date.
 * @apiParam {Number} user_id  		Mandatory user id foreign key.
 * @apiParam {Number} product_id 	Mandatory product id foreign key.
 * @apiParam {Number} vendor_id  	Mandatory vendor id foreign key.
 * @apiParam {float} ratings  Mandatory ratings.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateProductRating = function(req, res) {
  	prate_id = req.body.prate_id;
  ratingCRUD.update({'prate_id' : prate_id}, {
  		'prate_date':env.timestamp(),
  	  	'user_id':req.body.user_id,
  	  	'product_id':req.body.product_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'ratings': req.body.ratings,
  	  	'modified_on': env.timestamp(),
  	  	'IsActive':1
  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'product ratings successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /deleteProductRating/:id delete particuler product from database
 * @apiName deleteProductRating
 * @apiGroup product_rating
 * @apiParam {Number} prate_id   Product rating id to delete particule record from primary key.
 *
 */
exports.deleteProductRating = function(req,res){
	ratingCRUD.destroy({
	    'prate_id': req.body.prate_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'product ratings Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'product ratings Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
