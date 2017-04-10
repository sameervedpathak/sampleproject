var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var vtaxMastersCRUD = CRUD(connection,'vendorstaxMaster');


/**
 * @api {get} /shop/allVendorsTaxMaster generate list of vendors tax master
 * @apiName findAll
 * @apiGroup /ShopOwner/vendorstaxmaster
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from vendorstaxMaster where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /shop/getvendortaxmaster/:id get particuler vendor details
 * @apiName findById
 * @apiGroup /ShopOwner/vendorstaxmaster
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from vendorstaxMaster where srno =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectVendorTaxMaster = function(req,res){
  	  vtaxMastersCRUD.load({
  	  	'srno':req.body.srno
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'vendor tax master list'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'vendor tax master List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /shop/addvendortaxmaster/   add new vendor
 * @apiName insertVendortax
 * @apiGroup /ShopOwner/vendorstaxmaster
 * @apiParam {Number} vendor_id  Mandatory vendor_id.
 * @apiParam {Number} TaxId	 Mandatory TaxId forgien key of taxmasters.
 * @apiParam {String} TaxDesc Mandatory vendor Tax Desc.
 * @apiParam {String} TaxName  Mandatory TaxName.
 * @apiParam {Number} TaxPerc  Mandatory TaxPerc.
 * @apiParam {Number} IsApplicable  Mandatory IsApplicable.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertVendorTaxMaster = function(req,res){
  	  vtaxMastersCRUD.create({
  	  	'vendor_id':req.body.vendor_id,
  	  	'TaxId':req.body.TaxId,
  	  	'TaxDesc':req.body.TaxDesc,
  	  	'TaxName': req.body.TaxName,
  	  	'TaxPerc':req.body.TaxPerc,
  	  	'IsApplicable': req.body.IsApplicable,
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        vendor_id: result.insertId,
	        message: 'Vendor tax master Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'vendor tax master Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /shop/editvendortaxmaster/   update vendor details
 * @apiName updateVendorTaxMaster
 * @apiGroup /ShopOwner/vendorstaxmaster
 * @apiParam {Number} vendor_id  Mandatory vendor_id.
 * @apiParam {Number} TaxId	 Mandatory TaxId forgien key of taxmasters.
 * @apiParam {String} TaxDesc Mandatory vendor Tax Desc.
 * @apiParam {String} TaxName  Mandatory TaxName.
 * @apiParam {Number} TaxPerc  Mandatory TaxPerc.
 * @apiParam {Number} IsApplicable  Mandatory IsApplicable
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateVendorTaxMaster = function(req, res) {
 	
 	srnoid = req.body.srno;
  vtaxMastersCRUD.update({'srno' : srnoid}, {
  		'vendor_id':req.body.vendor_id,
  	  	'TaxId':req.body.TaxId,
  	  	'TaxDesc':req.body.TaxDesc,
  	  	'TaxName': req.body.TaxName,
  	  	'TaxPerc':req.body.TaxPerc,
  	  	'IsApplicable': req.body.IsApplicable,
  	  	'IsActive':1
  	  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'Vendor tax master successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /shop/deleteVendortaxmaster/:id delete particuler vendor from database
 * @apiName deleteVendortaxmaster
 * @apiGroup /ShopOwner/vendorstaxmaster
 * @apiParam {Number} srno   Vendor tax master id to delete particular record from primary key.
 *
 */
exports.deleteVendortaxmaster = function(req,res){
	vtaxMastersCRUD.destroy({
	    'srno': req.body.srnoid,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'vendor tax master Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'vendor tax master Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
