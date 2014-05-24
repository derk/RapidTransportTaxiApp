angular.module('starter.controllers', ['ngAutocomplete'])


.controller('AppCtrl', function($scope) {
  $scope.rideGoing = false;
  //$scope.rideGoing = false;
})

.controller('NextRidesCtrl', function($scope, Rides) {
  $scope.rides = Rides.all();
  /*for (var i = 0; $scope.rides.length; i++) {
    var element = $scope.rides[i];
    addrArr = element.DestinationName.split(",");
    ($scope.rides[i])['tokens'] = addrArr;
  }*/
})

.controller('CurrentRideCtrl', function($scope, $stateParams, $location, Rides) {
  $scope.goStyle = 'button-positive';
  $scope.goLabel = 'Los';
	$scope.rideID = $stateParams.rideID;
	$scope.ride = Rides.get($stateParams.rideID);

  // For todays date;
  Date.prototype.today = function () { 
      return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
  }

  // For the time now
  Date.prototype.timeNow = function () {
       return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
  }

  if (!$scope.ride.TimeStart) {
    var now = new Date();
    $scope.ride.TimeStart = now.timeNow() + ' Uhr';
    $scope.ride.CostEstimated = '50€';
    $scope.ride.CostFinal = '49.99€';
  }
  $scope.go = function() {
    if ($scope.goLabel == 'Stop') {
      $location.path('/#/app/next-rides');
    }
    $scope.goStyle = 'button-assertive';
    $scope.goLabel = 'Stop';
  }
  //console.log($scope.ride);
})

.controller('NewRideCtrl', function($scope, $stateParams, $location, Rides) {
  $scope.resultEnd = '';
  $scope.optionsEnd = {
    country: 'de',
    types: 'geocode'
  };
  $scope.detailsEnd = '';
  // initialize empty json object for rides-new view
  $scope.ride = {};
  //$scope.createRide = Rides.add;
  $scope.passengers;
  $scope.submit = function(resultStart, detailsStart, resultEnd, detailsEnd, passengers) {
    var ride = [];
    // TODO: pass in all result parameters
    Rides.add({DestinationName: resultEnd, JobId: 0});
    console.log("Hey, clicked");
    console.log(resultStart);
    console.log(detailsStart);
    //console.log($scope.passengers);
    console.log('Passengers '+ passengers)
    //$location.path('/#/app/next-rides');
    $location.path('/#/app/current-ride/0');
  }
	//var rideID = $routeParams.rideID;
	//var currentRide = $scope.rides[rideID]
	
})

.controller('EmployeeCtrl', function($scope, $stateParams, $location, Employees) {
  $scope.employees = Employees.all();
  $scope.select = function(employeeID) {
    Employees.select(employeeID);
    $location.path('/#/app/next-rides');
  }
})

.controller('PauseCtrl', function($scope) {

})

//http://hsogprojekt.noip.me/Rapid/Services/RapidTransportService.svc/GetEmployees 