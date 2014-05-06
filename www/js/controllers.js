angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope) {
})

.controller('NextRidesCtrl', function($scope, Rides) {
	/*
  $scope.rides = [
    { start: 'Alexanderplatz, Berlin', end: 'Hauptbahnhof, Berlin', id: 1},
    { start: 'Messe, Frankfurt', end: 'Hauptbahnhof, Frankfurt', id: 2},
    { start: 'Hochschule, Offenburg', end: 'Philips, Böblingen', id: 3},
    { start: 'Flughafen, Berlin', end: 'Brandenburger Tor, Berlin', id: 4}
  ];
  */
  $scope.rides = Rides.all();
})

.controller('CurrentRideCtrl', function($scope, $stateParams, Rides) {
	$scope.rideID = $stateParams.rideID;
	//var currentRide = $scope.rides[rideID]
	$scope.ride = Rides.get($stateParams.rideID);
})

.controller('NewRideCtrl', function($scope, $stateParams, Rides) {
  // initialize empty json object for rides-new view
  $scope.ride = {};
  //$scope.createRide = Rides.add;
	//var rideID = $routeParams.rideID;
	//var currentRide = $scope.rides[rideID]
	
})