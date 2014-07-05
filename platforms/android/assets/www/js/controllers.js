angular.module('rapidTransport.controllers', ['ngAutocomplete'])


.controller('AppCtrl', function($scope) {
  $scope.jobGoing = false;
})

.controller('NextJobsCtrl', function($scope, $location, $ionicPopup, ShiftManager, Driver, Jobs) {
  Jobs.all().then(function(d) {
    $scope.jobsData = d;
    console.log('Data in controller:');
    //console.log('typeof ' + typeof(d));
    console.log($scope.jobsData);
  });
  $scope.doRefresh = function() {
    Jobs.refresh()
     .then(function(response) {
      console.log("resfreshed");
      console.log(response);
      $scope.jobsData = response;
      $scope.$broadcast('scroll.refreshComplete');
     });
  };
  $scope.acceptNextJob = function() {
    // if(Driver.waitingSinceFifteenMinutes()) {
    //   var pause = ShiftManager.newPause();
    //   var now = new Date();
    //   pause.setStart(now);
    //   pause.setEnd(now);
    //   ShiftManager.addPause(pause);
    // }
    // var currentShift = ShiftManager.getCurrentShift();
    // if(currentShift.lastPause.pauseMoreThanThreeHoursAgo()) {
    //   $ionicPopup.alert({
    //     title: "Fehler",
    //     template: "Sie müssen eine Pause machen!"
    //   });
    //   $state.go("app.pause");
    // } else if(currentShift.lengthLimitReached()) {
    //   $ionicPopup.alert({
    //     title: "Fehler",
    //     template: "Ihre Schicht dauert schon länger als 8 Stunden!"
    //   });
    //   currentShift.end();
    //   $state.go("app.shift");
    // } else 
    if($scope.jobsData.length >= 1) {
      $location.path("/app/current-job/" + $scope.jobsData[0].JobId);
    } else {
      alertNoJobsAvail();
    }
  }
  var alertNoJobsAvail = function() {
    var alertPopup = $ionicPopup.alert({
     title: 'Fehler',
     template: 'Keine Aufträge vorhanden!<br>Sie können die Liste der Auftrage durch Ziehen nach unten aktualisieren.'
   });
  }
})

.controller('CurrentJobCtrl', function($scope, $state, $q, $stateParams, $timeout, $location, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, Driver, GoogleMaps, Jobs, JobStatus, Position, TaxiStatus) {
  $scope.goStyle = 'button-positive';
  $scope.goLabel = 'Auftrag beginnen';
	$scope.job = Jobs.get($stateParams.jobId);
  console.log("Current job:");
  console.log($scope.job);

  $scope.jobDone = false;

  // $scope.goStyle = 'button-balanced';

  var initRoutes = function() {
    var counter = 0;
    var deferred = $q.defer();
    routes = [];
    var start = {
      Latitude: $scope.job.StartLatitude,
      Longitude: $scope.job.StartLongitude
    };
    var destination = {
      Latitude: $scope.job.DestinationLatitude,
      Longitude: $scope.job.DestinationLongitude
    };
    var done = function () {
      counter++;
      if(counter == 2)
        // resolve deferred, when all routes were aquired
        deferred.resolve('RoutesInitialized');
    };
    // route to customer
    GoogleMaps.getRoute(Position.current(), start)
    .then(function(route) {
      // concat because we want the warnings for both routes in one array
      $scope.warnings = $scope.warnings.concat(route.warnings);
      routes[0] = route;
      done();
    });
    // route to customers destination
    GoogleMaps.getRoute(start, destination)
    .then(function(route) {
      // concat because we want the warnings for both routes in one array
      $scope.warnings = $scope.warnings.concat(route.warnings);
      routes[1] = route;
      done();
    });
    return deferred.promise;
  }

  var routesInitPromise = initRoutes();

  $scope.warnings = []; // to display warnings for the route from google
  
  var routes; // contains routes to customer and to destination
  var currentRoute; // reference to one of the routes
  var routeFinishState;

  var stepCounter = 0; // index of step of a route currently processed

  $scope.startJob = function() {
    //$scope.job.TimeStart = new Date();
    routesInitPromise.then(function() {
      $scope.job.Departure = new Date();
      driveToCustomer();
    });
  };

  $scope.finishJob = function() {
    if($scope.job.CostsReal) {
      $scope.job.CostsReal = $scope.job.CostsReal.replace(',','.');
      $scope.job.CostsReal = parseFloat($scope.job.CostsReal);
    }
    if("number" != typeof($scope.job.CostsReal)) {
      $ionicPopup.alert({
        title: 'Fehler',
        template: 'Sie haben keinen korrekten endgültigen Preis angegeben!'
      });
    } else {
      updateJobStatus(JobStatus.Finished);
      $state.go('app.next-job');
    }
  }

  var driveToCustomer = function() {
    // what is done now
    updateJobStatus(JobStatus.HeadingToCustomer)
    .then(function() {
      $scope.goLabel = 'Fahre zum Kunden...';
    });
    Driver.setTaxiStatus(TaxiStatus.Driving);
    // what is to be done when process() has finished
    routeFinishState = JobStatus.HeadingToDestination;
    currentRoute = routes[0];
    stepCounter = 0;
    processRoute();
  };

  var driveToDestination = function() {
    // what is done now
    updateJobStatus(JobStatus.HeadingToDestination)
    .then(function() {
      $scope.goLabel = 'Fahre zum Ziel...';
    });
    Driver.setTaxiStatus(TaxiStatus.Driving);
    // what is to be done when process() has finished
    routeFinishState = JobStatus.Finished;
    currentRoute = routes[1];
    stepCounter = 0;
    processRoute();
  };

  $scope.$on(JobStatus.HeadingToDestination, function() {
    driveToDestination();
  });

  $scope.$on(JobStatus.Finished, function() {
    // do s.th. when the job is finished
    $scope.job.Arrival = new Date();
    $scope.job.Status = JobStatus.Finished;
    Driver.setTaxiStatus(TaxiStatus.Waiting);
    $scope.jobDone = true;
    console.log("Job routes processing finished");
  });

  var processRoute = function() {
    if (stepCounter < currentRoute.legs[0].steps.length) {
      // process all steps within the route
      var step = currentRoute.legs[0].steps[stepCounter];
      Position.update(step.end_point.lat(), step.end_point.lng());
      stepCounter++;
      $timeout(processRoute, 1000); // wait 1 second before next execution
    } else {
      // emit the name of the JobStatus that should be processed next
      $scope.$emit(routeFinishState);
    }
  }

  var updateJobStatus = function(status) {
    $scope.job.Status = status;
    var promise = Jobs.update($scope.job);
    promise.then(function(response) {
      console.log("Job update response:")
      console.log(response);
    });
    return promise;
  }
})

