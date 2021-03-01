import {Component} from '@angular/core';
import { LoggerService } from '@flight-workspace/logger-lib';

@Component({
  selector: 'flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(protected loggerService: LoggerService) {
    this.loggerService.log('App loaded');
  }

}
