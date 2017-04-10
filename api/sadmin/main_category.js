var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;
var categoryCRUD = CRUD(connection,'main_category');
var childcategoryCRUD = CRUD(connection,'category');


/**
 * @api {get} /admin/maincategory list main categories
 * @apiName findAll
 * @apiGroup /admin/main_category
 *
 */
exports.findAll = function(req, res) {
	connection.query("SELECT * from main_category where IsActive=1", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};


function fetchID(maincatg_id, callback) {
    connection.query("SELECT * from category where maincatg_id="+rows[i].maincatg_id+" and IsActive=1",function(err, rows) {
        if (err) {
            callback(err, null);
        } else 
            callback(null, rows);
    });
}

exports.getAllParentChildCategory = function(req, res) {
	
	connection.query("SELECT c1.maincatg_id, c1.maincatg_name, c2.catg_id, c2.catg_name FROM main_category c1 LEFT JOIN category c2 ON c2.maincatg_id = c1.maincatg_id where c1.IsActive=1", function(err, rows) {
		if(rows.length>0){

			/*var result = [];
            var resultData = [];
            for(var i in rows){
				var resultChild = [];
	            var childData = [];

				return childData = connection.query("SELECT * from category where maincatg_id="+rows[i].maincatg_id+" and IsActive=1");

            					
				result = {"maincategory": rows[i].maincatg_name, 
                    "category": childData
              	};
				resultData.push(result);

           		
           	}
           	console.log(resultData);*/
			res.jsonp(rows);

		}else{
			res.jsonp("");
		}
	});
};

exports.getdataArray = function(req, res) {
	connection.query("SELECT maincatg_id, maincatg_name from main_category where IsActive=1", function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
	});
};



/**
 * @api {get} /admin/getmaincategory/:id get particuler category details
 * @apiName findById
 * @apiGroup /admin/main_category
 *
 */
exports.findById = function(req, res) {
	console.log(req.params);
	var id = parseInt(req.params.id);
	console.log('findByMCId: ' + id);
	connection.query("SELECT * from main_category where maincatg_id =" + id, function(err, rows) {
		if(rows.length>0){
			res.jsonp(rows);
		}else{
			res.jsonp("");
		}
		//query returns array of arrays we need to return the first one only.
	});
};

exports.selectMainCategory = function(req,res){
  	  categoryCRUD.load({
  	  	'admin_id':req.body.admin_id
  	  },function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'Main Cateory List'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'Main Cateory List Failed'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

 /**
 * @api {post} /admin/addmaincategory/   add new category
 * @apiName insertMainCategory
 * @apiGroup /admin/main_category
 * @apiParam {String} maincatg_name  	Mandatory Category Name.
 * @apiParam {String} maincatg_description  Mandatory category description.
 * @apiParam {String} maincatg_alias 	Mandatory category alias without space.
 * @apiParam {Number} admin_id     		Loggedin admin user id.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertMainCategory = function(req,res){
	console.log(req.body);
  	  categoryCRUD.create({
  	  	'maincatg_name':req.body.maincatg_name,
  	  	'maincatg_description':req.body.maincatg_description,
  	  	'maincatg_alias':req.body.maincatg_alias,
  	  	'admin_id': req.body.admin_id,
  	  	'created_on': env.timestamp(),
  	  	'IsActive':1
  	  },function (error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        maincatg_id: result.insertId,
	        message: 'Main Cateory Inserted successfully'
	     }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: error,
	        maincatg_id: req.body.maincatg_name,
	        message: 'Main Cateory Failed Insert'
	      }
	      res.jsonp(responsedata);
	    }
  });
}

/**
 * @api {post} /admin/editmaincategory/   add new category
 * @apiName updateMainCategory
 * @apiGroup /admin/main_category
 * @apiParam {Number} maincatg_id     	Mandatory Category id to update particuler record.
 * @apiParam {String} maincatg_name  	Mandatory Category Name.
 * @apiParam {String} maincatg_description  Mandatory category description.
 * @apiParam {String} maincatg_alias 	Mandatory category alias without space.
 * @apiParam {Number} admin_id     		Loggedin admin user id.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.updateMainCategory = function(req, res) {
 	CategoryName=req.body.maincatg_name;
 	Description=req.body.maincatg_description;
 	Alias=req.body.maincatg_alias;
 	Modified_on = env.timestamp();
 	Admin_id = req.body.admin_id;
 	MCategoryid=req.body.maincatg_id;
  categoryCRUD.update({'maincatg_id' : MCategoryid}, {maincatg_name:CategoryName,maincatg_description:Description,maincatg_alias:Alias,modified_on:Modified_on,admin_id:Admin_id}, function (err, vals) {
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
 * @api {get} /admin/deletemaincategory/:id delete particuler category from database
 * @apiName deleteMainCategory
 * @apiGroup /admin/main_category
 * @apiParam {Number} maincatg_id   Category id to delete particule record from primary key.
 *
 */
 exports.deleteMainCategory = function(req, res) {
	var maincatg_id=parseInt(req.params.id);
  categoryCRUD.destroy({'maincatg_id' : maincatg_id}, function (err, vals) {
  	console.log(vals.affectedRows);
  	if(parseInt(vals.affectedRows)>0){
  		var resdata={status:true,
  		      message:'Main Cateory Deleted successfully'};
	  	res.jsonp(resdata);
	  	}else{
	  		 var resdata={status:false,
  		      message:'record not found '};
	  	      res.jsonp(resdata);
	  	     }
      });
   };

/*exports.deleteMainCategory = function(req,res){
	categoryCRUD.destroy({
	    'maincatg_id': req.body.maincatg_id,
	   // 'admin_id': req.session.user_id
	  }, function(error, result) {
	    if (result) {
	      responsedata = {
	        status: true,
	        record: result,
	        message: 'Main Cateory Deleted successfully'
	      }
	      res.jsonp(responsedata);
	    } else {
	      responsedata = {
	        status: false,
	        record: result,
	        message: 'Main Cateory Failed to Delete'
	      }
	      res.jsonp(responsedata);
	    }
	    
  });
}*/

exports.viewMainCategory = function(req, res) {
  var id=parseInt(req.params.id);
    categoryCRUD.load({maincatg_id:id}, function (err, val) { 
      res.jsonp(val[0]);
    });  
 }; 
