import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Users {

  private usersApiURL: string = `${environment.AUTH_API_URL}/users`;

  constructor(private http: HttpClient) { }

  getUserById(user_id: string): Observable<any> {
    return this.http.get(`${this.usersApiURL}/${user_id}`);
  }

  checkTermsAndConditions(user_id: string) {
    return this.http.get(`${this.usersApiURL}/terms-and-conditions/${user_id}`);
  }

  acceptTermsAndConditions(user_id: string, accept: boolean): Observable<HttpResponse<any>> {
    return this.http.patch<any>(`${this.usersApiURL}/terms-and-conditions/${user_id}`, { accept }, { observe: 'response' });
  }
}
