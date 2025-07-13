import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BorrowService {
    private apiUrl = `${environment.apiUrl}/Borrows`;

    constructor(private http: HttpClient) { }

    // ✅ GET: كل الإعارات
    getAllBorrows(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // ✅ POST: استعارة كتاب جديد
    borrowBook(id: number) {
        return this.http.post(`${this.apiUrl}`, { bookId: id });
    }


    // ✅ GET: إعارة واحدة حسب ID
    getBorrowById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    // ✅ PUT: إرجاع كتاب
    returnBook(id: number) {
        return this.http.put(`${this.apiUrl}/${id}/return`, {});
    }
}
