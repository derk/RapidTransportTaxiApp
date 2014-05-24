angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Rides', function() {
  var currentRide;
  var rideGoing = false;
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  /*var rides = [
    { startName: 'Alexanderplatz, Berlin', DestinationName: 'Hauptbahnhof, Berlin', JobId: 0},
    { startName: 'Messe, Frankfurt', DestinationName: 'Hauptbahnhof, Frankfurt', JobId: 1},
    { startName: 'Hochschule, Offenburg', DestinationName: 'Philips, Böblingen', JobId: 2},
    { startName: 'Flughafen, Berlin', DestinationName: 'Brandenburger Tor, Berlin', JobId: 3}
  ];*/
  var rides = [
    {"Status":"Finished","EmployeeId":30,"StartLocationLatitude":48.4575030028,"StartLocationLongitude":7.9308330920,"DestinationLocationLatitude":48.7916284706,"DestinationLocationLongitude":7.9945915375,"DestinationName":"2 Rue Jean Frédéric Oberlin, 67770 Sessenheim, France","JourneyLength":34,"OrderDate":"Date(1395183600000)","ArrivalEstimated":"Date(1395218814000)","PreferredDeparture":"Date(1395216343807)","CostsEstimated":118.80,"Telephone":"06344\/24690121","JobId":13560},
    {"Status":"Finished","EmployeeId":30,"StartLocationLatitude":48.5249721827,"StartLocationLongitude":7.9477011297,"DestinationLocationLatitude":48.5052669994,"DestinationLocationLongitude":8.3489251402,"DestinationName":"Bergerweg 84, 72270 Baiersbronn, Germany","JourneyLength":45,"OrderDate":"Date(1395183600000)","ArrivalEstimated":"Date(1395233362000)","PreferredDeparture":"Date(1395230544147)","CostsEstimated":123.20,"Telephone":"0176\/85903705","JobId":13596},
    {"Status":"Finished","EmployeeId":30,"StartLocationLatitude":48.6310208708,"StartLocationLongitude":8.3575376845,"DestinationLocationLatitude":48.5704803544,"DestinationLocationLongitude":7.9916796587,"DestinationName":"Landstraße, 77767 Appenweier, Germany","JourneyLength":41,"OrderDate":"Date(1395183600000)","ArrivalEstimated":"Date(1395234988000)","PreferredDeparture":"Date(1395233752917)","CostsEstimated":101.20,"Telephone":"07715\/32096961","JobId":13602},
    {"Status":"Finished","EmployeeId":30,"StartLocationLatitude":48.5002537300,"StartLocationLongitude":8.0124947255,"DestinationLocationLatitude":48.5731321050,"DestinationLocationLongitude":8.2421313864,"DestinationName":"Alte Seekopfhütte 1, 77889 Seebach, Germany","JourneyLength":38,"OrderDate":"Date(1395183600000)","ArrivalEstimated":"Date(1395239494000)","PreferredDeparture":"Date(1395238295507)","CostsEstimated":105.60,"Telephone":"0152\/70567119","JobId":13611},
    {"Status":"Finished","EmployeeId":30,"StartLocationLatitude":48.5349394533,"StartLocationLongitude":8.0720618657,"DestinationLocationLatitude":48.8597935249,"DestinationLocationLongitude":8.2378863182,"DestinationName":"Untere Wiesen 8, 76437 Rastatt, Germany","JourneyLength":29,"OrderDate":"Date(1395183600000)","ArrivalEstimated":"Date(1395259160000)","PreferredDeparture":"Date(1395259477567)","CostsEstimated":121.00,"Telephone":"07394\/52492834","JobId":13650}
  ];

  /*

   */

  return {
    /*
     * Queries the webservice via the REST api for rides
     */
    all: function() {
      return rides;
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
      // send data to server
      // get id in return
      // then push the ride with the valid id
      //ride.id = "-1"
      rides.push(ride);
    },
    selectRide: function(JobId) {

    }
  }
})

.factory('Employees', function($http) {
  var employeeID;
  //var employees = [];
  var employees = JSON.parse("[{\"Id\":30,\"FirstName\":\"Long!\",\"LastName\":\"Don\"},{\"Id\":31,\"FirstName\":\"Big\",\"LastName\":\"Jim\"},{\"Id\":32,\"FirstName\":\"Donovan\",\"LastName\":\"Day\"},{\"Id\":33,\"FirstName\":\"Hiram.\",\"LastName\":\"Brooks\"},{\"Id\":34,\"FirstName\":\"Hasad\",\"LastName\":\"Reynolds\"},{\"Id\":35,\"FirstName\":\"Tyrone\",\"LastName\":\"Anthony\"},{\"Id\":36,\"FirstName\":\"Xavier\",\"LastName\":\"Jacobson\"},{\"Id\":38,\"FirstName\":\"Nissim\",\"LastName\":\"Pearson\"},{\"Id\":39,\"FirstName\":\"Berk\",\"LastName\":\"Savage\"},{\"Id\":40,\"FirstName\":\"Theodore\",\"LastName\":\"Luna\"},{\"Id\":41,\"FirstName\":\"Tanek\",\"LastName\":\"Forbes\"},{\"Id\":42,\"FirstName\":\"Samson\",\"LastName\":\"Burgess\"},{\"Id\":43,\"FirstName\":\"Jerome\",\"LastName\":\"Kerr\"},{\"Id\":44,\"FirstName\":\"Keaton\",\"LastName\":\"Haynes\"},{\"Id\":45,\"FirstName\":\"Peter\",\"LastName\":\"Beasley\"},{\"Id\":46,\"FirstName\":\"Jerry\",\"LastName\":\"Cooper\"},{\"Id\":47,\"FirstName\":\"Lance\",\"LastName\":\"James\"},{\"Id\":48,\"FirstName\":\"Richard\",\"LastName\":\"Brown\"},{\"Id\":49,\"FirstName\":\"Rafael\",\"LastName\":\"Thompson\"},{\"Id\":50,\"FirstName\":\"Basil\",\"LastName\":\"Calderon\"},{\"Id\":11587,\"FirstName\":\"Rogan\",\"LastName\":\"Whitney\"},{\"Id\":11590,\"FirstName\":\"Noah\",\"LastName\":\"Holmes\"},{\"Id\":11591,\"FirstName\":\"Hamish\",\"LastName\":\"Mullen\"},{\"Id\":11592,\"FirstName\":\"Caesar\",\"LastName\":\"Adkins\"},{\"Id\":11593,\"FirstName\":\"Levi\",\"LastName\":\"Smith\"},{\"Id\":11679,\"FirstName\":\"Max\",\"LastName\":\"Mustermann\"},{\"Id\":11680,\"FirstName\":\"Maxii\",\"LastName\":\"Master\"},{\"Id\":11681,\"FirstName\":\"Simon\",\"LastName\":\"Danner\"},{\"Id\":11682,\"FirstName\":\"Simon\",\"LastName\":\"Danner\"}]")
  return {
    /*all: function() {
      //http://hsogprojekt.noip.me/Rapid/Services/RapidTransportService.svc/GetEmployees
      //http://localhost:26967/Services/RapidTransportService.svc/GetEmployees
      $http.get('http://hsogprojekt.noip.me/Rapid/Services/RapidTransportService.svc/GetEmployees')
        .then(function(result) {
          employees = JSON.parse(result.data);
      });
    }*/
    all: function() {
      console.log(employees);
      return employees;
    },
    select: function(eID) {
      employeeId = eID;
      console.log('Selected Employee with ID: '+ employeeID);
    }
  }
});