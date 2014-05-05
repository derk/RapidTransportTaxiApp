angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('NextRidesCtrl', function($scope) {
  $scope.rides = [
    { start: 'Alexanderplatz, Berlin', end: 'Hauptbahnhof, Berlin', id: 1},
    { start: 'Messe, Frankfurt', end: 'Hauptbahnhof, Frankfurt', id: 2},
    { start: 'Hochschule, Offenburg', end: 'Philips, Böblingen', id: 3},
    { start: 'Flughafen, Berlin', end: 'Brandenburger Tor, Berlin', id: 4}
  ];
})

.controller('CurrentRideCtrl', function($scope, $stateParams) {
	//var rideID = $routeParams.rideID;
	//var currentRide = $scope.rides[rideID]
	$scope.rideID = $stateParams.rideID
	ride = 
		{ start: 'Flughafen, Berlin', end: 'Brandenburger Tor, Berlin', id: 4 };

})

.controller('NewRideCtrl', function($scope, $stateParams) {
	//var rideID = $routeParams.rideID;
	//var currentRide = $scope.rides[rideID]
	
})