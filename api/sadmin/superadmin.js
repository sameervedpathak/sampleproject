var express = require('express');
var http = require('http');
var CRUD = require('mysql-crud');
var md5 = require('md5');
var env = require('../environment');
var connection = env.Dbconnection;
var userCRUD = CRUD(connection,'adminusers');
var fs = require('fs-extra');
console.log(md5('message'));
// get company details
// exports.getCompany = function(req, res) {
//     var sql = 'SELECT tbl1.user_id, tbl1.email_id FROM `adminusers` tbl1 ';
//     connection.query(sql, function(error, response) {
//         if (error) {
//             console.log(error);
//         } else {
//             res.jsonp(response);
//         }
//     });
// };

// exports.getUserDetails = function(req, res) {
//     var company = {};
//     var sql = 'SELECT tbl1.company_id, tbl1.brand_name as brandName, tbl1.logo_url, tbl1.logo_name, tbl1.web_url, tbl1.legal_name as legalName, tbl1.headquarter, tbl1.description,tbl1.founded_year, tbl1.category, tbl1.subcategory, tbl1.valuation, tbl1.employee_count as employeeCount, CONCAT(tbl2.user_firstname, " ", tbl2.user_lastname) as founderName ' +
//         'FROM `company` tbl1 ' +
//         'LEFT JOIN user tbl2 ON tbl1.founder_id = tbl2.user_id ' +
//         'WHERE tbl1.company_id = ' + req.params.companyId;
//     //console.log(sql);
//     connection.query(sql, function(error, response) {
//         if (error) {
//             console.log(error);
//         } else {
//             company = response;
//             res.jsonp(company);
//         }
//     });
// };

//get Login details

exports.login = function(req,res){
      console.log("body:",req.body);
      var email = req.body.username;
      var password = md5(req.body.password);
      userCRUD.load({
        email_id : email,
        password : password
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

//get companies by userid
exports.getUserDetails = function(req, res) {
    //console.log("req.body 45:", req.params.userId);
    userCRUD.load({ 'email_id': req.params.email_id }, function(error, result) {
        if (result) {
            res.jsonp(result);
        } else {
            console.log("error:", error);
        }
    });
};

exports.addUser = function(req, res) {
    //console.log(req.body);
    userCRUD.load({ 'email_id': req.body.email_id }, function(err, val) {
        if (val.length > 0) {
            return res.sendStatus(409);

        } else {
            userCRUD.create({
                'user_id': req.params.userId,
                'first_name': req.body.brand_name,
                'last_name': req.body.legal_name,
                'email_id': req.body.description,
                'user_type': 'Admin',
                'added_by': req.params.userId,
                'password': req.body.headquarter,
                'mobile_number': req.body.category,
                //'web_url': req.body.web_url,
                //'subcategory': req.params.subcategory,
                'created_on': env.timestamp(),
                'modified_on': env.timestamp(),
                'isactive' : 1
            }, function(error, result) {
                console.log(error);
                if (result) {
                    //console.log(result);
                    //return res.sendStatus(200).send("company-created");
                    if (req.body.attachmentfile1 != undefined) {
                        var imagedata = req.body.attachmentfile1;
                        var matches = "";

                        function decodeBase64Image(dataString) {
                            //console.log("dataString 83:", dataString);
                            var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                                response = {};
                            if (matches.length !== 3) {
                                return new Error('Invalid input string');
                            }

                            response.type = matches[1];
                            response.data = new Buffer(matches[2], 'base64');
                            return response;
                        };

                        var decodedImg = decodeBase64Image(imagedata);

                        var imageBuffer = decodedImg.data;
                        var type = decodedImg.type;
                        var fileName = getRandomSpan() + "image.jpg";
                        //console.log(fileName);

                        try {
                            fs.writeFileSync("/home/node/80desings/public/images/company/companylogo/" + fileName, imageBuffer, 'utf8');
                        } catch (err) {
                            console.log(err);
                            var response = {
                                status: 0,
                                message: 'INTERNAL ERROR'
                            };
                            res.jsonp(response);
                        }

                        companyCRUD.update({
                            'company_id': result.insertId
                        }, {
                            'logo_name': fileName,

                        }, function(err, vals) {
                            if (err) {
                                var response = {
                                    status: 0,
                                    message: 'INTERNAL ERROR'
                                };
                                res.jsonp(response);
                            } else {
                                var response = {

                                    status: 1,
                                    message: 'Company successfully added.',
                                    val: result
                                };
                                res.jsonp(response);
                            }
                        });
                    } else {
                        var resdata = {
                            status: 2,
                            message: 'NO image',
                            val: result
                        };
                        res.jsonp(resdata);
                    }
                    /* }*/
                } else {
                    return res.sendStatus(500).send("error");
                }
            });
        }
    });

    function getRandomSpan() {
        return Math.floor((Math.random() * 99999999999) + 1);
    };

};

// exports.getallcompanies = function(req,res){
//  companyCRUD.load({},function(error, result){
//    console.log(result);
//    res.jsonp(result);
//  });
// }
