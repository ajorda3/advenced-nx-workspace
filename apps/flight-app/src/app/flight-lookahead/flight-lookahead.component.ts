import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, interval, Observable } from 'rxjs';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { debounceTime, distinctUntilChanged, filter, map, pairwise, startWith, switchMap, tap } from 'rxjs/operators';

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
  online: boolean = false;
  online$: Observable<boolean>;

  constructor(protected flightService: FlightService) {
  }

  ngOnInit(): void {
    this.control = new FormControl();

    this.online$
      = interval(2000).pipe(
      startWith(0),
      map(_ => Math.random() < 0.5),
      distinctUntilChanged(),
      tap(value => this.online = value)
    );

    const input$ = this.control.valueChanges.pipe(
      filter(term => term?.length > 2),
      debounceTime(500));

    this.flights$ = combineLatest([
      input$,
      this.online$
    ]).pipe(
      filter(([_, online]) => !!online),
      map(([term, online]) => {
        this.online = !!online;
        return term;
      }),
      tap(_ => this.loading = true),
      switchMap((term: string) => this.flightService.find(term)),
      tap(_ => this.loading = false)
    );


    this.diff$ = this.flights$.pipe(
      pairwise(),
      map(([a, b]) => b.length - a.length)
    );


  }

}
