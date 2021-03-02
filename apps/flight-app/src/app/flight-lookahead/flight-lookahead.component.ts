import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { debounceTime, filter, map, pairwise, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.css']
})
export class FlightLookaheadComponent implements OnInit {

  control: FormControl;
  flights$: Observable<Flight[]>
  loading: boolean
  diff$: Observable<number>;


  constructor(protected flightService: FlightService) {
  }

  ngOnInit(): void {
    this.control = new FormControl();
    this.flights$ = this.control.valueChanges.pipe(
      filter(term => term?.length > 2),
      debounceTime(500),
      tap(_ => this.loading = true),
      switchMap((term: string) => this.flightService.find(term)),
      tap(_ => this.loading = false)
    )

    this.diff$ = this.flights$.pipe(
      pairwise(),
      map( ([a, b]) => b.length - a.length )
    );
  }

}
