describe('Driver', function() {
  var driver, taxiStatus;
 
  // excuted before each "it()" is run.
  beforeEach(function() {
    // load the module
    module('rapidTransport');
 
    // inject Driver and TaxiStatus for testing
    inject(function(Driver, TaxiStatus) {
      driver = Driver;
      taxiStatus = TaxiStatus;
    });
  });
 
  it('should set an employee id', function() {
    driver.setEmployeeId(1);
    expect(driver.getEmployeeId()).toEqual(1);
  });
  it('should set a taxi id', function() {
    driver.setTaxiId(1);
    expect(driver.getTaxiId()).toEqual(1);
  });
  it('should set the taxi status to driving', function() {
    driver.setTaxiStatus(taxiStatus.Driving);
    expect(driver.getTaxiStatus()).toEqual(taxiStatus.Driving);
  });
  it('should set the taxi status to waiting', function() {
    driver.setTaxiStatus(taxiStatus.Waiting);
    expect(driver.getTaxiStatus()).toEqual(taxiStatus.Waiting);
  })
});