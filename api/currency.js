var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var currencyCRUD = CRUD(connection,'currency');

/**
 * @api {get} /allcurrency generate list of currency
 * @apiName findAll
 * @apiGroup /currency
 *
 */
	exports.findAll = function(req, res) {

		connection.query("SELECT * FROM `currency` WHERE IsActive='1'", function(err, rows) {
			if(rows.length>0){
				res.jsonp(rows);
			}else{
				res.jsonp("");
			}
		});
	};

