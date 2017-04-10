var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var taxMasterCRUD = CRUD(connection,'taxesMaster');


/**
 * @api {get} /admin/allTaxMaster generate list of taxes master
 * @apiName findAll
 * @apiGroup /admin/taxmaster
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from taxesMaster where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /admin/gettaxmaster/:id get particuler tax details
 * @apiName findById
 * @apiGroup /admin/taxmaster
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from taxesMaster where TaxId =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectTaxMaster = function(req,res){
  	  taxMasterCRUD.load({
  	  	'TaxId':req.body.TaxId
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'tax master list'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'tax master List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /admin/addtaxmaster/   add new tax master
 * @apiName insertTaxMaster
 * @apiGroup /admin/taxmaster
 * @apiParam {String} TaxDesc Mandatory Tax Desc.
 * @apiParam {String} TaxName  Mandatory TaxName.
 * @apiParam {Number} TaxPerc  Mandatory TaxPerc.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertTaxMaster = function(req,res){
  	  taxMasterCRUD.create({
  	  	'TaxDesc':req.body.TaxDesc,
  	  	'TaxName': req.body.TaxName,
  	  	'TaxPerc':req.body.TaxPerc,
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        taxid: result.insertId,
	        message: 'tax master Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'tax master Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /admin/editTaxMaster/   update tax master details
 * @apiName updateTaxMaster
 * @apiGroup /admin/taxmaster
 * @apiParam {Number} TaxId	 Mandatory TaxId primary key of taxmasters.
 * @apiParam {String} TaxDesc Mandatory vendor Tax Desc.
 * @apiParam {String} TaxName  Mandatory TaxName.
 * @apiParam {Number} TaxPerc  Mandatory TaxPerc.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateTaxMaster = function(req, res) {
 	
 	TaxId = req.body.TaxId;
  taxMasterCRUD.update({'TaxId' : TaxId}, {
  		'TaxDesc':req.body.TaxDesc,
  	  	'TaxName': req.body.TaxName,
  	  	'TaxPerc':req.body.TaxPerc,
  	  	'IsActive':1
  	  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'tax master successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /admin/deleteTaxmaster/:id delete particuler tax master from database
 * @apiName deleteTaxMaster
 * @apiGroup /admin/taxmaster
 * @apiParam {Number} srno   Tax master id to delete particular record from primary key.
 *
 */
exports.deleteTaxMaster = function(req,res){
	taxMasterCRUD.destroy({
	    'TaxId': req.body.TaxId,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'tax master Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'tax master Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
