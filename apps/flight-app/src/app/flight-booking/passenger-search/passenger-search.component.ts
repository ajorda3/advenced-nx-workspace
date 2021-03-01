import {Component, ViewEncapsulation} from '@angular/core';
import { Passenger, PassengerService } from '@flight-workspace/passenger-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-passenger-search',
  templateUrl: './passenger-search.component.html',
  styleUrls: ['./passenger-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PassengerSearchComponent {
   passangers$: Observable<Passenger[]>;

  constructor(protected passengerService: PassengerService) {
    this.passangers$ = this.passengerService.findAll();
  }

  deletePassanger(passanger: Passenger) {
    this.passengerService.delete(passanger.id).subscribe();
  }
}
