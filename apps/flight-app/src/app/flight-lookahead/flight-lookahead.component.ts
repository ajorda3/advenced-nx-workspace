import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, interval, merge, Observable, of, pipe, Subject } from 'rxjs';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise, scan,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';

type Projector<T, U> = (item: T) => Observable<U>;

function switchMapCompensate<T,U>(projector: Projector<T,U>) {
  return pipe(
    switchMap( (p:T) => projector(p).pipe(catchError(_ => of([]))))
  );
}

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

  private refreshClickSubject = new Subject<void>();
  refreshClick$ = this.refreshClickSubject.asObservable();

  basket$: Observable<Flight[]>;

  private addToBasketSubject = new Subject<Flight>();
  addToBasket$ = this.addToBasketSubject.asObservable();
  history$: Observable<Flight[]>;

  refresh() {
    this.refreshClickSubject.next();
  }

  constructor(protected flightService: FlightService, protected cdRef: ChangeDetectorRef) {
  }

  select(f: Flight) {
    this.addToBasketSubject.next(f);
  }

  ngOnInit(): void {
    this.controlFrom = new FormControl();
    this.controlTo = new FormControl();

    this.online$
      = interval(2000).pipe(
      startWith(0),
      // map(_ => Math.random() < 0.5),
      map(_ => true),
      distinctUntilChanged(),
      tap(value => {
        this.online = value;
        this.cdRef.detectChanges();
      })
    );


    const debouncedFrom$ = this.controlFrom.valueChanges.pipe(debounceTime(300));
    const debouncedTo$ = this.controlTo.valueChanges.pipe(debounceTime(300));

    const combined$ = combineLatest([debouncedFrom$, debouncedTo$, this.online$])
      .pipe(shareReplay({bufferSize: 1, refCount: true}));

    this.flights$ = merge(
      combined$,
      this.refreshClick$.pipe(map(_ => [this.controlFrom.value, this.controlTo.value, this.online]))

      // This is an alternative without side effects (like this.online):
      // this.refreshClick$.pipe(switchMap(_ => combined$.pipe(take(1))))
    ).pipe(
      filter(([_, __, online]) => online),
      map(([value, valueTo, _]) => [value, valueTo]),
      switchMap(([from, to]) => this.flightService.find(from, to)),
      catchError((e) => {
        console.log('Error ' + e);
        return [];
      })
    );

    this.diff$ = this.flights$.pipe(
      pairwise(),
      map(([a, b]) => b.length - a.length)
    );

    this.basket$ = this.addToBasket$.pipe(
      scan((acc, flight) => {
        return [...acc, flight]
      }, [])
    );

    this.history$ = this.flights$.pipe(
      scan((acc, flight) => {
        return [...acc, ...flight]
      }, [])
    );


  }

}
