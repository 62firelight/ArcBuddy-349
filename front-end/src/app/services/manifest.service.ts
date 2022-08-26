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
export class ManifestService {

  constructor(private http: HttpClient) { }

  selectFromDefinition(name: string, hash: string): Observable<any> {
    const url = `api/manifest/${name}/${hash}`;
    return this.http.get<any>(url);
  }

  selectListFromDefinition(name: string, hashes: string): Observable<any[]> {
    const url = `api/manifest/${name}`;
    return this.http.post<any>(url, hashes, httpOptions);
  }
}
