angular.module('rapidTransport.services', [])


/**
 * Factory for handling jobs (query, add, update)
 */
.factory('Jobs', function($http, Driver, JobStatus) {
  var jobs;
  var promise;

  var fixDates = function(job) {
    job.OrderDate = new Date(Date.parse(job.OrderDate));
    job.ArrivalEstimated = new Date(Date.parse(job.ArrivalEstimated));
    job.PreferredDeparture = new Date(Date.parse(job.PreferredDeparture));
    return job;
  };

  var init = function() {
    var url = 'http://hsogprojekt.noip.me/rapid/api/jobs/' + Driver.getEmployeeId();
    //var url ='json/jobs_41.json';
    console.log('Requesting jobs for Id: '+ Driver.getEmployeeId());
    console.log("Request url: " + url);
    promise = $http.get(url).then(function(response) {
      // The then function here is an opportunity to modify the response
      // The return value gets picked up by the then in the controller.
      jobs = response.data;
      // convert dates from strings to objects
      for (var i = 0; i < jobs.length; i++) {
        fixDates(jobs[i]);
      }
      if(jobs.length >= 1) {
        Driver.setTaxiId(jobs[0].TaxiId); // grab id from first job in jobs array
      }
      return jobs;
    });
  };

  var getIndexOf = function(jobId) {
    console.log("getIndexOf : " + jobId);
    for (var i = 0; i < jobs.length; i++)
    {
      if (jobs[i].JobId == jobId) {
        return i;
      }
    }
  };

  var remove = function(job) {
    var index = getIndexOf(job.JobId);
    var elemRemoved = jobs.splice(index, 1);
    console.log("Jobs: removed element");
    console.log(elemRemoved);
  };

  return {
    /*
     * Queries the webservice via the REST api for jobs
     */
    all: function() {
      if(!promise) {
        init();
      }
      // Return the promise to the controller
      return promise;
    },
    refresh: function() {
      init();
      return promise;
    },
    /*
     * Returns the job with the jobId passed in
     */
    get: function(jobId) {
      console.log("Get job with id: " + jobId);
      return jobs[getIndexOf(jobId)];
    },
    /*
     * Add spontaneous job
     * Does a POST http request
     */
    add: function(job) {
      //var url = "http://localhost:26968/api/jobs/";
      var url = "http://hsogprojekt.noip.me/rapid/api/jobs";
      console.log("Going to POST this new job:");
      console.log(job);
      //config = { method: "POST", url: "http://hsogprojekt.noip.me/rapid/api/jobs", data: job}
      var promise = $http.post(url, job);
      promise.then(function(response) {
        console.log("Add job response");
        console.log(response);
        if("Created" == response.statusText) {
          var job = fixDates(response.data);
          jobs.push(job);
        }
        return response;
      });
      return promise;
    },
    /*
     * update the current job
     * Does a PUT http request
     */
    update: function(job) {
      var jobUpdate = { Status : job.Status };
      // only the update setting Status = "Finished"  needs these
      if (job.CostsReal) jobUpdate.CostsReal = job.CostsReal;
      if (job.Arrival) jobUpdate.Arrival = job.Arrival.toISOString();
      if (job.Departure) jobUpdate.Departure = job.Departure.toISOString();
      console.log("Updating job status:");
      console.log(jobUpdate);
      // update on server
      // reflect changes in app
      url = 'http://hsogprojekt.noip.me/rapid/api/jobs/';
      return $http.put(url + job.JobId, jobUpdate)
      .success(function(data, status, headers, config) {
        if(JobStatus.Finished == jobUpdate.Status) {
          remove(job);
        }
      });
    }
  };
})

.factory('Employees', function($http) {
  var promise;

  var init = function() {
    promise = $http.get('http://hsogprojekt.noip.me/rapid/api/employees')
      .then(function(response) {
        return response.data;
      });
  }
  return {
    all: function() {
      if(!promise) {
        init();
      }
      return promise;
    },
    refresh: function() {
      init();
      return promise;
    }
  };
})

.factory('Driver', function(TaxiStatus) {
  // init
  this.employeeId = 0;
  this.taxiId = 0;
  this.taxiStatus = TaxiStatus.Waiting;
  this.waitingSince = new Date();
  return  {
    getEmployeeId: function() {
      return this.employeeId;
    },
    setEmployeeId: function(employeeId) {
      this.employeeId = employeeId;
      console.log("Selected employeeId = "+ employeeId)
    },
    getTaxiId: function() {
      return this.taxiId;
    },
    setTaxiId: function(taxiId) {
      this.taxiId = taxiId;
      console.log("Selected taxiId = "+ taxiId)
    },
    setTaxiStatus: function(status) {
      this.taxiStatus = status;
      console.log("taxiStatus = " + status);
    },
    getTaxiStatus: function() {
      return this.taxiStatus;
    },
    waitingSinceFifteenMinutes: function() {
      var before = moment(this.waitingSince);
      var now = moment();
      var res = moment.duration(now - before);
      return (res.asMinutes() >=15);
    }
  };
})

