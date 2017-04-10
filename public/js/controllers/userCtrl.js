SampleApplicationModule.controller('usercontroller', [
  '$scope',
  '$http',
  '$stateParams',
  '$location',
  '$state',
  '$timeout',
  'store',
  '$rootScope',
  function($scope, $http, $stateParams, $location,$state, $timeout,store ,$rootScope) {

    $rootScope.userSession = store.get('userSession');
    $scope.userinfo = {
        "user_fname" :'',
        "user_lname":'',
        "user_email":'',
        "gender":''
    };

    $scope.clearsignup = function() {
        $scope.userinfo = {
            "user_fname" :'',
            "user_lname":'',
            "user_email":'',
            "gender":''
        };        
    };


    $scope.signup = function() {
        
            $http.post(baseUrl + 'signup', $scope.userinfo).success(function(res) {
                console.log("res:",res);
                if (res.status == true) {
                    $scope.signupmsg = res.message;
                    $scope.showsuccess = true;
                    $timeout(function() {
                        $scope.showsuccess = false;
                        $state.go('signin')
                    }, 2000);
                    //document.getElementById("signupfrmid").reset();
                    //$scope.signupfrm.$setPristine();
                } else {
                    $scope.alradyregistermsg = res.message;
                    $scope.showalreadyregimsg = true;
                    $timeout(function() {
                        $scope.showalreadyregimsg = false;
                    }, 2000);
                }
            }).error(function(error) {
                console.log("error creating account", error);
            });

    };
    // $scope.init = function() {
    //   $rootScope.userSession = store.get('userSession');
    //   $scope.getMainCategory();
    //  if($stateParams.todo_id)
    //   {
    //     $scope.gettododetails($stateParams.todo_id);
    //   }

    // }
    //   $scope.stateParams = $stateParams.todo_id;
    //   $scope.IsVisible = false;
    //   $scope.IsCalVisible = false;

    // $scope.ShowHide = function () {
    //   //If form is visible it will be hidden and vice versa.
    //   $scope.IsVisible = $scope.IsVisible ? false : true;
    // }

    // $scope.ShowHidecal = function () {
    //   $scope.IsCalVisible = $scope.IsCalVisible ? false : true;
    // }
    // /**
    //   @function for addUpdateTodos
    //   @param {int} first - todo_id
    //   @author sameer vedpathak
    //   @initialDate
    //   @lastDate
    // */

    // $scope.addUpdateTodos = function(data,valid) {
    //   if(valid){
    //     if ($stateParams.todo_id)
    //       $scope.updatetodos(data);
    //     if ($stateParams.todo_id == '')
    //       $scope.addtodos(data);
    //   }
    // };

    // /**
    //  @function addtodos
    //  @type post
    //  @author sameer Vedpathak
    //  @initialDate
    //  @lastDate
    //  */
    // $scope.addtodos = function(data) {

    //     var selecteddate = data.reminderdate;
    //     var utcdate = moment(selecteddate).utc(Date).format("YYYY-MM-DD");
    //     var selectedtimee = data.remindertime;
    //     var utctime = moment(selectedtimee).utc().format("h:mm") ;
    //     var utcdatetime = utcdate +" "+ utctime;

    //     var tododata = {
    //         todo_data : data.todo_data,
    //         user_id: $rootScope.userSession.userid,
    //         reminder_date:utcdate,
    //         reminder_time:utcdatetime
    //     }


    //   $http.post(baseUrl + 'addtodos',tododata).success(function(res, req) {

    //     if(res.status == true){
    //       $scope.gettodos();
    //       $scope.IsVisible = false;
    //       $scope.Remindersuccessmsg = 'Reminder Added Successfully';
    //       $scope.showRemindersuccessmsg = true;
    //       // Simulate 2 seconds loading delay
    //       $timeout(function() {
    //           // Loadind done here - Show message for 3 more seconds.
    //           $timeout(function() {
    //             $scope.showRemindersuccessmsg = false;
    //           }, 3000);
    //         document.getElementById("addreminderForm").reset();
    //         $state.go('welcomepage');
    //       }, 2000);
    //     }
    //   }).error(function() {
    //     console.log("Connection Problem.");
    //   });
    // }


    //  /**
    //  @function updatetodos
    //  @type post
    //  @author sameer Vedpathak
    //  @initialDate
    //  @lastDate
    //  */
    // $scope.updatetodos = function(data) {

    //     var selecteddate = data.reminderdate;
    //     var utcdate = moment(selecteddate).utc(Date).format("YYYY-MM-DD");
    //     var selectedtimee = data.remindertime;
    //     var utctime = moment(selectedtimee).utc().format("h:mm") ;
    //     var utcdatetime = utcdate +" "+ utctime;

    //     var tododata = {
    //       todo_data : data.todo_data,
    //       todo_id: $stateParams.todo_id,
    //       reminder_date:utcdate,
    //       reminder_time:utcdatetime
    //     }

    //   $http.post(baseUrl + 'updatetodos',tododata).success(function(res, req) {
    //    if(res.status == true){
    //       $scope.updateRemindermsg = 'Reminder Updated Successfully';
    //       $scope.showupdateRemindermsg = true;
    //         // Simulate 2 seconds loading delay
    //         $timeout(function() {
    //             // Loadind done here - Show message for 3 more seconds.
    //             $timeout(function() {
    //               $scope.showupdateRemindermsg = false;
    //             }, 3000);
    //               $scope.gettodos($stateParams.todo_id);
    //               document.getElementById("addreminderForm").reset();
    //               $location.path('/welcomepage/');
    //           }, 2000);
    //     }
    //       $scope.IsVisible = false;
    //   }).error(function() {
    //     console.log("Connection Problem.");
    //   });
    // }


    // /**
    //  @function gettododetails
    //  @type post
    //  @author sameer Vedpathak
    //  @initialDate
    //  @lastDate
    //  */
    // $scope.gettododetails = function(data) {
    //   var tododata = {
    //     todo_id: $stateParams.todo_id
    //   }
    //   $http.post(baseUrl + 'gettododetails',tododata).success(function(res, req) {
    //     $scope.data = res.record[0];

    //   }).error(function() {
    //     console.log("Connection Problem.");
    //   });
    // }

    // /**
    //  @function gettodos
    //  @type post
    //  @author sameer Vedpathak
    //  @initialDate
    //  @lastDate
    //  */
    // $scope.getMainCategory = function() {

    //   $http.get(baseUrl + 'admin/maincategory').success(function(res, req) {
    //     $scope.MainCategoryList = res;

    //   }).error(function() {
    //     console.log("Connection Problem.");
    //   });

    //   $http.get(baseUrl + 'admin/allcategory').success(function(res, req) {
    //     $scope.CategoryMenuList = res;

    //   }).error(function() {
    //     console.log("Connection Problem.");
    //   });
    // }

    // /**
    // @function deletetodo
    // @type post
    // @author
    // @initialDate
    // @lastDate
    // */
    // $scope.deletetodo = function(data) {
    //   var data = {
    //     todo_id:data.todo_id
    //   }
    //   $http.post(baseUrl + 'deletetodo', data).success(function(res, req) {
    //      if( res.status == true ){
    //         // Remove the todo from the todos list
    //         for (var i in $scope.todolist) {
    //             if ($scope.todolist[i] == data) {
    //                 $scope.todolist.splice(i, 1);
    //             }
    //         }
    //         $scope.Reminderdelmsg = 'Reminder Deleted Successfully';
    //         $scope.showReminderdelmsg = true;
    //         // Simulate 2 seconds loading delay
    //           $timeout(function() {
    //               // Loadind done here - Show message for 3 more seconds.
    //               $timeout(function() {
    //                 $scope.showReminderdelmsg = false;
    //               }, 3000);
    //                //document.getElementById("loginform").reset();
    //           }, 2000);

    //         $scope.gettodos();
    //         $scope.IsVisible = false;
    //         $state.go('welcomepage');
    //       } else if(res.status === false){
    //         $scope.message = "failed to delete todo ";
    //       }
    //   }).error(function() {
    //     console.log("Connection Problem.");
    //   });
    // };


    }
]);
