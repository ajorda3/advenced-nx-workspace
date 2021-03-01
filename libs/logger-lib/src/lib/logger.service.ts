/* eslint-disable no-restricted-syntax */
import { Injectable, Optional } from '@angular/core';
import { LoggerConfig } from './logger.config';
import { LogFormatterService } from './log-formatter.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(@Optional() private config: LoggerConfig, protected logFormatterService: LogFormatterService) {
  }

  debug(message: string): void {
    if (!!this.config.enableDebug) {
      console.debug(this.logFormatterService.format(message));
    }
  }

  log(message: string): void {
    console.log(this.logFormatterService.format(message));
  }
}
