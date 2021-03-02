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

  controlFrom: FormControl;
  controlTo: FormControl;
  flights$: Observable<Flight[]>
  loading: boolean
  diff$: Observable<number>;
  online: boolean = false;
  online$: Observable<boolean>;

  constructor(protected flightService: FlightService) {
  }

  ngOnInit(): void {
    this.controlFrom = new FormControl();
    this.controlTo = new FormControl();

    this.online$
      = interval(2000).pipe(
      startWith(0),
      map(_ => Math.random() < 0.5),
      distinctUntilChanged(),
      tap(value => this.online = value)
    );

    const inputFrom$ = this.controlFrom.valueChanges.pipe(
      filter(term => term?.length > 2),
      debounceTime(500));


    const inputTo$ = this.controlTo.valueChanges.pipe(
      filter(term => term?.length > 2),
      debounceTime(500));

    this.flights$ = combineLatest([
      inputFrom$,
      inputTo$,
      this.online$
    ]).pipe(
      filter(([from, to, online]) => {
        return !!online && !!from && !!to
      }),
      tap(([from, to, online]) => {
        this.online = !!online;
      }),
      tap(_ => this.loading = true),
      switchMap(([from, to, online]) => this.flightService.find(from, to)),
      tap(_ => this.loading = false)
    );


    this.diff$ = this.flights$.pipe(
      pairwise(),
      map(([a, b]) => b.length - a.length)
    );


  }

}
