angular.module('starter.controllers', ['ngAutocomplete'])


.controller('AppCtrl', function($scope) {
  $scope.rideGoing = false;
})

.controller('NextRidesCtrl', function($scope, Rides) {
  Rides.all().then(function(d) {
    $scope.ridesData = d;
    console.log('Data in controller:');
    console.log($scope.ridesData);
  });
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
      $location.path('/app/next-rides');
    }
    $scope.goStyle = 'button-assertive';
    $scope.goLabel = 'Stop';
  }
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
    $location.path('/app/current-ride/0');
  }

  $scope.submit = function() {
    ride = {"EmployeeId" : 42, "TaxiId" : 43, "Destination" : "Offenburg", "Start" : "Lahr", "CountPassengers" : 2, "Status" : "HeadingToDestination"};
    Rides.add(ride).then(function(response) {
      console.log("new ride ctrl response:");
      console.log(response);
    });
  }
})

.controller('EmployeeCtrl', function($scope, $stateParams, $location, Employees) {
  Employees.all().then(function(response) {
    $scope.employees = JSON.parse(JSON.parse(response));
  });
  $scope.select = function(employeeID) {
    //console.log(employeeID);
    Employees.select(employeeID);
    $location.path('/app/next-rides');
  }
})

.controller('PauseCtrl', function($scope) {

});