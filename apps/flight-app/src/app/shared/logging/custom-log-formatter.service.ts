import { Injectable } from '@angular/core';
import { LogFormatterService } from '@flight-workspace/logger-lib';

@Injectable()
export class CustomLogFormatterService extends LogFormatterService {
  format(message: string): string {
    const now = new Date().toISOString();
    return `[${now}] ${message}`;
  }
}
