/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogMonitorComponent } from './log-monitor.component';
import { LoggerConfig } from './logger.config';
import { LogFormatterService } from './log-formatter.service';

// imports: [ LoggerModule.forRoot({ ... }) ]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LogMonitorComponent
  ],
  // providers: [
  //   LoggerService
  // ],
  exports: [
    LogMonitorComponent
  ]
})
export class LoggerModule {

  // Setup
  static forRoot(config: LoggerConfig): ModuleWithProviders<LoggerModule> {
    return {
      ngModule: LoggerModule,
      providers: [
        {provide: LoggerConfig, useValue: config},
        {provide: LogFormatterService, useClass: config.logFormatter}
      ]
    }
  }

}
