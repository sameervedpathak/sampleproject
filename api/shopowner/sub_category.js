var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var categoryCRUD = CRUD(connection,'sub_category');


/**
 * @api {get} /shop/allsubcategory generate list of categories
 * @apiName findAll
 * @apiGroup /ShopOwner/sub_category
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from sub_category where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /shop/getsubcategory/:id get particuler category details
 * @apiName findById
 * @apiGroup /ShopOwner/sub_category
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from sub_category where subcatg_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectSubCategory = function(req,res){
  	  categoryCRUD.load({
  	  	'subcatg_id':req.body.maincatg_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'sub category List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'sub category List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /shop/addsubcategory/   add new category
 * @apiName insertSubCategory
 * @apiGroup /ShopOwner/sub_category
 * @apiParam {Number} catg_id   	Category id to update particule record from forgien key.
 * @apiParam {String} subcatg_name  	Mandatory Sub Category Name.
 * @apiParam {String} subcatg_description  Mandatory sub category description.
 * @apiParam {String} subcatg_alias 	Mandatory sub category alias without space.
 * @apiParam {Number} vendor_id     Loggedin users vendor id.
 * @apiParam {Number} maincatg_id   Main Category table forgien key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertSubCategory = function(req,res){
  	  categoryCRUD.create({
  	  	'subcatg_name':req.body.subcatg_name,
  	  	'subcatg_description':req.body.subcatg_description,
  	  	'subcatg_alias':req.body.subcatg_alias,
  	  	'catg_id': req.body.catg_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        subcatg_id: result.insertId,
	        message: 'sub category inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'sub category Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /shop/editsubcategory/   update category details
 * @apiName updateSubCategory
 * @apiGroup /ShopOwner/sub_category
 * @apiParam {Number} subcatg_id   	Sub Category id to update particule record from primary key.
 * @apiParam {Number} catg_id   	Category id to update particule record from foreign key.
 * @apiParam {String} subcatg_name  	Mandatory Sub Category Name.
 * @apiParam {String} subcatg_description  Mandatory sub category description.
 * @apiParam {String} subcatg_alias 	Mandatory sub category alias without space.
 * @apiParam {Number} vendor_id     Loggedin users vendor id.
 * @apiParam {Number} maincatg_id   Main Category table forgien key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateSubCategory = function(req, res) {
 	 	SubCategoryid = req.body.subcatg_id;
  categoryCRUD.update({'subcatg_id' : SubCategoryid}, {
  		'subcatg_name':req.body.subcatg_name,
  	  	'subcatg_description':req.body.subcatg_description,
  	  	'subcatg_alias':req.body.subcatg_alias,
  	  	'catg_id': req.body.catg_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'modified_on': env.timestamp(),
  	  	'IsActive':1
  	  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'sub category successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /shop/deletesubCategory/:id delete particuler sub category from database
 * @apiName deleteSubCategory
 * @apiGroup /ShopOwner/sub_category
 * @apiParam {Number} subcatg_id   Sub Category id to delete particule record from primary key.
 *
 */
exports.deleteSubCategory = function(req,res){
	categoryCRUD.destroy({
	    'subcatg_id': req.body.subcatg_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'sub category Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'sub category Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
