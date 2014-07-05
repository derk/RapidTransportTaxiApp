/**
* rapidTransport.constants Module
*
* Description
*/
angular.module('rapidTransport.constants', []).

constant('JobStatus', {
	// Auftrag abgeschlossen
    Finished : "Finished",
    // Taxi auf dem Weg zum Kunden
    HeadingToCustomer : "HeadingToCustomer",
    // Taxi auf dem Weg zu Ziel des Kunden
    HeadingToDestination : "HeadingToDestination",
    // Auftrag eingegangen
    ReceivedOrder : "ReceivedOrder",
    Pending : "Pending"
})

.constant('TaxiStatus', {
    Driving : "Driving",
    Waiting : "Waiting"
});