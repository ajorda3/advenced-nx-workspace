import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Passenger } from '../models/passenger';


@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  passengers: Passenger[] = [];
  baseUrl = `http://www.angular.at/api/passenger`;

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<Passenger[]> {
    return this.http.get<Passenger[]>(`${this.baseUrl}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/id`);
  }
}
