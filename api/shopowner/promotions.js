var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var promotionCRUD = CRUD(connection,'promotions');


/**
 * @api {get} /shop/allpromotions generate list of promotions
 * @apiName findAll
 * @apiGroup /ShopOwner/promotions
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from promotions where IsActive=1 limit 10", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};

/**
 * @api {get} /shop/getpromotion/:id get particuler promotions details
 * @apiName findById
 * @apiGroup /ShopOwner/promotions
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from promotions where promo_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectPromotion = function(req,res){
  	  promotionCRUD.load({
  	  	'promo_id':req.body.promo_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'Promotion List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'Promotion List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /shop/addpromotion/   add new product
 * @apiName insertPromotion
 * @apiGroup /ShopOwner/promotions
 * @apiParam {String} promo_name  	Mandatory promotion name.
 * @apiParam {String} promo_desc  Mandatory promotion description.
 * @apiParam {Number} promo_from_date 	Mandatory promotion from date.
 * @apiParam {Number} promo_to_date  	Mandatory promotion to date.
 * @apiParam {Number} promo_disc_perc  Mandatory promotion discription percentage.
 * @apiParam {Number} product_id   Mandatory promotion prodcut id.
 * @apiParam {Number} vendor_id    Mandatory product vendor id.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertPromotion = function(req,res){
  	  promotionCRUD.create({
  	  	'promo_name':req.body.promo_name,
  	  	'promo_desc':req.body.promo_desc,
  	  	'promo_from_date':req.body.promo_from_date,
  	  	'promo_to_date': req.body.promo_to_date,
  	  	'promo_disc_perc': req.body.promo_disc_perc,
  	  	'product_id': req.body.product_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        promo_id: result.insertId,
	        message: 'Promotion Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        message: 'Promotion Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}


/**
 * @api {post} /shop/editpromotion/   update product details
 * @apiName updatePromotion
 * @apiGroup /ShopOwner/promotions 
 * @apiParam {Number} product_id    	Mandatory product id to update particuler record.
 * @apiParam {String} promo_name  	Mandatory promotion name.
 * @apiParam {String} promo_desc  Mandatory promotion description.
 * @apiParam {Number} promo_from_date 	Mandatory promotion from date.
 * @apiParam {Number} promo_to_date  	Mandatory promotion to date.
 * @apiParam {Number} promo_disc_perc  Mandatory promotion discription percentage.
 * @apiParam {Number} product_id   Mandatory promotion prodcut id.
 * @apiParam {Number} vendor_id    Mandatory product vendor id.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updatePromotion = function(req, res) {
  	PromoId = req.body.promo_id;
  promotionCRUD.update({'promo_id' : PromoId}, {
  		'promo_name':req.body.promo_name,
  	  	'promo_desc':req.body.promo_desc,
  	  	'promo_from_date':req.body.promo_from_date,
  	  	'promo_to_date': req.body.promo_to_date,
  	  	'promo_disc_perc': req.body.promo_disc_perc,
  	  	'product_id': req.body.product_id,
  	  	'vendor_id': req.body.vendor_id,
  	  	'modified_on': env.timestamp(),
  	  	'IsActive':1
  }, function (err, vals) {
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		    message:'promotion successfully updated'};
	  		res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not updated'};
	  	      res.jsonp(resdata);
	  	}
    });
}

/**
 * @api {get} /shop/deletepromotion/:id delete particular promotion from database
 * @apiName deletePromotion
 * @apiGroup /ShopOwner/promotions
 * @apiParam {Number} promo_id  promotion id to delete particular record from primary key.
 *
 */
exports.deletePromotion = function(req,res){
	promotionCRUD.destroy({
	    'promo_id': req.body.promo_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'promotion Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'promotion Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}
