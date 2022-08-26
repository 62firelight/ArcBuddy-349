import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../Profile';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {

  constructor(private http: HttpClient) { }

  selectFromDefinition(name: string, hash: string): Observable<any> {
    const url = `api/manifest/${name}/${hash}`;
    return this.http.get<any>(url);
  }
}
