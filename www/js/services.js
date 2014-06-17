angular.module('starter.services', ['ngResource'])

/**
 * Factory for handling rides (query, add, update)
 */
.factory('Rides', function($http, $resource, Employees) {
  var rides;

  return {
    /*
     * Queries the webservice via the REST api for rides
     */
    all: function() {
      var urlBase = 'http://hsogprojekt.noip.me/Rapid/Services/RapidTransportService.svc/GetJobs/';
      console.log('Requesting jobs for Id: '+ Employees.currentId());
      console.log("Request url: " + urlBase + Employees.currentId());
      var promise = $http.get(urlBase + Employees.currentId()).then(function(response) {
        // The then function here is an opportunity to modify the response
        //console.log(response);
        // The return value gets picked up by the then in the controller.
        // parse twice, because of weird REST api returning a string instead of an array/json object
        rides = JSON.parse(JSON.parse(response.data));
        return rides;
      });
      // Return the promise to the controller
      return promise;
    },
    /*
     * Returns the ride with the jobID passed in
     */
    get: function(jobID) {
      // Simple index lookup
      // TODO: change lookup method later
      for (var i = 0; i < rides.length; i++)
      {
        if (rides[i].JobId == jobID) {
          return rides[i];
        }
      }
    },
    /*
     * Add spontaneous ride
     */
    add: function(ride) {
      //var promise = $http.post('http://hsogprojekt.noip.me/Rapid/Services/RapidTransportService.svc/AddJob', ride).then(function(response) {
      var promise = $http.post('http://localhost:26968/Services/RapidTransportService.svc/AddJob', ride).then(function(response) {
        console.log("Ride service add:")
        console.log(response);
      });
      return promise;
    },
    selectRide: function(JobId) {

    }
  }
})

.factory('Employees', function($http) {
  var employeeId = -1;
  return {
    all: function() {
      var promise = $http.get('http://hsogprojekt.noip.me/Rapid/Services/RapidTransportService.svc/GetEmployees')
        .then(function(response) {
          return response.data;
      });
      return promise;
    },
    currentId: function() {
      return employeeId;
    },
    select: function(id) {
      employeeId = Number(id);
      console.log('Employees Service: selected employee with id: '+ employeeId);
    }
  }
});