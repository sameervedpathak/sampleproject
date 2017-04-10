
SampleApplicationModule.factory('ordersFac', function($http) {

  // get orders to user specific
  function getOrders( userId, callback) {
    $http.get( baseUrl + 'getOrders/' + userId)
    .success(function( response, status) {
      console.log(response);
      callback(response);
    })
    .error(function( error, status ) {
      console.log(error);
    });
  }

  // get orders to user specific
  function getPurchases( userId, callback) {
    $http.get( baseUrl + 'getPurchases/' + userId)
    .success(function( response, status) {
      console.log(response);
      callback(response);
    })
    .error(function( error, status ) {
      console.log(error);
    });
  }
  return{
    getOrders:getOrders,
    getPurchases:getPurchases
  };
});
