var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('../environment');
var connection = env.Dbconnection;

var orders = {
  findAll: function (req, res) {
    var sql = 'select o.id_pk, o.product_title, o.product_desciption, o.amount, concat(s.first_name, " ", s.last_name) as sellerName, s.email_id as sellerEmail,  concat(b.first_name, " ", b.last_name) as buyerName, b.mobile_number as buyerMobile, b.email_id as buyerEmail '+
              'from new_orders o'+
              'join users s on o.seller_id = s.user_id '+
              'JOIN users b on o.buyer_id = s.user_id '+
              'LEFT JOIN products p on p.product_id = o.product_id';
    connection.query( sql, function (err, responsedata) {
      return res.jsonp(responsedata, 200);
    });
  }
};

module.exports = orders