.factory('Pause', function($location, $timeout, TaxiStatus) {
  function Pause() {
  }
  Pause.prototype.lastPauseBegin = function(date) {
    this.lastPauseBegin = date;
  }
  Pause.prototype.lastPauseEnd = function(date) {
    this.lastPauseEnd = date;
  }
  var counter = 0;
  var running = false;
  var promise;
  var poller = function() {
    if(doPause()) {
      console.log("Pause check true")
      $location.path('/app/pause');
    } else {
      console.log("Pause check false")
      $location.path('/');
    }
    promise = $timeout(poller, 5000); // waittime in milliseconds before next execution
  }
  var doPause = function() {
    if (Driver.taxiStatus() == TaxiStatus.Waiting) {
      // how long is it waiting? ()
      // > 15 minutes -> set last pause
      // < 15 minutes -> check last pause end
        // more than 3 hours ago?
          // make a pause
    }
  }
  return {
    start: function() {
      running = true;
      poller();
    },
    stop: function() {
      if (running && promise) {
        running = false;
        $timeout.cancel(promise);
      }
    },
    isRunning: function() {
      return running;
    }
  };
})

// handles updating the current position of the taxi
.factory('Position', function($http, Driver) {
  // initialize to coordinates of
  // "Badstraße 2477652 Offenburg Deutschland"
  var lastKnownPosition = {
    "Latitude" : 48.4601021,
    "Longitude" : 7.942568199999982
  };
  var url = 'http://hsogprojekt.noip.me/rapid/api/positions/';
  return {
    update: function(latitude, longitude) {
      lastKnownPosition.Latitude = latitude;
      lastKnownPosition.Longitude = longitude;
      console.log("Updating position of taxi " + Driver.getTaxiId() +
        " to lat " + latitude +
        " and lng " + longitude);
      return $http.put(url + Driver.getTaxiId(), lastKnownPosition);
    },
    current: function() {
      return lastKnownPosition;
    }
  };
})

// queries the google maps api to get a route
// for a specified start and destination
.factory('GoogleMaps', function($q) {
  return {
    getRoute: function(startLocation, destinationLocation) {
      var q = $q.defer();
      var directionsService = new google.maps.DirectionsService();

      var request = {
        origin: new google.maps.LatLng(startLocation.Latitude, startLocation.Longitude),
        destination: new google.maps.LatLng(destinationLocation.Latitude, destinationLocation.Longitude),
        waypoints: [],
        provideRouteAlternatives: false,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
      };

      console.log("New route was requested!");
      console.log("Request:");
      console.log(request);

      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          var route = response.routes[0];
          
          console.log("GooleMaps service new route received:");
          console.log(route);
          q.resolve(route);
        } else {
          var msg = "Something went wrong, could not get a route!";
          q.resolve(msg);
        }
      });
      return q.promise;
    }
  };
})

.factory('ShiftManager', function() {
  function Pause() {
    this.start = null;
    this.end = null;
  }
  Pause.prototype.setStart = function(startDate) {
    this.start = startDate;
  }
  Pause.prototype.setEnd= function(endDate) {
    this.end = endDate;
  }
  Pause.prototype.pauseMoreThanThreeHoursAgo = function() {
    var pauseEnd = moment(this.end);
    var now = moment();
    var res = moment.duration(now - pauseEnd);
    console.log("result");
    console.log(res.asHours());
    if(res.asHours() >= 3) {
      return true;
    } else {
      return false;
    }
  }

  function Shift(dayName) {
    this.dayName  = dayName;
    this.started = false;
    this.startDate = null;
    this.endDate = null;
    this.pauseCount = 0;
    this.lastPause = null;
  }
  Shift.prototype.addPause = function(pause) {
    this.lastPause = pause;
    this.pauseCount++;
  };
  Shift.prototype.begin = function() {
    this.startDate = new Date();
    this.started = true;
    var dummyPause = new Pause();
    var now = new Date();
    dummyPause.setStart(now);
    dummyPause.setStart(now);
    this.lastPause = dummyPause;
  }
  Shift.prototype.end = function() {
      this.endDate = new Date();
  }
  Shift.prototype.lengthLimitReached = function() {
    var shiftBegin = moment(this.startDate);
    var now = moment();
    var res = moment.duration(now - shiftBegin);
    if (res.asHours() >= 8) {
      return true;
    } else {
      return false;
    }
  }

  var currentShift = null;

  var weekShifts = []; // arr of type Shift
  return {
    beginNewWeek: function() {
      var days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
      for (var i = 0; i < days.length; i++) {
        weekShifts[i] = new Shift(days[i]);
      }
      return weekShifts;
    },
    newPause: function() {
      return new Pause();
    },
    setCurrentShift: function(shift) {
      currentShift = shift;
    },
    getCurrentShift: function() {
      return currentShift;
    }
  };
});