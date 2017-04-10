'use strict';
SampleApplicationModule.factory('user', function($http){
  function addProduct(parameters, callback) {
    //console.log(parameters);
   /* console.log(parameters.imageCount.imagecount);*/
      $http.post(baseUrl + 'addproduct', parameters )
      .success(function(res, req){
        callback(res);
      }).error(function(err){
        callback(false);
      });
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

  function getProductImages(parameters,callback) {
    //console.log(parameters);
    $http.post(baseUrl + 'getProductImages/', parameters).success(function(res, req){
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
      .success(function( response, req ){
        callback(response);
      }).error(function( error, status ){
        callback(false);
      });
  }

//  get agents list
  function getUserProducts(parameters,callback) {
    //console.log(parameters);

    $http.post( baseUrl + 'getUserProducts',parameters)
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
  function getProductBySuperCategory(supercatgid, callback) {
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
		// ,
		// update:function(){
    //
		// }
	}
})
