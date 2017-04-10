SampleApplicationModule.factory('basket', function() {
  var items = [];
  var myBasketService = {};

  myBasketService.addItem = function(item) {
    items.push(item);
  };
  myBasketService.removeItem = function(item) {
    var index = items.indexOf(item);
    items.splice(index, 1);
  };
  myBasketService.items = function() {
    return items;
  };

  return myBasketService;
})
.factory('chartFtry', function( $http ) {
  function processPayment( parameters, callback ) {
    $http.post(baseUrl + 'paynow', parameters )
    .success(function(res, status){
      callback(res, status);
    }).error(function(err, status){
      callback(err, status);
    });
  }
  return{
    processPayment:processPayment,
  };
});
