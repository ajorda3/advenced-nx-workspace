import { createSelector } from "@ngrx/store";
import { FlightBookingAppState, selectFlightBooking } from './flight-booking.reducer';

export const selectFlights = createSelector(selectFlightBooking, s => s.flights);

export const negativeList = createSelector(selectFlightBooking, s => s.negativeList);

export const selectedFilteredFlights = createSelector(
  selectFlights,
  negativeList,
  (flights, negativeList) => flights.filter(f => !negativeList.includes(f.id))
);

export const selectFlightsWithProps = createSelector(
  (a: FlightBookingAppState) => a.flightBooking.flights,
  (flights, props) => flights.filter(f => !props.blackList.includes(f.id))
);

