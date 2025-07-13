import { Component } from '@angular/core';
import { Book } from '../../core/models/book.model';
import { BookService } from '../../core/services/book.service';
import { ProgressSpinnerOverviewExample } from "../../shared/components/spinner/spinner.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-book-list',
  imports: [ProgressSpinnerOverviewExample, CommonModule, PaginationComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  allBooks: Book[] = [];
  pagedBooks: Book[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 8;
  isLastPage = false;

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.bookService.getAvailableBooks().subscribe({
      next: (res: Book[]) => {
        this.allBooks = res;
        this.paginate();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch books', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.paginate();
  }

  paginate() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedBooks = this.allBooks.slice(startIndex, endIndex);
    this.isLastPage = endIndex >= this.allBooks.length;
  }

  goToDetails(id: number) {
    this.router.navigate(['/books', id]);
  }
}
