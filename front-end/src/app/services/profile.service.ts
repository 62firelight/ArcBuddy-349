import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '../Character';
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
  private apiUrl = 'localhost:3000';
  // private apiUrl = 'http://ec2-3-87-199-253.compute-1.amazonaws.com';

  constructor(private http : HttpClient) { }

  getName(name: string, id: string): Observable<Profile> {
    const url = `api/players/${name}/${id}`;
    return this.http.get<Profile>(url);
  }

  getCharacters(type: string, id: string): Observable<Character[]> {
    const url = `api/players/character/${type}/${id}`;
    return this.http.get<Character[]>(url);
  }

  getStats(type: string, id: string): Observable<Object> {
    const url = `api/players/account/${type}/${id}`;
    return this.http.get<Object>(url);
  }

  getProfile(name: string | undefined): Observable<Profile> {
    const url = `api/players/stats/${name}`;
    return this.http.get<Profile>(url);
  }

  getProfiles(): Observable<Profile[]> {
    const url = `api/players/stats`;
    return this.http.get<Profile[]>(url);
  }

  addProfile(profile: Profile): Observable<Profile> {
    const url = `api/players/stats`;
    return this.http.post<Profile>(url, profile, httpOptions);
  }

  deleteProfile(name: string | undefined): Observable<Profile> {
    const url = `api/players/stats/${name}`;
    return this.http.delete<Profile>(url);
  }
}
