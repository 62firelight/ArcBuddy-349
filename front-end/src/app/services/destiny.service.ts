import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '../Character';
import { Profile } from '../Profile';

@Injectable({
  providedIn: 'root'
})
export class DestinyService {

  constructor(private http : HttpClient) { }

  getName(name: string, id: string): Observable<Profile> {
    const url = `api/players/${name}/${id}`;
    return this.http.get<Profile>(url);
  }

  getStats(type: string, id: string): Observable<any> {
    const url = `api/players/account/${type}/${id}`;
    return this.http.get<any>(url);
  }

  getCharacters(type: string, id: string): Observable<any> {
    const url = `api/players/character/${type}/${id}`;
    return this.http.get<any>(url);
  }

  getVendors(): Observable<Object> {
    const url = `api/vendors`;
    return this.http.get<Object>(url);
  }
}
