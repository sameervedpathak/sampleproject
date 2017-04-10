'use strict';
SampleApplicationModule.factory('userproduct', function($http){
  function addProduct(parameters, callback) {
    console.log(parameters);
   /* console.log(parameters.imageCount.imagecount);*/
   attachImages(parameters, function(body) {
     console.log(body);
     $http.post(baseUrl + 'addproduct', parameters )
     .success(function(res, req){
       callback(res);
     }).error(function(err){
       callback(false);
     });
   });

 }

  function attachImages(parameters, callback) {
    if (parameters.images.length > 0) {
      var files = [];
      async.each( parameters.images, function(image, nextimage) {
        convertImgToBase64(image, function(response) {
          var file = {
            'file': response,
            'type': 'image',
          };
          files.push(file);
          // console.log('files', files);
          nextimage();
        });
      }, function done(error) {
        parameters.images = files;
        callback(parameters);
      });
    }else {
      callback(parameters);
    }
  }

  //  convert image to  base64
  function convertImgToBase64(blob, callback){
    var reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      callback(reader.result);
    };
  }

  function getProductDetails(productid, callback){
    $http.get(baseUrl + 'getproductbyid/'+productid)
      .success(function(res, req){
        callback(res);
      }).error(function(err){
        callback(false);
      });
  }

  // update user status
  function updateProduct(parameters ,callback) {
    //console.log(parameters);
    $http.post(baseUrl + 'editProduct', parameters).success(function(res, req){
      callback(res);
    }).error(function(err){

    });
  };

  // update user status
  function deleteProduct(productid ,callback) {
    $http.get(baseUrl + 'deleteProduct/'+productid).success(function(res, req){
      callback(res);
    }).error(function(err){

    });
  };

  function getProductImages( productId, callback ) {
    //console.log(parameters);
    $http.get( baseUrl + 'getProductImages/'+productId ).success(function(res, req){
      callback(res);
    }).error(function(err){
    });
  };

  //  get agents list
  function getProductCategoryList(callback) {
      $http.get( baseUrl + 'admin/allcategory')
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

  //  get agents list
  function getParentCategoryList(callback) {
      $http.get( baseUrl + 'admin/maincategory')
      .success(function( response, status ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

//  get agents list
  function getUserProducts(parameters,callback) {
    //console.log(parameters);

    $http.get( baseUrl + 'getUserProducts/' + parameters.UserId)
    .success(function( response, req ){
      callback(response);
    }).error(function( error, status ){
      callback(false);
    });
  }

  //  get agents list
  function getAllProducts(callback) {
      $http.get( baseUrl + 'allproduct')
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

  //  get agents list
  function getProductByCategory(catgid,callback) {
      $http.get( baseUrl + 'getAllProductByCategory/'+catgid)
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

  //  get agents list
  function getProductBySuperCategory(supercatgid,callback) {
      $http.get( baseUrl + 'getAllProductBySuperCategory/'+supercatgid)
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

  //  get agents list
  function getCategoryfromSuperCategory(supercatgid,callback) {
      $http.get( baseUrl + 'admin/getCategoryfromSuperCategory/'+supercatgid)
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

  function getCurrency(callback) {
      $http.get( baseUrl + 'allcurrency')
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

  //  get agents list
  function getUserDetailsFromId(userid,callback) {
      $http.get( baseUrl + 'getUserDetails/'+userid)
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

 function updateProfile (userinfo,callback){
         $http.post(baseUrl + 'updateUser', userinfo).success(function(res,req){
                callback(res);
         }).error(function(){
            console.log("problem In update");
         });
    }


	return{
		getUserProducts:getUserProducts,
    updateProduct:updateProduct,
    getProductByCategory: getProductByCategory,
    getParentCategoryList: getParentCategoryList,
    addProduct:addProduct,
    deleteProduct:deleteProduct,
    getProductCategoryList:getProductCategoryList,
    getCategoryfromSuperCategory:getCategoryfromSuperCategory,
    getAllProducts:getAllProducts,
    getProductDetails:getProductDetails,
    getProductBySuperCategory:getProductBySuperCategory,
    getCurrency:getCurrency,
    getProductImages:getProductImages,
    getUserDetailsFromId:getUserDetailsFromId,
    updateProfile:updateProfile,
		// ,
		// update:function(){
    //
		// }
	}
})
