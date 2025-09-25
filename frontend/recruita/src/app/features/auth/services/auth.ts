import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import {EnvVarsConfig} from '../../../shared/services/env-vars-config';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = "";
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private envVarsConfig: EnvVarsConfig) { }

  ngOnInit() {
    this.envVarsConfig.AUTH_API_URL;
  }

  register(name: string, lastName: string, phoneNumber: string, email: string, password: string, role: string, organization: string): Observable<any> {
    const newUser = {
      name: name,
      last_name: lastName,
      phone_number: phoneNumber,
      role: role,
      email: email,
      password: password,
      organization: organization
    };

    return this.http.post(`${this.apiUrl}/auth/register`, newUser);
  }

  login(email: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(`${this.apiUrl}/auth/token`, body.toString(), { headers });
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  setRole(role: string) {
    this.userRoleSubject.next(role);
  }

  getRole(): string | null {
    return this.userRoleSubject.getValue();
  }

  clearRole() {
    this.userRoleSubject.next(null);
  }

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('access_token'));
  }

  logout() {
    localStorage.removeItem('access_token');
    this.clearRole();
    this.router.navigate(['/login']);
  }
}
