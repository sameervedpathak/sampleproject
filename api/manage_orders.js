var mysql = require('mysql');
var CRUD = require('mysql-crud');
var async = require("async");
var env = require('./environment');
var connection = env.Dbconnection;
exports.getPurchases = function( req, res) {
  var userId = req.params.userId;
  var sql = 'select o.id_pk as orderId, o.product_id as productId, o.product_title as productTitle, o.product_desciption as productDescription, concat(s.first_name, " ", s.last_name) as sellerName, s.mobile_number as sellerMobile, s.email_id as sellerEmail '+
            'from new_orders o '+
            'left join users s on o.seller_id = s.user_id '+
            'where buyer_id = ?';
            console.log(userId);
  connection.query( sql, userId, function( err, result ) {
    console.log(err);
    if(err) res.sendStatus(405);

    if(result){
      res.jsonp(result);
    }
  });
};

exports.getOrders = function( req, res) {
  var userId = req.params.userId;
  var sql = 'select o.id_pk as orderId, o.product_id as productId, o.product_title as productTitle, o.product_desciption as productDescription, concat(b.first_name, " ", b.last_name) as buyerName, b.mobile_number as buyerMobile, b.email_id as buyerEmail '+
            'from new_orders o '+
            'left join users b on o.buyer_id = b.user_id '+
            'where seller_id = ?';
  connection.query( sql, userId, function( err, result ) {
    console.log(err);
    if(err) res.sendStatus(405);

    if(result){
      res.jsonp(result);
    }
  });
};
