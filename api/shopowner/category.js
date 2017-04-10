var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var categoryCRUD = CRUD(connection,'category');


/**
 * @api {get} /shop/allcategory generate list of categories
 * @apiName findAll
 * @apiGroup /ShopOwner/category
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from category where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /shop/getcategory/:id get particuler category details
 * @apiName findById
 * @apiGroup /ShopOwner/category
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from category where catg_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectCategory = function(req,res){
  	  categoryCRUD.load({
  	  	'maincatg_id':req.body.maincatg_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'category List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'category List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /shop/addcategory/   add new category
 * @apiName insertCategory
 * @apiGroup /ShopOwner/category
 * @apiParam {String} catg_name  	Mandatory Category Name.
 * @apiParam {String} catg_description  Mandatory category description.
 * @apiParam {String} catg_alias 	Mandatory category alias without space.
 * @apiParam {Number} vendor_id     Loggedin users vendor id.
 * @apiParam {Number} maincatg_id   Main Category table foreign key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertCategory = function(req,res){
  	  categoryCRUD.create({
  	  	'catg_name':req.body.catg_name,
  	  	'catg_description':req.body.catg_description,
  	  	'catg_alias':req.body.catg_alias,
  	  	'maincatg_id': req.body.maincatg_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        catg_id: result.insertId,
	        message: 'category Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'category Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /shop/editcategory/   update category details
 * @apiName updateCategory
 * @apiGroup /ShopOwner/category
 * @apiParam {Number} catg_id   	Category id to update particule record from primary key.
 * @apiParam {String} catg_name  	Mandatory Category Name.
 * @apiParam {String} catg_description  Mandatory category description.
 * @apiParam {String} catg_alias 	Mandatory category alias without space.
 * @apiParam {Number} vendor_id     Loggedin users vendor id.
 * @apiParam {Number} maincatg_id   Main Category table foreign key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateCategory = function(req, res) {
 	CategoryName=req.body.catg_name;
 	Description=req.body.catg_description;
 	Alias=req.body.catg_alias;
 	Modified_on = env.timestamp();
 	Vendor_id = req.body.vendor_id;
 	MCategoryid=req.body.maincatg_id;
 	Categoryid = req.body.catg_id;
  categoryCRUD.update({'catg_id' : Categoryid}, {catg_name:CategoryName,catg_description:Description,catg_alias:Alias,modified_on:Modified_on,maincatg_id:MCategoryid,vendor_id:Vendor_id}, function (err, vals) {
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
 * @api {get} /shop/deleteCategory/:id delete particuler category from database
 * @apiName deleteCategory
 * @apiGroup /ShopOwner/category
 * @apiParam {Number} catg_id   Category id to delete particule record from primary key.
 *
 */
exports.deleteCategory = function(req,res){
	categoryCRUD.destroy({
	    'catg_id': req.body.catg_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'category Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'category Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
