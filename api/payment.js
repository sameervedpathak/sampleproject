var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var stripe = require('stripe')('sk_test_k5FUCqLc8XtBP1UD2SZCVtSw');

exports.cardPayment = function( req, res ) {
  // process the payment through stripe
  var params = req.body;
  var amount = parseFloat(params.price) * 100;
  stripe.charges.create({
    amount: amount,
    currency: 'sgd',
    source: params.key, // obtained with Stripe.js
    description: 'Processing stripe payment '
  }, function(err, charge) {
    // if the payment is successfull then insert the data in the order table
    var orderDetails = {
      buyer_id: params.buyer_id,
      seller_id: params.seller_id,
      stripe_id: charge.source.id,
      stripe_source: params.key,
      product_id: params.product_id,
      product_title: params.title,
      product_desciption: params.description,
      amount: amount,
      posted_on: new Date()
    };
    var sql = "insert into new_orders set ?"
    connection.query(sql, orderDetails, function( error, result ) {
      console.log(error, result);
      res.sendStatus(200);
    });
  });
};
