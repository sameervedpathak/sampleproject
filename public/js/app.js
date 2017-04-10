// Invoke 'strict' JavaScript mode
'use strict';

// Set the main application name
var ApplicationModuleName = 'DemoApp';


// Create the main application
var SampleApplicationModule = angular.module('DemoApp', ['ui.router',
  'ui.bootstrap', 'angular-storage', 'ngMessages', 'ngFacebook',
  'angularGrid', 'rorymadden.date-dropdowns', 'ngFileUpload'
]);

SampleApplicationModule
.run(function( $rootScope, $state ) {
  // Load the facebook SDK asynchronously
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script'); 
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/all.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());

  //stateChange event
  $rootScope.$on( '$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
    $rootScope.currentState = toState.name;
    $rootScope.previousState = fromState.name;
  });


})


.config(['$urlRouterProvider', '$stateProvider',
    'storeProvider', '$facebookProvider',
    function($urlRouterProvider, $stateProvider, storeProvider, $facebookProvider) {
      $facebookProvider.setAppId('1748065122121840');
      //storeProvider.setStore('sessionStorage');

      $urlRouterProvider.otherwise('/home');
      $stateProvider
        .state('signin', {
          url: '/signin',
          templateUrl: 'templates/signin.html',
          controller: "MainController"
        })

      .state('addproducts', {
          url: '/addproducts',
          templateUrl: 'templates/add_products.html',
          controller: "addProductCntrl"
        })
        .state('editproducts', {
          url: '/editproducts/:productid',
          templateUrl: 'templates/edit_products.html',
          controller: "productcontroller"
        })
        .state('productdetails', {
          url: '/productdetails/:productid',
          templateUrl: 'templates/product_details.html',
          controller: "productDetailCntrl"
        })
        .state('supercategoryproducts', {
          url: '/allproducts/:supid',
          templateUrl: 'templates/list_products.html',
          controller: "productcontroller"
        })
        .state('myproducts', {
          url: '/myproducts/:uid',
          templateUrl: 'templates/my_products.html',
          controller: "myProductCntrl"
        })
        .state('categoryproducts', {
          url: '/products/:sid/:catid',
          templateUrl: 'templates/list_products.html',
          controller: "productcontroller"
        })
        .state('myprofile', {
          url: '/myprofile/:uid',
          templateUrl: 'templates/my_profile.html',
          controller: "productcontroller"
        })
        .state('signup', {
          url: '/signup',
          templateUrl: 'templates/signup.html',
          controller: "usercontroller"
        })
        .state('cart', {
          url: '/cart',
          templateUrl: 'templates/cart.html'
        })
        .state('checkout', {
          url: '/checkout',
          params:{
            product:null
          },
          templateUrl: 'templates/checkout.html',
          controller: 'checkoutCtrl'
        })
        .state('home', {
          url: '/home',
          templateUrl: 'templates/welcomepage.html'
        })

        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'templates/user_dashboard.html',
          controller: 'usercontroller'
        });

    }
  ]);
