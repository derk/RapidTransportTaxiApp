// Ionic rapidTransport App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'rapidTransport' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'rapidTransport.controllers' is found in controllers.js
angular.module('rapidTransport', ['ionic', 'rapidTransport.controllers', 'rapidTransport.services', 'rapidTransport.constants'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.run(function(Pause) {
  //Pause.start();
})

// avoid caching templates/partials in the browser
.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
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

    .state('app.next-job', {
      url: "/next-jobs",
      views: {
        'menuContent' :{
          templateUrl: "templates/jobs-next.html",
          controller: 'NextJobsCtrl'
        }
      }
    })

    .state('app.current-job', {
      url: "/current-job/:jobId",
      views: {
        'menuContent' :{
          templateUrl: "templates/jobs-current.html",
          controller: 'CurrentJobCtrl'
        }
      }
    })

    .state('app.new-job', {
      url: "/new-job",
      views: {
        'menuContent' :{
          templateUrl: "templates/jobs-new.html",
          controller: 'NewJobCtrl'
        }
      }
    })

    .state('app.driver', {
      url: "/employees",
      views: {
        'menuContent' :{
          templateUrl: "templates/employees.html",
          controller: 'EmployeesCtrl'
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
    })

    .state('app.shift', {
      url: "/shift",
      views: {
        'menuContent' :{
          templateUrl: "templates/shift.html",
          controller: 'ShiftCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/employees');
});

