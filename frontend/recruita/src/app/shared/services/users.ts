import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users {

  private usersApiURL: string = `${environment.AUTH_API_URL}/users`;

  constructor(private http: HttpClient) { }

  getUserById(user_id: string): Observable<any> {
    return this.http.get(`${this.usersApiURL}/${user_id}`);
  }
}
