import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accident } from '../interfaces/Accident/Accident.interface';

@Injectable({
  providedIn: 'root',
})
export class AccidentService {
  private readonly API_URL = 'https://localhost:7269/api';

  constructor(private http: HttpClient) {}

  getAccidents(): Observable<Accident[]> {
    return this.http.get<Accident[]>(`${this.API_URL}/Incidents`);
  }
}
