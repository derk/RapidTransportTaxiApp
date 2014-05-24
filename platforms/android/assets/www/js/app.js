// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.next-rides', {
      url: "/next-rides",
      views: {
        'menuContent' :{
          templateUrl: "templates/rides-next.html",
          controller: 'NextRidesCtrl'
        }
      }
    })

    .state('app.current-ride', {
      url: "/current-ride/:rideID",
      views: {
        'menuContent' :{
          templateUrl: "templates/rides-current.html",
          controller: 'CurrentRideCtrl'
        }
      }
    })

    .state('app.new-ride', {
      url: "/new-ride",
      views: {
        'menuContent' :{
          templateUrl: "templates/rides-new.html",
          controller: 'NewRideCtrl'
        }
      }
    })

    .state('app.driver', {
      url: "/employee",
      views: {
        'menuContent' :{
          templateUrl: "templates/employee.html",
          controller: 'EmployeeCtrl'
        }
      }
    })

    .state('app.pause', {
      url: "/pause",
      views: {
        'menuContent' :{
          templateUrl: "templates/pause.html",
          controller: 'PauseCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/next-rides');
});

