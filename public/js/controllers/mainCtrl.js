SampleApplicationModule.service('imageService', ['$q', '$http', function($q, $http) {
    this.loadImages = function() {
        return $http.jsonp(baseUrl + "allproduct?callback=JSON_CALLBACK");
    };
}]);
SampleApplicationModule.controller('MainController',
    function($scope, $http, $stateParams, $location, $rootScope, $timeout, $facebook, store, imageService, angularGridInstance, $state, user) {
        $rootScope.userSession = store.get('userSession');
        $scope.init = function() {
            $rootScope.userSession = store.get('userSession');
        }

        $scope.init();

        // to refresh the angular grid
        function refresh() {
            angularGridInstance.gallery.refresh();
        }

        // called when the user tries to do fb login
        $scope.facebooklogin = function() {
            // login facebook, if the status is connected or not authorized. if either of the status call the api to get user details
            FB.login(function(response) {
               
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    getFBUserDetails(function(userinfo) {
                        userLogin(userinfo, true);
                    });
                } else if (response.status === 'not_authorized') {
                    // The person is logged into Facebook, but not your app.
                    getFBUserDetails(function(userinfo) {
                        userLogin(userinfo, true);
                    });
                }
            }, { scope: 'public_profile,email' });

        };

        // get user details from facebook API
        function getFBUserDetails(callback) {
            $facebook.api("/me?fields=id,name,email,gender,first_name,last_name,location,website,picture")
                .then(function(response) {
                        var userinfo = {
                            'facebookId': response.id,
                            'user_fname': response.first_name,
                            'user_lname': response.last_name,
                            'user_email': response.email,
                            'avatar': response.picture.data.url,
                            'gender': response.gender
                        };
                        callback(userinfo)
                    },
                    function(err) {
                        $scope.welcomeMsg = "Please log in";
                    });
        }
        // facebook
        function userLogin(user, valid) {
            if (valid) {
                $http.post(baseUrl + 'fblogin', user).success(function(res, req) {
                    if (res.status === true) {
                        var userSession = {
                            'login': true,
                            'facebookId': res.record[0].facebookId,
                            'userid': res.record[0].user_id,
                            'user_email': res.record[0].email_id,
                            'user_name': res.record[0].first_name + " " + res.record[0].last_name,
                            'avatar': res.record[0].avatar
                        };
                        store.set('userSession', userSession);
                        $rootScope.$broadcast('userSession', userSession);
                        $rootScope.userSession = store.get('userSession');
                        $scope.welcomeMsg = "Welcome " + userSession.user_name;
                        $rootScope.isLoggedIn = true;
                        $state.go('home');
                    } else if (res.status === false) {
                        $scope.loginfailuremsg = 'Please Enter Valid Email Address and Password';
                        $scope.showloginfailuremsg = true;
                        // Simulate 2 seconds loading delay
                        $timeout(function() {
                            // Loadind done here - Show message for 3 more seconds.
                            $timeout(function() {
                                $scope.showloginfailuremsg = false;
                            }, 3000);
                            document.getElementById("loginform").reset();
                        }, 2000);
                    }
                }).error(function() {
                    console.log("Connection Problem.");
                });
            }
        }
        // User sign out
        $scope.usersignout = function() {
            store.remove('userSession');
            $rootScope.userSession = {};
            $rootScope.$broadcast('userSession', $rootScope.userSession);
            $state.go('signin');
        };

        // to get categoties from parentcats
        $scope.getAllProductBySuperCategory = function(maincat) {
            $scope.selectedMaincat = maincat;
            user.getProductBySuperCategory(maincat.maincatg_id, function(result) {
                $scope.pics = result;
            });
            // body...
        }

        $scope.getAllSuperCategory = function() {
                console.log("calling getAllSuperCategory");
                imageService.loadImages().then(function(data) {
                    /*console.log(data);
                          data.data.forEach(function(obj){
                              var desc = obj.product_description,
                                  width = 200,
                                  height = 300;
                              obj.actualHeight  = height;
                              obj.actualWidth = width;
                          });*/
                    $scope.pics = data.data;
                    // console.log($scope.pics);
                });
            }
            // intialization function is called every time the scope loads
        var init = function() {
            $scope.selectedMaincat = { maincatg_name: '' };
            // Initialize facebook id
           /* FB.init({
                appId: '383460488654947',
                cookie: true, // enable cookies to allow the server to access
                xfbml: true, // parse social plugins on this page
                version: 'v2.5' // use graph api version 2.5
            });*/
            // load all images through image services
            imageService.loadImages().then(function(data) {
                /*console.log(data);
                      data.data.forEach(function(obj){
                          var desc = obj.product_description,
                              width = 200,
                              height = 300;
                          obj.actualHeight  = height;
                          obj.actualWidth = width;
                      });*/
                $scope.pics = data.data;
                // console.log($scope.pics);
            });
            // get userSession store from local to check if the user has been already logged in
            $rootScope.isLoggedIn = false;
            $rootScope.userSession = store.get('userSession') || {};

            // get major categories to display in the drop down
            user.getParentCategoryList(function(result) {
                $scope.mainCategorylist = result;
                user.getProductCategoryList(function(result) {
                    $scope.Categorylist = result;
                });
            });
        };
        init();

        //function for reset search
        $scope.resetsearch = function() {
            //init();
        }

        $scope.login = function() {
            $http.post(baseUrl + 'login', $scope.userinfo).success(function(res) {
                if (res.status == true) {
                    $state.go('home')
                } else {
                    $scope.errmsg = res.message;
                    $scope.showerrmsg = true;
                    $timeout(function() {
                        $scope.showerrmsg = false;
                    }, 2000);
                }
            }).error(function(error) {
                console.log("error creating account", error);
            });

        };
    });
