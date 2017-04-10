var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var productCRUD = CRUD(connection,'products');


/**
 * @api {get} /admin/allproduct generate list of products
 * @apiName findAll
 * @apiGroup /admin/product
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from products where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /admin/getproduct/:id get particuler product details
 * @apiName findById
 * @apiGroup /admin/product
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from products where product_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectProduct = function(req,res){
  	  productCRUD.load({
  	  	'product_id':req.body.product_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'product List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'product List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /admin/addproduct/   add new product
 * @apiName insertProduct
 * @apiGroup /admin/product
 * @apiParam {String} product_name  	Mandatory Product Name.
 * @apiParam {String} product_description  Mandatory Product description.
 * @apiParam {Number} product_price 	Mandatory Product alias without space.
 * @apiParam {Number} qtytype_id  	Mandatory Product Quantity foreign key.
 * @apiParam {Number} [Size]  optional product size.
 * @apiParam {Number} [colour_id]  optional product color foreign key.
 * @apiParam {Number} vendor_id     Admin will select vendor id.
 * @apiParam {Number} maincatg_id   Mandatory Main Category table foreign key.
 * @apiParam {Number} catg_id 	Mandatory category table foreign key.
 * @apiParam {Number} subcatg_id   Sub Category table foreign key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertProduct = function(req,res){
  	  productCRUD.create({
  	  	'product_name':req.body.product_name,
  	  	'product_description':req.body.product_description,
  	  	'product_price':req.body.product_price,
  	  	'qtytype_id': req.body.qtytype_id,
  	  	'size': req.body.product_size,
  	  	'colour_id': req.body.colour_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'maincatg_id': req.body.maincatg_id,
  	  	'catg_id': req.body.catg_id,
  	  	'subcatg_id': req.body.subcatg_id,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        product_id: result.insertId,
	        message: 'product Inserted successfully'
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
 * @api {post} /admin/editproduct/   update product details
 * @apiName updateProduct
 * @apiGroup /admin/product 
 * @apiParam {Number} product_id    	Mandatory product id to update particuler record.
 * @apiParam {String} product_name  	Mandatory Product Name.
 * @apiParam {String} product_description  Mandatory Product description.
 * @apiParam {Number} product_price 	Mandatory Product alias without space.
 * @apiParam {Number} qtytype_id  	Mandatory Product Quantity foreign key.
 * @apiParam {Number} [size]  optional product size.
 * @apiParam {Number} [colour_id]  optional product color foreign key.
 * @apiParam {Number} vendor_id    Admin will select vendor id.
 * @apiParam {Number} maincatg_id   Mandatory Main Category table foreign key.
 * @apiParam {Number} catg_id 	Mandatory category table foreign key.
 * @apiParam {Number} subcatg_id   Sub Category table foreign key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateProduct = function(req, res) {
  	ProductId = req.body.product_id;
  productCRUD.update({'product_id' : ProductId}, {
  		'product_name':req.body.product_name,
  	  	'product_description':req.body.product_description,
  	  	'product_price':req.body.product_price,
  	  	'qtytype_id': req.body.qtytype_id,
  	  	'size': req.body.product_size,
  	  	'colour_id': req.body.colour_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'maincatg_id': req.body.maincatg_id,
  	  	'catg_id': req.body.catg_id,
  	  	'subcatg_id': req.body.subcatg_id,
  	  	'modified_on': env.timestamp(),
  	  	'IsActive':1
  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'product successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /admin/deleteProduct/:id delete particuler product from database
 * @apiName deleteProduct
 * @apiGroup /admin/product
 * @apiParam {Number} product_id   Product id to delete particule record from primary key.
 *
 */
exports.deleteProduct = function(req,res){
	productCRUD.destroy({
	    'product_id': req.body.product_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'product Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'product Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
