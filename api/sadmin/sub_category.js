var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var categoryCRUD = CRUD(connection,'sub_category');


/**
 * @api {get} /admin/allsubcategory generate list of categories
 * @apiName findAll
 * @apiGroup /admin/sub_category
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT mt.maincatg_name, ct.catg_name, t.* FROM `sub_category` as t left join category as ct on t.catg_id=ct.catg_id left join main_category as mt on mt.maincatg_id=ct.maincatg_id WHERE t.IsActive=1 order by t.subcatg_id desc", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /admin/getsubcategory/:id get particuler category details
 * @apiName findById
 * @apiGroup /admin/sub_category
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
 * @api {post} /admin/addsubcategory/   add new category
 * @apiName insertSubCategory
 * @apiGroup /admin/sub_category
 * @apiParam {Number} admin_id     		Loggedin admin user id.
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
  	  	'admin_id': req.body.admin_id,
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
 * @api {post} /admin/editsubcategory/   update category details
 * @apiName updateSubCategory
 * @apiGroup /admin/sub_category
 * @apiParam {Number} admin_id     		Loggedin admin user id.
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
  	  	'admin_id': req.body.admin_id,
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
 * @api {get} /admin/deletesubCategory/:id delete particuler sub category from database
 * @apiName deleteSubCategory
 * @apiGroup /admin/sub_category
 * @apiParam {Number} subcatg_id   Sub Category id to delete particule record from primary key.
 *
 */

exports.deleteSubCategory = function(req, res) {
	var subcatg_id=parseInt(req.params.id);
  categoryCRUD.destroy({'subcatg_id' : subcatg_id}, function (err, vals) {
  	console.log(vals.affectedRows);
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		      message:'SubCateory Deleted successfully'};
	  	res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not found '};
	  	      res.jsonp(resdata);
	  	     }
      });
   };
