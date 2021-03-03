import { createReducer, on } from '@ngrx/store';
import { Flight } from '@flight-workspace/flight-lib';
import { flightsLoaded, updateFlight } from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

export interface FlightBookingAppState {
  [flightBookingFeatureKey]: State
}

export interface State {
  flights: Flight[];
}

export const initialState: State = {
  flights: []
};


export const reducer = createReducer(
  initialState,

  on(flightsLoaded, (state, action) => {
    const flights = action.flights;
    return {...state, flights};
  }),

  on(updateFlight, (state, action) => {
    const flight = action.flight;
    const flights = state.flights.map(f => f.id === flight.id? flight: f);
    return { ...state, flights };
  }),
);

