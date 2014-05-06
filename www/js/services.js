angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Rides', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var rides = [
    { start: 'Alexanderplatz, Berlin', end: 'Hauptbahnhof, Berlin', id: 0},
    { start: 'Messe, Frankfurt', end: 'Hauptbahnhof, Frankfurt', id: 1},
    { start: 'Hochschule, Offenburg', end: 'Philips, Böblingen', id: 2},
    { start: 'Flughafen, Berlin', end: 'Brandenburger Tor, Berlin', id: 3}
  ];

  return {
    all: function() {
      return rides;
    },
    get: function(rideId) {
      // Simple index lookup
      // TODO: change lookup method later
      return rides[rideId];
    }
    //add: function(ride) {
      // send data to server
      // get id in return
      // then push the ride with the valid id
      //ride.id = "-1"
      //rides.push(ride);
    //}
  }
});
