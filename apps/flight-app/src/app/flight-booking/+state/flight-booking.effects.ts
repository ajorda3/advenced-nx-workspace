import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FlightService } from '@flight-workspace/flight-lib';
import { catchError, map, switchMap } from 'rxjs/operators';
import { flightsLoaded, loadFlights, loadFlightsError } from './flight-booking.actions';
import { of } from 'rxjs';

@Injectable()
export class FlightBookingEffects {

  loadFlights = createEffect(() => this.actions$.pipe(
    ofType(loadFlights),
    switchMap(a => this.flightService.find(a.from, a.to, a.urgent).pipe(
      map(flights => flightsLoaded({flights})),
      catchError(err => of(loadFlightsError()))
    )),
  ));

  constructor(
    private actions$: Actions,
    private flightService: FlightService) { 
  }

}
