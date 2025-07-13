import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/Account`;
    private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private isAdminSubject = new BehaviorSubject<boolean>(localStorage.getItem('role') === 'Admin');
    isAdmin$ = this.isAdminSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    login(data: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data);
    }

    loginUpdates(token: string, role: string) {
        this.isLoggedInSubject.next(true);
        this.isAdminSubject.next(role === 'Admin');
    }


    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.isLoggedInSubject.next(false);
        this.isAdminSubject.next(false);

        this.router.navigate(['/login']);
    }
}
