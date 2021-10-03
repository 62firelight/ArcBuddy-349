import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http : HttpClient) { }

  getName(name: string, id: string): Observable<string> {
    const url = `${this.apiUrl}/api/players/${name}/${id}`;
    return this.http.get<string>(url);
  }
}
