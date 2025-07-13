import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerOverviewExample } from "../../shared/components/spinner/spinner.component";
import { BorrowService } from '../../core/services/borrows.service';
import { ToasterComponent } from "../../shared/components/toaster/toaster.component";
@Component({
  selector: 'app-book-details',
  imports: [CommonModule, ProgressSpinnerOverviewExample, ToasterComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  bookId!: number;
  bookData?: Book;
  isLoading = false;
  borrowId?: number; // Track the borrow ID
  isBorrowed?: boolean;
  currentBookId?: number;
  dueDate?: string;
  isOverdue: boolean = false;


  constructor(private route: ActivatedRoute, private bookService: BookService, private borrowService: BorrowService) { }

  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.borrowId = +localStorage.getItem('borrowId')!;
    if (this.borrowId) {
      this.borrowId = +this.borrowId;
      this.isBorrowed = true;
      localStorage.setItem("isBorrowed", "true");
    } else {
      localStorage.setItem("isBorrowed", "false");
    }
    //fetch the book ID from the route parameters
    const currentPath = window.location.pathname;
    this.currentBookId = +localStorage.getItem('bookId')!;

    if (currentPath.includes('/profile')) {
      // const storedBookId = localStorage.getItem('bookId');
      // if (storedBookId) {
      //   this.bookId = +storedBookId;
      // }
      // else {
      //   this.isLoading = false;
      // }
      this.borrowService.getBorrowById(this.borrowId).subscribe({
        next: (borrow) => {
          this.bookId = borrow.bookId;
          this.dueDate = borrow.dueDate
          if (this.dueDate) {
            const now = new Date();
            const due = new Date(this.dueDate);
            this.isOverdue = now > due;
          }
          console.log(borrow)
          this.bookService.getBookById(this.bookId).subscribe({
            next: (book) => {
              this.dueDate = borrow.dueDate
              this.bookData = book;
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error fetching book', err);
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error fetching borrow details', err);
          this.isLoading = false;
        }
      });
    } else {
      // غير كده، جيبه من الـ route param
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) this.bookId = +id;
      });
    }

    // استدعاء بيانات الكتاب بعد التأكد من وجود ID
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book) => {
          this.bookData = book;
          // console.log(this.bookData.id)
          // console.log("bbokId", this.currentBookId);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching book', err);
          this.isLoading = false;
        }
      });
    }
  }

  borrowBook() {
    if (this.bookData?.id) {
      this.borrowService.borrowBook(this.bookData.id).subscribe({
        next: (response: any) => {
          console.log(response)
          this.showToast('Book borrowed successfully', 'success');
          this.borrowId = response.id;
          this.dueDate = response.dueDate;
          if (this.borrowId !== undefined) {
            localStorage.setItem('borrowId', this.borrowId.toString());
            this.isBorrowed = true;
            this.currentBookId = this.bookId;
            localStorage.setItem('isBorrowed', 'true');
            localStorage.setItem('bookId', this.bookId.toString());
          }

        },
        error: (err) => {
          this.showToast('Error borrowing book, Login first', 'error');
          console.error('Error borrowing book', err);
        }
      });
    }
  }

  returnBook() {
    if (this.borrowId) {
      this.borrowService.returnBook(this.borrowId).subscribe({
        next: (response: any) => {
          this.showToast('Book returned successfully', 'success');
          this.borrowId = undefined; // Clear borrowId after returning
          this.currentBookId = undefined;
          this.dueDate = undefined;
          this.isOverdue = false;
          if (this.borrowId === undefined) {
            localStorage.removeItem('borrowId');
            localStorage.removeItem('bookId');
            this.isBorrowed = false;
            localStorage.removeItem('isBorrowed');
          }
        },
        error: (err) => {
          console.error('Error returning book', err);
        }
      });
    }
  }
}
