var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var imageCRUD = CRUD(connection,'images');

var uploadPic = function(recordid, filedata,imageFor, callback1) {
var imagedata = filedata;

  //var imagedata1 = req.body.attachmentfile2;

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
  //var decodedImg1 = decodeBase64Image(imagedata1);

  var imageBuffer = decodedImg.data;
  //var imageBuffer1 = decodedImg1.data;

  var type = decodedImg.type;
  //var type1 = decodedImg1.type;
  function getRandomSpan() {
      return Math.floor((Math.random() * 99999999999) + 1);
  };
  var fileName = getRandomSpan() + "_product.jpg";
  //var fileName1 = getRandomSpan() + "image.jpg";
  //console.log(fileName1);
  //console.log(fileName1);

  try {
      //fs.writeFileSync( enviroment.uploadpath + "assets/productimages/" + fileName, imageBuffer, 'utf8');
       fs.writeFileSync("F:/my work/client data/Amol-Chawathe/shopping-cart/shopcart/assets/productimages/" + fileName1, imageBuffer1, 'utf8');
  } catch (err) { 
      // console.log(err);
      var response = {
          status: 0,
          message: 'INTERNAL ERROR'
      };
      callback1(response);
  }

  imageCRUD.create({
      'ImageFor':imageFor,
      'RecordId':result.insertId,
      'ImageName':fileName,               
    },function (error, result) {
    if (result) {
        var response = {
              status: true,
              record: vals,  
              productimage: fileName,
              message: 'storyimage Image successfully Updated.'
          };
          callback1(response);
    } else {
      var response = {
            status: false,
            message: 'INTERNAL ERROR'
        };
        callback1(response);
    }
});

  /*storyCRUD.update({
      'id': storyid,
      'userid': userid
  }, {
      'storyimage': fileName
  }, function(err, vals) {
      if (err) {
          var response = {
              status: false,
              message: 'INTERNAL ERROR'
          };
          callback1(response);
      } else {
           
          var response = {
              status: true,
              record: vals,  
              storyimage: fileName,
              message: 'storyimage Image successfully Updated.'
          };
          callback1(response);
      }
  });*/
}