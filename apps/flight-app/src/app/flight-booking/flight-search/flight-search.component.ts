/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { loadFlights, updateFlight } from '../+state/flight-booking.actions';
import { selectFlightsWithProps } from '../+state/flight-booking.selectors';

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
    protected store: Store<any>,
    private flightService: FlightService) {
  }

  ngOnInit() {
    this.flights$ = this.store.select(selectFlightsWithProps, {blackList: [3]});
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.store.dispatch(loadFlights({
      from: this.from,
      to: this.to,
      urgent: this.urgent
    }));

    // this.flightService
    //   .find(this.from, this.to, this.urgent).pipe(
    //   tap((flights: Flight[]) => this.store.dispatch(flightsLoaded({flights})))
    // ).subscribe();
  }

  delay(): void {
    this.flights$.pipe(take(1)).subscribe(flights => {
      let flight = flights[0];

      let oldDate = new Date(flight.date);
      let newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
      let newFlight = {...flight, date: newDate.toISOString()};

      this.store.dispatch(updateFlight({flight: newFlight}));
    });
  }

}
