describe('Position', function() {
	var Driver, Position, $httpBackend;

	beforeEach(function() {
		mockDriver = {
			getTaxiId: function() {
				return 1;
			}
		};
		// provide mock for the Driver dependency of Position
		module('rapidTransport.services', function ($provide) {
    		$provide.value('Driver', mockDriver);
  		});

		inject(function($injector) {
			$httpBackend = $injector.get('$httpBackend');
			Position = $injector.get('Position');
		});
	});

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should update the current position of a taxi', function() {
		var url = 'http://hsogprojekt.noip.me/rapid/api/positions/1';
		var msg = {
			Latitude : 12,
			Longitude : 24
		};
		$httpBackend.expectPUT(url, msg).respond(200, '');
		Position.update(msg.Latitude, msg.Longitude);
		$httpBackend.flush();
		expect(Position.current()).toEqual(msg);
	})
})