import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AirportService {

  airports: string[] = [];
  baseUrl = `http://www.angular.at/api/airport`;

  reqDelay = 1000;

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}`);
  }

}