.controller('NewJobCtrl', function($scope, $stateParams, $location, $ionicModal, Jobs, Driver, JobStatus) {
  $scope.job = {}; // needed to make the binding work
  $scope.autocomplete = {};
  $scope.options = {
    //country: 'de',
    //types: 'geocode'
  };
  
  $scope.modalDetails = false;
  // Load the modal from the given template URL
  $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
    $scope.modal = $ionicModal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });
  var checkJob = function(job) {
    var modalData = new ModalData();
    //if (!job.StartLatitude || !job.StartLongitude) {
    if(!job.Start) {
      modalData.setError(true);
      modalData.addLocalMessage(new Message(true, "Sie haben keinen gültigen Ort als Start angegeben!"));
      console.log("startDetails not valid");
    }
    if (!job.Destination) {
      modalData.setError(true);
      modalData.addLocalMessage(new Message(true, "Sie haben keinen gültigen Ort als Ziel angegeben!"));
      console.log("destinationDetails not valid");
    }
    if (!angular.isNumber(job.CountPassengers) && !job.CountPassengers) {
      modalData.setError(true);
      modalData.addLocalMessage(new Message(true, "Sie haben keine gültige Anzahl an Passagieren angegeben."));
      console.log("passengers not valid");
    }
    return modalData;
  }

  addJobSuccess = function(response) {
    $scope.modalData = new ModalData();
    $scope.modalData.setError(false);
    $scope.modalData.addLocalMessage(new Message(false, "Der neue Auftrag wurde erfolgreich erstellt."));
    $scope.modalData.addServerMessage(new Message(false, response.data));
    console.log("1");
    $location.path("/app/current-job/" + response.data.JobId);
  }

  addJobFailure = function(response) {
    $scope.modalData.setError(true);
    $scope.modalData.addLocalMessage(new Message(true, "Der neue Auftrag konnte nicht erstellt werden."));
    $scope.modalData.addServerMessage(new Message(true, response.data));
    console.log("2");
    $scope.modal.show();
  }

  $scope.addJob = function() {
    job = {
            "EmployeeId" : 42,
            "TaxiId" : 43,
            "Destination" : "Offenburg",
            "Start" : "Lahr",
            "CountPassengers" : 2,
            "Status" : "HeadingToDestination"
          };
    job1 = {"Status":"HeadingToCustomer",
             "TaxiId":42,
             "EmployeeId":41,
             "StartLatitude":48.4769251000,
             "StartLongitude":7.9492875000,
             "Destination":"Villingen-Schwenningen, Germany",
             "CountPassengers":4
    }
    
    console.log("autocomplete");
    console.log($scope.autocomplete);
    $scope.job.EmployeeId = Driver.getEmployeeId();
    $scope.job.TaxiId = Driver.getTaxiId();
    if(undefined == $scope.job.TaxiId) $scope.job.TaxiId = 42;
    $scope.job.Start = $scope.autocomplete.startText;
    $scope.job.Destination = $scope.autocomplete.destinationText;
    $scope.job.CountPassengers = $scope.autocomplete.passengers;
    $scope.job.Status = JobStatus.ReceivedOrder; // @TODO set via gui ?
    console.log("job");
    console.log($scope.job);

    $scope.modalData = checkJob($scope.job);
    console.log("modalData:");
    console.log($scope.modalData);
    console.log("JOB");
    
    Jobs.add($scope.job).then(addJobSuccess, addJobFailure);
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  function Message(error, text) {
    this.error = error; // boolean
    this.text = text; // string
  }
  function ModalData() {
    this.error = false;
    this.hasLocalMessages = false;
    this.hasServerMessages = false;
    this.localMessages = []; // own messages
    this.serverMessages = []; // from server, such as exception message
  }
  ModalData.prototype.setError = function(error) {
    this.error = error;
  };
  ModalData.prototype.addLocalMessage = function(messageObj) {
    this.localMessages.push(messageObj);
    this.hasLocalMessages = true;
  };
  ModalData.prototype.addServerMessage = function(messageObj) {
    this.serverMessages.push(messageObj);
    this.hasServerMessages = false;
  };
})

