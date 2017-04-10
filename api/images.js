var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var imageCRUD = CRUD(connection,'images');


/**
 * @api {get} /admin/allproduct generate list of products
 * @apiName findAll
 * @apiGroup /admin/product
 *
 */
exports.findAll = function(req, res) {
	console.log(req.params);
	var recordid = parseInt(req.params.id);
	var imagefor = req.params.flg;
	connection.query("SELECT * from images where RecordId="+recordid+" and ImageFor="+imagefor+" limit 50", function(err, rows) {
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
	var id = parseInt(req.params.imgid);
	var recordid = parseInt(req.params.id);
	var imagefor = req.params.flg;
	connection.query("SELECT * from images where RecordId="+recordid+" and ImageFor="+imagefor+" and ImageId =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectImage = function(req,res){
  	  imageCRUD.load({
  	  	'ImageId':req.body.ImageId
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'Image List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'Image List Failed'
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
exports.insertImage = function(req,res){
  	  imageCRUD.create({
  	  	'ImageName':req.body.ImageName,
  	  	'ImageFor':req.body.ImageFor,
  	  	'RecordId':req.body.RecordId,
  	  	'ImageType': req.body.ImageType,  	  	
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        product_id: result.insertId,
	        message: 'Image Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'Image Failed Insert'
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
exports.updateImage = function(req, res) {
  	ImageId = req.body.ImageId;
  productCRUD.update({'ImageId' : ImageId}, {
  		'ImageName':req.body.ImageName,
  	  	'ImageFor':req.body.ImageFor,
  	  	'RecordId':req.body.RecordId,
  	  	'ImageType': req.body.ImageType,  
  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'image successfully updated'};
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
exports.deleteImage = function(req,res){
	productCRUD.destroy({
	    'ImageId': req.body.ImageId,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'image Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'image Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
