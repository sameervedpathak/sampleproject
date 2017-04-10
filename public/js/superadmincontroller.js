SampleApplicationModule
.controller('userController', function( $scope, userFactory ) {

  // initialization function
  var init = function() {
    // to get the company list for home page
    companyFactory.getCompany( function(response) {
      $scope.companies = response;
      console.log("response 9:",response);
    });
  };
  init();

})
.controller('userCompanyController', function( $scope, companyFactory,$http,$timeout ,$state,$stateParams) {


  // initialization function
  var init = function() {
    // to get the company list for home page
    companyFactory.getUserCompany( function(response) {
      $scope.companies = response;
      console.log(response);
    });
  };
  init();

  //function for add company Employees
  $scope.addCompanyEmployee = function(valid){
    $scope.empinfo.company_id = $stateParams.company_id;
    if(valid){
      $http.post(baseUrl + 'user/addcompanyemployee' , $scope.empinfo).success(function(res,req){
      console.log(res);
      if(res.status == 200){
            $scope.empmsg = res.message;
            $scope.showempmsg = true;
              $timeout(function() {
                $scope.showempmsg = false;
                document.getElementById("addcompemp").reset();
                $state.go('mainview.startups');
              }, 3000);
      }

    }).error(function() {
        console.log("Connection Problem.");
    });
    }

  };

  //function for load company id by selection of company name
  $scope.getcurrentcomp_id = function(company){
    console.log(company);
    $scope.empinfo.company_id = company.company_id;
  };

})
.controller('addCompanyController', function( $scope, companyFactory, $stateParams , $state) {

  $scope.doAddCompany = function(valid) {
    //console.log($scope.company);
    if(valid){
          $scope.company.logo_name = $scope.attachname1;
          $scope.company.attachmentfile1 = $scope.attachmentfile1;
        companyFactory.addCompany( $scope.company, function( response ) {
        if(response){
          alert("Your company has been added successfully");
          $state.go('mainview.startups');
        }else {
          alert("We faced some issue, while adding you company. Please try agein later.")
        }
      });
    }
    
  };

  // initialization function
  var init = function() {
    console.log("addController");
    $scope.company = {};

  };
  init();


  //function for image uploading
  $scope.updateattachment = function(file_browse){
        var fileDisplayArea = document.getElementById('fileDisplayArea');
        console.log(fileDisplayArea)
        if(file_browse == 'file_browse1'){
              var newfile = document.getElementById("file_browse1").files[0];
        }  
        console.log(newfile); 
        var imageType = /image.*/;
        console.log(newfile.name);
          if (newfile.type.match(imageType)) {
              var oFReader = new FileReader();
              oFReader.onload = function (oFREvent) {
              //document.getElementById("file_browse").src = oFREvent.target.result;
              //$scope.profile.logo = oFREvent.target.result;
              //document.getElementById("associationlogoinput").value = oFREvent.target.result;
                if(file_browse == 'file_browse1'){
                        $scope.attachname1 = newfile.name  ;
                        $scope.attachmentfile1 = oFReader.result;
                        $scope.attach = false;
                        console.log($scope.attach);
                        console.log(newfile.length);
                }
              };
              oFReader.readAsDataURL( newfile );
          } else {
              fileDisplayArea.innerHTML = "File not supported!"
          } 
  };

})
.controller('companyDetailController', function( $scope, $stateParams, companyFactory, oppurtunityFactory ) {
 
  $scope.mediaURL = mediaURL;
  console.log(mediaURL);
  // initialization function
  var init = function() {
    $scope.company = {};
    

    // get the company id through stateParams
    console.log($stateParams.companyId);
    // to get the company details
    companyFactory.getCompanyProfile( $stateParams.companyId, function(response) {
      $scope.company = response[0];
      // console.log(response);
      // to get opportunity details
      oppurtunityFactory.getOpportunity(  $stateParams.companyId, function(response) {
        // console.log(response);
        $scope.company.opportunity = response;
        console.log($scope.company);
      });
    });
  };
  init();

  
})
.controller('addOpportunityController', function( $scope, $stateParams, companyFactory, oppurtunityFactory,$state,$timeout) {

  // initialization function
  var init = function() {
    $scope.oppurtunity = {};

    // to get the company details
    companyFactory.getCompanyProfile( $stateParams.companyId, function(response) {
      $scope.opportunity = {
        company_id: $stateParams.companyId,
        brandName : response[0].brandName,
      };



    });
  };
  init();

  // do add opportunity
  $scope.doAddOpportunity = function() {
    console.log($scope.opportunity);
    oppurtunityFactory.addOpportunity( $scope.opportunity, function functionName( response ) {
      if(response){
          $scope.addopportunitymsg = 'Opportunity  has been added successfully';
          $scope.showopportunitymsg = true;
          // Loadind done here - Show message for 3 more seconds.
          $timeout(function() {
            $scope.showopportunitymsg = false;
             document.getElementById("addopportunities").reset();
             $state.go('mainview.startups');
          }, 3000);

      }else {
        alert("We faced some issue, while adding you opportunity. Please try again later.");
      }
    });
  };

})
.controller('addRevenueController', function( $scope, companyFactory, $stateParams , $state) {

  $scope.doAddCompany = function() {
    // console.log("addCompany");
    console.log($scope.company);
    companyFactory.addCompany( $scope.company, function( response ) {
      if(response){
        alert("Your company has been added successfully");
        $state.go('mainview.startups');
      }else {
        alert("We faced some issue, while adding you company. Please try again later.");
      }
    });
  };

  // initialization function
  var init = function() {
    console.log("addController");
    $scope.company = {};

  };
  init();

});
