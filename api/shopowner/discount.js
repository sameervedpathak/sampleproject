var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var discountCRUD = CRUD(connection,'discounts');


/**
 * @api {get} /shop/alldiscounts generate list of categories
 * @apiName findAll
 * @apiGroup /ShopOwner/discount
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from discounts where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /shop/getdiscounts/:id get particuler discount details
 * @apiName findById
 * @apiGroup /ShopOwner/discount
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from discounts where discount_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectDiscount = function(req,res){
  	  discountCRUD.load({
  	  	'discount_id':req.body.discount_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'discount List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'discount List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /shop/adddiscount/   add new discount
 * @apiName insertDiscount
 * @apiGroup /ShopOwner/discount
 * @apiParam {String} discount_name  	Mandatory discount name.
 * @apiParam {String} discount_desc	  Mandatory discount description.
 * @apiParam {String} discount_from_date 	Mandatory discount_from_date.
 * @apiParam {String} discount_to_date     Mandatory discount_to_date.
 * @apiParam {Number} discount_perc   Mandatory discount_perc.
 * @apiParam {Number} 	product_id   Mandatory product_id to apply discount on particular products.
 * @apiParam {Number} vendor_id   Mandatory vendor_id to apply discount for vendor own products.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertDiscount = function(req,res){
  	  discountCRUD.create({
  	  	'discount_name':req.body.discount_name,
  	  	'discount_desc':req.body.discount_desc,
  	  	'discount_from_date':req.body.discount_from_date,
  	  	'discount_to_date': req.body.discount_to_date,
  	  	'discount_perc':req.body.discount_perc,
  	  	'product_id': req.body.product_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        catg_id: result.insertId,
	        message: 'discount Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'discount Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /shop/editdiscount/   update discount details
 * @apiName updateDiscount
 * @apiGroup /ShopOwner/discount
 * @apiParam {String} discount_name  	Mandatory discount name.
 * @apiParam {String} discount_desc	  Mandatory discount description.
 * @apiParam {String} discount_from_date 	Mandatory discount_from_date.
 * @apiParam {String} discount_to_date     Mandatory discount_to_date.
 * @apiParam {Number} discount_perc   Mandatory discount_perc.
 * @apiParam {Number} product_id   Mandatory product_id to apply discount on particular products.
 * @apiParam {Number} vendor_id   Mandatory vendor_id to apply discount for vendor own products.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateDiscount = function(req, res) {
 	
 	discountid = req.body.discount_id;
  categoryCRUD.update({'discount_id' : discountid}, {
  		'discount_name':req.body.discount_name,
  	  	'discount_desc':req.body.discount_desc,
  	  	'discount_from_date':req.body.discount_from_date,
  	  	'discount_to_date': req.body.discount_to_date,
  	  	'discount_perc':req.body.discount_perc,
  	  	'product_id': req.body.product_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'modified_on': env.timestamp(),
  	  	'IsActive':1}, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'Category successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /shop/deleteDiscount/:id delete particuler discount from database
 * @apiName deleteDiscount
 * @apiGroup /ShopOwner/discount
 * @apiParam {Number} discount_id   Discount id to delete particule record from primary key.
 *
 */
exports.deleteDiscount = function(req,res){
	discountCRUD.destroy({
	    'discount_id': req.body.discount_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'discount Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'discount Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
