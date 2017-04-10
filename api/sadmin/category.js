var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var categoryCRUD = CRUD(connection,'category');


/**
 * @api {get} /admin/allcategory generate list of categories
 * @apiName findAll
 * @apiGroup /admin/category
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT t.*,mt.maincatg_name from category as t left join main_category as mt on t.maincatg_id=mt.maincatg_id where t.IsActive=1 order by t.catg_id desc", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

exports.getCategoryfromSuperCategory = function(req, res) {
	var mid = parseInt(req.params.id);
	connection.query("SELECT t.*,mt.maincatg_name from category as t left join main_category as mt on t.maincatg_id=mt.maincatg_id where t.IsActive=1 and t.maincatg_id="+mid+" order by t.catg_id desc", function(err, rows) {
		if(rows.length>0){
			responsedata = {
	        status: true,
	        record: rows,
	        message: 'category List'
	      }
	      res.jsonp(responsedata);
			//res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /admin/getcategory/:id get particuler category details
 * @apiName findById
 * @apiGroup /admin/category
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
 * @api {post} /admin/addcategory/   add new category
 * @apiName insertCategory
 * @apiGroup /admin/category
 * @apiParam {Number} admin_id     Loggedin admin user id.
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
	console.log(req.body);
  	  categoryCRUD.create({
  	  	'catg_name':req.body.catg_name,
  	  	'catg_description':req.body.catg_description,
  	  	'catg_alias':req.body.catg_alias,
  	  	'maincatg_id': req.body.maincatg_id,
  	  	'admin_id': req.body.admin_id,
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
 * @api {post} /admin/editcategory/   update category details
 * @apiName updateCategory
 * @apiGroup /admin/category
 * @apiParam {Number} catg_id   	Category id to update particule record from primary key.
 * @apiParam {Number} admin_id     Loggedin admin user id.
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
 	adminId = req.body.admin_id;
 	Vendor_id = req.body.vendor_id;
 	MCategoryid=req.body.maincatg_id;
 	Categoryid = req.body.catg_id;
  categoryCRUD.update({'catg_id' : Categoryid}, {admin_id:adminId,catg_name:CategoryName,catg_description:Description,catg_alias:Alias,modified_on:Modified_on,maincatg_id:MCategoryid,vendor_id:Vendor_id}, function (err, vals) {
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
 * @api {get} /admin/deleteCategory/:id delete particuler category from database
 * @apiName deleteCategory
 * @apiGroup /admin/category
 * @apiParam {Number} catg_id   Category id to delete particule record from primary key.
 *
 */

 exports.deleteCategory = function(req, res) {
	var catg_id=parseInt(req.params.id);
  categoryCRUD.destroy({'catg_id' : catg_id}, function (err, vals) {
  	console.log(vals.affectedRows);
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		      message:'Cateory Deleted successfully'};
	  	res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not found '};
	  	      res.jsonp(resdata);
	  	     }
      });
   };


exports.viewCategory = function(req, res) {
  var id=parseInt(req.params.id);
    categoryCRUD.load({catg_id:id}, function (err, val) { 
      res.jsonp(val[0]);
    });  
 }; 

