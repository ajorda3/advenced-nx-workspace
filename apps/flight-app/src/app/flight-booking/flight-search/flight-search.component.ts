/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { FlightBookingAppState } from '../+state/flight-booking.reducer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { flightsLoaded } from '../+state/flight-booking.actions';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  flights$: Observable<Flight[]>;

  get flights() {
    return this.flightService.flights;
  }

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  constructor(
    protected store: Store<FlightBookingAppState>,
    private flightService: FlightService) {
  }

  ngOnInit() {
    this.flights$ = this.store.select(s => s.flightBooking.flights);
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService
      .find(this.from, this.to, this.urgent).pipe(
      tap((flights: Flight[]) => this.store.dispatch(flightsLoaded({flights})))
    ).subscribe();
  }

  delay(): void {
    this.flightService.delay();
  }

}
