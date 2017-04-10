var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var qtytypesCRUD = CRUD(connection,'qtytypes');

/**
 * @api {get} /admin/allqtytypes generate list of users
 * @apiName findAll
 * @apiGroup /admin/qtytypes
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from qtytypes where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /admin/getqtytype/:id get particuler user details
 * @apiName findById
 * @apiGroup /admin/qtytypes
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from qtytypes where QtyType_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectQtyTypes = function(req,res){
  	  qtytypesCRUD.load({
  	  	'QtyType_id':req.body.QtyType_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'Qty Types List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'Qty Types List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /admin/addqtytype/   add new Qty Types
 * @apiName insertQtyType
 * @apiGroup /admin/qtytypes
 * @apiParam {String} QtyType_Desc    Mandatory QtyType_Desc.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertQtyType = function(req,res){
  	  qtytypesCRUD.create({
  	  	'QtyType_Desc':req.body.QtyType_Desc,
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        QtyType_id: result.insertId,
	        message: 'Qty type inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'Qty type Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /admin/editqtytypes/   update Qty Types details
 * @apiName updateQtyType
 * @apiGroup /admin/qtytypes
 * @apiParam {Number} QtyType_id  	primary key to update particuler record.
 * @apiParam {String} QtyType_Desc    Mandatory QtyType_Desc.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateQtyType = function(req, res) {
 	 	qtytypeid = req.body.QtyType_id;
  	qtytypesCRUD.update({'QtyType_id' : qtytypeid}, {
  		'QtyType_Desc':req.body.QtyType_Desc,
  	  	'IsActive':1
  	  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'Quantity types successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /admin/deleteqtytypes/:id delete particuler QtyTypes from database
 * @apiName deleteQtyTypes
 * @apiGroup /admin/qtytypes
 * @apiParam {Number} QtyType_id  Qty type id to delete particule record from primary key.
 *
 */
exports.deleteQtyTypes = function(req,res){
	qtytypesCRUD.destroy({
	    'QtyType_id': req.body.QtyType_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'Quantity type deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'Quantity type failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