.controller('EmployeesCtrl', function($scope, $stateParams, $location, Employees, Driver) {
  Employees.all().then(function(response) {
    $scope.employees = response;
  });
  $scope.select = function(employeeID) {
    Driver.setEmployeeId(employeeID);
    $location.path('/app/next-jobs');
  }
  $scope.doRefresh = function() {
    Employees.refresh()
     .then(function(response) {
      console.log("resfreshed");
      console.log(response);
      $scope.employees = response;
      $scope.$broadcast('scroll.refreshComplete');
     });
  };
})

.controller('PauseCtrl', function($scope, $timeout, $ionicSideMenuDelegate, ShiftManager) {

  $scope.pause = {};

  var poller = function() {
    if($scope.secondsRemaining > 0) {
      $scope.secondsRemaining--;
      $timeout(poller, 1000);
    } else {
      $scope.$emit("PauseDone");
    }
  }

  $scope.$on("PauseDone", function() {
    $ionicSideMenuDelegate.canDragContent(true);
    $scope.pause.setEnd(new Date());
    ShiftManager.addPause($scope.pause);
  });

  $scope.beginPause = function() {
    $scope.pause = ShiftManager.newPause();
    $scope.pause.setStart(new Date());
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.secondsRemaining = 15 * 60;
    $timeout(poller, 1000);
  }
  $scope.click = function() {
    $scope.count++;
    $timeout($scope.click, 1000);
  }

  $scope.endtime = new Date(1420070400000);
})

.controller('ShiftCtrl', function($scope, $timeout, $ionicPopup, ShiftManager) {
  $scope.beginShift = function(dayIndex) {
    var today = new Date();
    if (today.getDay() != dayIndex) {
      $ionicPopup.alert({
        title: "Fehler",
        template: "Sie können diese Schicht heute nicht beginnen, da sie für einen anderen Tag vorgesehen ist."
      });
    } else {
      var shift = $scope.shifts[dayIndex];
      shift.begin();
    }
    console.log("Clicked index: " + dayIndex);
  }
  $scope.endShift = function(dayIndex) {
    var today = new Date();
    if (today.getDay() != dayIndex) {
      $ionicPopup.alert({
        title: "Fehler",
        template: "Sie können diese Schicht heute nicht beenden, da sie für einen anderen Tag vorgesehen ist."
      });
    } else {
      var shift = $scope.shifts[dayIndex];
      ShiftManager.setCurrentShift(shift);
      shift.end();
    }
    console.log("Clicked index: " + dayIndex);
  }
  $scope.newWeek = function() {
    $scope.shifts = ShiftManager.beginNewWeek();
    console.log("shifts");
    console.log($scope.shifts);
  }
});