SampleApplicationModule
    .controller('productcontroller', [
        '$scope',
        '$http',
        '$rootScope',
        '$stateParams',
        '$state',
        '$timeout',
        'userproduct',
        'ordersFac',
        'store',
        function($scope, $http, $rootScope, $stateParams, $state, $timeout, userproduct, ordersFac, store, $location) {

            $rootScope.userSession = store.get('userSession');
            console.log($rootScope.userSession);

            console.log("$stateParams:", $stateParams.uid);

            $scope.updateProduct = function(product) {
                var parameters = {
                    UProduct_id: product.UProduct_id,
                    Ad_Title: product.Ad_Title,
                    Description: product.Description,
                    maincatg_id: $scope.parentCat.maincatg_id.maincatg_id,
                    Catg_id: $scope.prodCat.catg_id.catg_id,
                    Price: product.Price,
                    Shipping: product.Shipping,
                    IsSaveLater: 0,
                    CreatedBy: $scope.userSession.userid,
                };

                userproduct.updateProduct(parameters, function(result) {
                    if (result.status) {
                        $state.go('listproducts');
                    }
                });
            };

            $scope.updateProfile = function(userinfo, valid) {
                console.log("userinfo:", userinfo);
                if (valid) {
                    var parameters = {
                        user_id: userinfo.user_id,
                        first_name: userinfo.first_name,
                        last_name: userinfo.last_name,
                        email_id: userinfo.email_id,
                        company_name: userinfo.company_name,
                        mobile_number: userinfo.mobile_number,
                        country_id: userinfo.country_id,
                        address: userinfo.address,
                        state_id: userinfo.state_id,
                        city_id: userinfo.city_id,
                        zip: userinfo.zip,
                        gender: userinfo.gender,
                        attachment: $scope.attachment,
                        imageCount: $scope.attachmentCount,
                    };

                    userproduct.updateProfile(parameters, function(result) {
                        console.log("updateProfile:", result);
                        if (result.status == true) {
                            $scope.successmsg = result.message;
                            $scope.showerrmsg = true;
                            var userSession = {
                                'login': true,
                                'facebookId': $rootScope.userSession.facebookId,
                                'userid': $rootScope.userSession.user_id,
                                'user_email': $rootScope.userSession.email_id,
                                'user_name': parameters.first_name + " " + parameters.last_name,
                                'avatar': $rootScope.userSession.avatar,

                            };
                            store.set('userSession', userSession);
                            $rootScope.userSession = store.get('userSession');
                            //$rootScope.$broadcast('userSession',userSession);
                            //$state.reload(); 
                            $timeout(function() {
                                $scope.showerrmsg = false;
                            }, 2000);
                            $state.go('myprofile');
                        }
                    });
                }
            };


            $scope.deleteProduct = function(product, index) {
                userproduct.deleteProduct(product.UProduct_id, function(result) {
                    if (result.status) {
                        console.log($scope.userProductList);
                        $scope.userProductList.splice(index, 1);
                        console.log($scope.userProductList);
                    }
                });
            };

            /**
             * @api {} /showModal showModal
             * @apiName showModal
             * @apiGroup Controller-Services
             * @apiVersion 1.0.0
             * @apiDescription  This function is to display service details in modal.
             */
            $scope.showModal = false;
            $scope.toggleModal = function(agent) {
                $scope.agent = agent; // Assign 'service' to a variable to display
                $scope.showModal = !$scope.showModal;
            };
            /**
             * @api {} /cancel cancel
             * @apiName cancel
             * @apiGroup Controller-Services
             * @apiVersion 1.0.0
             * @apiDescription  This function is to hide the modal.
             */
            $scope.cancel = function() {
                $scope.showModal = false;
            };

            $scope.updateprofileimage = function() {
                var img = new Image();
                var newfile = document.getElementById("file_browse1").files[0];
                var fileDisplayArea = document.getElementById('fileDisplayArea');
                var imageType = /image.*/;

                if (newfile.type.match(imageType)) {
                    var oFReader = new FileReader();
                    oFReader.onload = function(oFREvent) {

                        $scope.userinfo.avatar = oFReader.result;
                        $scope.$apply();
                        $scope.imageData = {
                            attachmentname: newfile.name,
                            attachment: oFReader.result
                        };
                        img.src = $scope.attachmentfile;

                        var imageinfo = {
                            "imagedata": $scope.imageData,
                            "user_id": $stateParams.uid
                        };


                        $http.post(baseUrl + 'updateprofileimage', imageinfo).success(function(res) {
                            $scope.getloginuserDetails();
                            $scope.imageData = {};
                        }).error(function() {
                            console.log("Please check your internet connection or data source..");
                        });
                    };
                    oFReader.readAsDataURL(newfile);
                } else {}

            };


            $scope.getloginuserDetails = function() {
                var user_id = $stateParams.uid;

                $http.get(baseUrl + 'getUserDetails/' + $stateParams.uid).success(function(res) {
                    console.log(res[0]);
                    var userSession = {
                        'login': true,
                        'facebookId': res[0].facebookId,
                        'userid': res[0].user_id,
                        'user_email': res[0].email_id,
                        'user_name': res[0].first_name + " " + res[0].last_name,
                        'avatar': res[0].avatar,
                        'first_name': res[0].first_name,
                        'last_name': res[0].last_name
                    };
                    store.set('userSession', userSession);
                    $rootScope.userSession = store.get('userSession');
                    $scope.userinfo.avatar = $rootScope.userSession.avatar;
                }).error(function() {
                    console.log("Please check your internet connection or data source..");
                });
            }


            // initialization function
            var init = function() {
                $scope.showProduct = true;
                $scope.showOrder = false;
                $scope.showPurchase = false;
                $scope.attachmentCount = {};
                $scope.attachment = {};
                $scope.parentCat = {};
                $scope.prodCat = {};
                $scope.CategoryList = {};
                $scope.CurrencyList = {};
                $scope.userProductList = {};
                $scope.userinfo = {};
                $scope.imgSrc = "";
                if (store.get('userSession')) {
                    $scope.userId = store.get('userSession').userid;
                    userproduct.getUserDetailsFromId($stateParams.uid, function(result) {
                        $scope.userinfo = result[0];
                        $scope.cancel();
                    });
                }

                if ($stateParams.supid > 0) {
                    userproduct.getProductBySuperCategory($stateParams.supid, function(response) {
                        $scope.productList = response;
                    });

                    userproduct.getCategoryfromSuperCategory($stateParams.supid, function(response) {
                        $scope.CategoryList = response.record;
                    });

                } else if ($stateParams.sid > 0 && $stateParams.catid > 0) {
                    userproduct.getProductByCategory($stateParams.catid, function(response) {
                        $scope.productList = response;
                        $scope.count = response.length;
                    });

                    userproduct.getCategoryfromSuperCategory($stateParams.sid, function(response) {
                        $scope.CategoryList = response.record;
                        console.log(response);
                    });

                } else {
                    //$scope.doGetProducts();
                    $scope.doGetProducts = function() {
                        $scope.showProduct = true;
                        $scope.showOrder = false;
                        $scope.showPurchase = false;
                        var parameters = {
                            UserId: $scope.userSession.userid
                        };
                        userproduct.getUserProducts(parameters, function(result) {
                            $scope.userProductList = result;
                            console.log(result);
                            if (result.length === 0) {
                                $scope.showMessage = "You have not added your product to sell. Click on sell product to add one.";
                            }
                        });
                    };
                }
                if ($stateParams.productid > 0) {
                    userproduct.getProductDetails($stateParams.productid, function(result) {
                        $scope.productDetails = result[0];
                        userproduct.getCategoryfromSuperCategory($scope.productDetails.maincatg_id, function(response) {
                            //$scope.productCategoryList = response;
                            //console.log(response);
                            var result = [];
                            var resultData = [];
                            //console.log(response);
                            for (var i in response.record)
                                resultData.push(response.record[i]);

                            $scope.prodCat = {
                                "type": "select",
                                "catg_name": $scope.productDetails.catg_name,
                                "catg_id": { "catg_id": $scope.productDetails.catg_id, "catg_name": $scope.productDetails.catg_name },
                                "values": resultData
                            };
                        });

                        userproduct.getParentCategoryList(function(response) {
                            var result = [];
                            var resultData = [];
                            //console.log(response);
                            for (var i in response)
                                resultData.push(response[i]);

                            //console.log(resultData);
                            $scope.parentCat = {
                                "type": "select",
                                "maincatg_name": $scope.productDetails.maincatg_name,
                                "maincatg_id": { "maincatg_id": $scope.productDetails.maincatg_id, "maincatg_name": $scope.productDetails.maincatg_name },
                                "values": resultData
                            };
                            console.log($scope.parentCat);
                        });

                        userproduct.getCurrency(function(response) {
                            //$scope.CurrencyList = response;
                            var result = [];
                            var resultData = [];
                            //console.log(response);
                            for (var i in response)
                                resultData.push(response[i]);
                            //console.log(resultData);
                            $scope.CurrencyList = {
                                "type": "select",
                                "CurrencyName": $scope.productDetails.CurrencyName,
                                "CurrencyCode": { "CurrencyCode": $scope.productDetails.CurrencyCode, "CurrencyName": $scope.productDetails.CurrencyName },
                                "values": resultData
                            };
                            console.log($scope.CurrencyList);
                        });

                    });
                    //$scope.editProduct($stateParams.productid);
                } else {
                    userproduct.getProductCategoryList(function(response) {
                        $scope.productCategoryList = response;
                        //$scope.count = response.length;
                        $scope.sortType = 'catg_id'; // set the default sort type
                    });

                    userproduct.getParentCategoryList(function(response) {
                        $scope.ParentCategoryList = response;
                    });

                    userproduct.getCurrency(function(response) {
                        $scope.CurrencyList = response;
                    });
                }

            };
            init();


        }
    ])
    .controller('addProductCntrl', [
        '$scope',
        '$stateParams',
        '$state',
        '$rootScope',
        '$timeout',
        'userproduct',
        'ordersFac',
        'Upload',
        function($scope, $stateParams, $state, $rootScope, $timeout, userproduct, ordersFac, Upload) {
            //  fn called whe the user adds new product to sell
            $scope.addProduct = function(product) {
                var parameters = {
                    Ad_Title: product.Ad_Title,
                    Description: product.Description,
                    maincatg_id: product.maincatg_id.maincatg_id,
                    Catg_id: product.Catg_id.catg_id,
                    Price: product.Price,
                    Shipping: product.Shipping,
                    attachment: $scope.attachment,
                    imageCount: $scope.attachmentCount,
                    IsSaveLater: 0,
                    images: $scope.file,
                    CreatedBy: $scope.userSession.userid,
                    Currency: product.CurrencyCode.CurrencyCode
                };

                userproduct.addProduct(parameters, function(result) {
                    if (result.status) {
                        document.getElementById("productform").reset();
                        $state.go('home');
                        if ($rootScope.previousState == 'dashboard') {
                            $state.go('dashboard');
                        }
                    }
                });
            };

            $scope.getCategoryOptions = function(maincatg_id, index) {
                userproduct.getCategoryfromSuperCategory(document.getElementById("maincatg_id").value, function(result) {
                    if (result.status) {
                        $scope.productCategoryList = result.record;
                    }
                });
            };



            var init = function() {
                userproduct.getParentCategoryList(function(response) {
                    $scope.ParentCategoryList = response;

                    userproduct.getProductCategoryList(function(response) {
                        $scope.productCategoryList = response;
                        //$scope.count = response.length;
                        $scope.sortType = 'catg_id'; // set the default sort type

                        userproduct.getCurrency(function(response) {
                            $scope.CurrencyList = response;
                        });
                    });
                });
            };
            init();
        }
    ])
    .controller('productDetailCntrl', [
        '$scope',
        '$stateParams',
        '$state',
        'userproduct',
        'ordersFac',
        'Upload',
        function($scope, $stateParams, $state, userproduct, ordersFac, Upload) {

            // do checkout
            $scope.doCheckout = function() {
                console.log("doCheckout");
                $state.go('checkout', { product: $scope.productDetails });
            };

            var init = function() {
                var productId = $stateParams.productid;
                console.log($stateParams.productid);
                userproduct.getProductDetails($stateParams.productid, function(response) {
                    $scope.productDetails = response[0];
                    var parameters = {
                        recid: $stateParams.productid,
                        imgfor: 'product',
                        pagelimit: 5,
                    };
                    userproduct.getProductImages($stateParams.productid, function(result) {
                        $scope.productDetails.images = result.record;
                        console.log(result.record);
                        $scope.ProductfirstImage = $scope.productDetails.images[0].ImageName;
                        console.log($scope.ProductfirstImage);
                        $scope.seenImg = $scope.productDetails.images[0].ImageName;
                        console.log($scope.productDetails);
                    });
                });
            };
            init();

            $scope.previewImg = function(data) {
                $scope.ProductfirstImage = data;
            }
        }
    ])
    .controller('myProductCntrl', [
        '$scope',
        '$http',
        '$stateParams',
        '$state',
        'userproduct',
        'ordersFac',
        'Upload',
        function($scope, $http, $stateParams, $state, userproduct, ordersFac, Upload,  angularGridInstance) {
            // to refresh the angular grid
        function refresh() {
            angularGridInstance.gallery.refresh();
        }

            $scope.getOrders = function() {
                /*$scope.showProduct = false;
                $scope.showOrder = true;
                $scope.showPurchase = false;*/
                console.log($scope.userSession.userid);
                ordersFac.getOrders($scope.userSession.userid, function(response) {
                    console.log(response);
                    $scope.orders = response;
                });
            };


            $scope.getPurchase = function() {
                /*$scope.showProduct = false;
                $scope.showOrder = false;
                $scope.showPurchase = true;*/
                ordersFac.getPurchases($scope.userSession.userid, function(response) {

                    $scope.purchases = response;
                });
            };
            $scope.doGetProducts = function() {
                // $scope.showProduct = true;
                // $scope.showOrder = false;
                // $scope.showPurchase = false;
                var parameters = {
                    UserId: $scope.userSession.userid
                };


                userproduct.getUserProducts(parameters, function(result) {
                    $scope.userProductList = result;
                    if (result.length === 0) {
                        $scope.showMessage = "You have not added your product to sell. Click on sell product to add one.";
                    }
                });
            };
            var init = function() {
                $scope.userId = $scope.userSession.userid;
                $scope.doGetProducts();
            };
            init();
        }
    ]);
