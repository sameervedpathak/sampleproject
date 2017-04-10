SampleApplicationModule.controller('checkoutCtrl', function($scope, $stateParams, $state, chartFtry, store, $rootScope) {
  // do pay now with stripe
  $scope.doPayNow = function () {
    // stripe create tokent to proceed with the payement
    Stripe.card.createToken({
      name: $scope.card.name,
      number: $scope.card.number,
      cvc: $scope.card.cvc,
      exp_month: $scope.card.month,
      exp_year: $scope.card.year
    }, function (status, response) {
      console.log(status, response);
      var params = {
        key: response.id,
        price: $scope.product.Price,
        product_id: $scope.product.UProduct_id,
        seller_id: $scope.product.CreatedBy,
        buyer_id: store.get('userSession').userid,
        title: $scope.product.Ad_Title,
        description: $scope.product.Description
      };
      chartFtry.processPayment(params, function( response, status ) {
        if( status === 200 ) $state.go('home');
      });
    });
  };

  // initialization function
  var init = function () {
    if(!$stateParams.product){
      $state.go('home');
    }
    console.log($stateParams.product);
    Stripe.setPublishableKey('pk_test_XiMhbjsPLWUcQDFLHzZzfFfF');
    // assign the product params to product scope to bind with the html
    $scope.product = $stateParams.product;
    $scope.card = {};
    $scope.adddress = {};
  };
  init();
});
