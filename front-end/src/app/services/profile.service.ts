import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../Profile';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http : HttpClient) { }

  getName(name: string, id: string): Observable<Profile> {
    const url = `${this.apiUrl}/api/players/${name}/${id}`;
    return this.http.get<Profile>(url);
  }

  getStats(type: string, id: string): Observable<Object> {
    const url = `${this.apiUrl}/api/players/account/${type}/${id}`;
    return this.http.get<Object>(url);
  }

  getProfile(name: string | undefined): Observable<Profile> {
    const url = `${this.apiUrl}/api/players/stats/${name}`;
    return this.http.get<Profile>(url);
  }

  getProfiles(): Observable<Profile[]> {
    const url = `${this.apiUrl}/api/players/stats`;
    return this.http.get<Profile[]>(url);
  }

  addProfile(profile: Profile): Observable<Profile> {
    const url = `${this.apiUrl}/api/players/stats`;
    return this.http.post<Profile>(url, profile, httpOptions);
  }

  deleteProfile(name: string | undefined): Observable<Profile> {
    const url = `${this.apiUrl}/api/players/stats/${name}`;
    return this.http.delete<Profile>(url);
  }
}
