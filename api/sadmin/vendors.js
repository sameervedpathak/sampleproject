var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var vendorsCRUD = CRUD(connection,'vendors');


/**
 * @api {get} /admin/allVendors generate list of vendors
 * @apiName findAll
 * @apiGroup /admin/vendors
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from vendors where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /admin/getvendor/:id get particuler vendor details
 * @apiName findById
 * @apiGroup /admin/vendors
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from vendors where vendor_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectVendor = function(req,res){
  	  vendorsCRUD.load({
  	  	'vendor_id':req.body.vendor_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'vendors List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'vendors List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /admin/addvendor/   add new vendor
 * @apiName insertVendor
 * @apiGroup /admin/vendors
 * @apiParam {String} first_name  	Mandatory vendor first_name.
 * @apiParam {String} last_name	  Mandatory vendor last_name.
 * @apiParam {String} email_id 	Mandatory vendor email_id.
 * @apiParam {String} user_type     Mandatory user_type.
 * @apiParam {String} password   Mandatory password.
 * @apiParam {String} company_name   Mandatory company_name.
 * @apiParam {Number} mobile_number   Mandatory mobile_number.
 * @apiParam {String} country_id  	Mandatory vendor country_id.
 * @apiParam {String} address	  Mandatory vendor address.
 * @apiParam {String} apartment Mandatory vendor apartment.
 * @apiParam {String} city_id  Mandatory city_id.
 * @apiParam {String} state_id Mandatory state_id.
 * @apiParam {String} zip   Mandatory zip.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertVendor = function(req,res){
  	  vendorsCRUD.create({
  	  	'first_name':req.body.first_name,
  	  	'last_name':req.body.last_name,
  	  	'email_id':req.body.email_id,
  	  	'user_type': req.body.user_type,
  	  	'password':req.body.password,
  	  	'company_name': req.body.company_name,
  	  	'mobile_number': req.body.mobile_number,
  	  	'country_id':req.body.country_id,
  	  	'address': req.body.address,
  	  	'apartment':req.body.apartment,
  	  	'city_id': req.body.city_id,
  	  	'state_id': req.body.state_id,
  	  	'zip': req.body.zip,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        vendor_id: result.insertId,
	        message: 'Vendor Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'vendor Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /admin/editvendor/   update vendor details
 * @apiName updateVendor
 * @apiGroup /admin/vendors
 * @apiParam {String} first_name  	Mandatory vendor first_name.
 * @apiParam {String} last_name	  Mandatory vendor last_name.
 * @apiParam {String} email_id 	Mandatory vendor email_id.
 * @apiParam {String} user_type     Mandatory user_type.
 * @apiParam {String} password   Mandatory password.
 * @apiParam {String} company_name   Mandatory company_name.
 * @apiParam {Number} mobile_number   Mandatory mobile_number.
 * @apiParam {String} country_id  	Mandatory vendor country_id.
 * @apiParam {String} address	  Mandatory vendor address.
 * @apiParam {String} apartment Mandatory vendor apartment.
 * @apiParam {String} city_id  Mandatory city_id.
 * @apiParam {String} state_id Mandatory state_id.
 * @apiParam {String} zip   Mandatory zip.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateVendor = function(req, res) {
 	
 	vendorid = req.body.vendor_id;
  vendorsCRUD.update({'vendor_id' : vendorid}, {
  		'first_name':req.body.first_name,
  	  	'last_name':req.body.last_name,
  	  	'email_id':req.body.email_id,
  	  	'user_type': req.body.user_type,
  	  	'password':req.body.password,
  	  	'company_name': req.body.company_name,
  	  	'mobile_number': req.body.mobile_number,
  	  	'country_id':req.body.country_id,
  	  	'address': req.body.address,
  	  	'apartment':req.body.apartment,
  	  	'city_id': req.body.city_id,
  	  	'state_id': req.body.state_id,
  	  	'zip': req.body.zip,}, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'Vendor successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /admin/deleteVendor/:id delete particuler vendor from database
 * @apiName deleteVendor
 * @apiGroup /admin/vendors
 * @apiParam {Number} vendor_id   Vendor id to delete particule record from primary key.
 *
 */
exports.deleteVendor = function(req,res){
	vendorsCRUD.destroy({
	    'vendor_id': req.body.vendor_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'vendor Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'vendor Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
