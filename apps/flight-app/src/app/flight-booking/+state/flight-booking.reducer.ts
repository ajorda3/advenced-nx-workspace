import { createFeatureSelector, createReducer } from '@ngrx/store';
import { Flight } from '@flight-workspace/flight-lib';
import { flightsLoaded, updateFlight } from './flight-booking.actions';
import { mutableOn } from 'ngrx-etc';

export const flightBookingFeatureKey = 'flightBooking';

export const selectFlightBooking = createFeatureSelector<State>('flightBooking');


export interface FlightBookingAppState {
  [flightBookingFeatureKey]: State
}

export interface State {
  flights: Flight[],
  negativeList: number[]
}

export const initialState: State = {
  flights: [],
  negativeList: [3]
};


export const reducer = createReducer(
  initialState,

  mutableOn(flightsLoaded, (state: State, action) => {
    state.flights = action.flights;
  }),

  mutableOn(updateFlight, (state: State, action) => {
    const flight = action.flight;
    state.flights = state.flights.map(f => f.id === flight.id ? flight : f);
  }),
);

