import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class BookService {
    private apiUrl = `${environment.apiUrl}/Books`;

    constructor(private http: HttpClient) { }

    getAllBooks(page?: number, pageSize?: number): Observable<Book[]> {
        let params: any = {};

        if (page !== undefined && pageSize !== undefined) {
            params.PageNumber = page;
            params.PageSize = pageSize;
        }

        return this.http.get<Book[]>(this.apiUrl, { params });
    }

    getAvailableBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.apiUrl}/available`);
    }

    getBookById(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }

    addBook(book: Book) {
        return this.http.post(this.apiUrl, book);
    }

    updateBook(id: number, book: Book) {
        return this.http.put(`${this.apiUrl}/${id}`, book);
    }

    deleteBook(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
