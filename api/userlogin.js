var express = require('express');
var http = require('http');
var CRUD = require('mysql-crud');
var md5 = require('md5');
var env = require('./environment');
var connection = env.Dbconnection;
var userCRUD = CRUD(connection,'users');

exports.login = function(req,res){
  console.log(req.body);
      var email = req.body.user_email;
      var password = md5(req.body.user_password);
      userCRUD.load({
        email_id : email,
        password : password,
        IsActive : 1
      }, function (err, val) {
        var resdata={
            record:'',
            status:false,
            message :'err'
        };
        if(val.length>0){
          resdata.record=val;
          resdata.status=true;
          resdata.message='successfully login welcome ';
          res.jsonp(resdata);
        }else{
          resdata.status = false;
          resdata.message = 'Wrong user name or password';
          res.jsonp(resdata);
      }
  });
}

exports.verify = function(req, res) {
  var splitData = req.params.id.split("-");
  var userid = splitData[0];
  var verifyCode = splitData[1];
  userCRUD.update({user_id : userid,
        verify : verifyCode
       }, {
        'verify':'',
        'IsActive':1
      }, function (err, vals) {
    if(parseInt(vals.affectedRows)>0){
        /*var responsedata = {
          status: true,
          record: vals,
          message: 'successfully verified user emailid'
        }
        res.jsonp(responsedata);*/
        res.redirect('/');
      }else{
         var resdata={status:false,
            message:'Verification failed'};
            res.jsonp(resdata);
            //res.redirect('/');
      }
    });
};

exports.fblogin = function(req,res){
      var email = req.body.user_email;
      userCRUD.load({
        'email_id' : email,
        'facebookId': req.body.facebookId,
      }, function (err, val) {

        if(err) res.sendstatus(403);

        if(val.length>0){
          var resdata ={
            record:val,
            message:'successfully login welcome',
            status:true
          };
          res.jsonp(resdata);
        }else{
          userCRUD.create({
            'first_name': req.body.user_fname,
            'last_name': req.body.user_lname,
            'email_id': req.body.user_email,
            'facebookId': req.body.facebookId,
            'avatar': req.body.avatar,
            'created_on':env.timestamp(),
            'IsActive':1
          },function(error, result) {

            if (error) res.sendstatus(403);
            // get the user details to send response
            userCRUD.load({
              'email_id' : email,
              'facebookId': req.body.facebookId,
            }, function( err, result ) {
              if (err)  res.sendstatus(403);

              if (result) {
                var resdata = {
                  record:result,
                  status:true,
                  message:'successfully login welcome'
                };
                res.jsonp(resdata);
              }
            });

        });
      }
  });
};

exports.signup = function(req,res){
    //console.log(req.body);

    var password = md5(req.body.user_password);
      userCRUD.load({
        email_id : req.body.user_email,
      }, function (err, val) {
        console.log("val:",val.length);
        if(val.length > 0){

            var resdata={
                record:'',
                status:false,
                message :'user already exists..'
            };
          res.jsonp(resdata);
        }else{
        //var verifyCode = makeVerifyid();
        userCRUD.create({
            'first_name': req.body.user_fname,
            'last_name': req.body.user_lname,
            'email_id': req.body.user_email,
            'gender': req.body.gender,
            'birthdate': req.body.birthdate,
            'password': password,
            //'verify': verifyCode,
            'created_on':env.timestamp(),
            'modified_on':env.timestamp(),
            'IsActive':1
          },function(error, result) {
          if (result) {
            //var tomail = req.body.user_fname+" "+req.body.user_lname+'<'+req.body.user_email+'>';
            //var mailmatter = "<a href='"+env.emailBaseUrl+"api/verify/"+result.insertId+"-"+verifyCode+"' target='_blank'>Click to verify email</a>";
            //var subject = "Tifanee - Verification Email";
            //send_mail(tomail,mailmatter,subject)
            responsedata = {
              status: true,
              record: result,
              message: 'user created'
            }
            res.jsonp(responsedata);
          } else {
            responsedata = {
              status: false,
              record: result,
              message: 'user failed to create'
            }
            console.log("error:",error);
            res.jsonp(responsedata);
          }
        });

      }
  });
}

//function for sending email
 function send_mail(tomail,mailmatter,subject) {
    var mailOptions = {
        from: 'Shopcart<operations@80startups.com>', // sender address
        to: tomail, // list of receivers
        //cc: 'Nadeem Shaikh<nadeem@80startups.com>', // list of receivers
        //bcc: ['saurabh.undre@80startups.com', '"Ankush" <ankush@80Startups.com>'],
        subject: subject, // Subject line
        html: mailmatter // html body
      };
      //console.log(mailOptions);
      env.transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

function makeVerifyid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


// business module login
exports.normallogin = function(req,res){

      var email = req.body.user_email;
      var password = md5(req.body.user_password);
      businessCRUD.load({
        email_id : email,
        password : password
      }, function (err, val) {
        var resdata={
            record:'',
            status:false,
            message :'err'
        };
        if(val.length > 0){
          resdata.record=val;
          resdata.status=true;
          resdata.message='successfully login welcome ';
        }else{
          resdata.status = false;
          resdata.message = 'Wrong email or password combination';
      }
      res.jsonp(resdata);
  });
};
