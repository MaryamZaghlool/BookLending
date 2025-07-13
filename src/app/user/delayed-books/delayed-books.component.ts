import { Component, OnInit } from '@angular/core';
import { BorrowService } from '../../core/services/borrows.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../core/models/book.model';
import { ProgressSpinnerOverviewExample } from "../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-delayed-books',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerOverviewExample],
  templateUrl: './delayed-books.component.html',
  styleUrls: ['./delayed-books.component.css']
})
export class DelayedBooksComponent implements OnInit {
  delayedBooks: any[] = [];
  isLoading = false;

  constructor(private borrowService: BorrowService) { }

  ngOnInit(): void {
    this.fetchDelayedBooks();
  }

  fetchDelayedBooks() {
    this.isLoading = true;

    this.borrowService.getAllBorrows().subscribe({
      next: (data: Book[]) => {
        const now = new Date();

        // فقط الكتب اللي حالتها Borrowed وعدى عليها وقت الإرجاع
        this.delayedBooks = data.filter(book =>
          book.status === 'Borrowed' && book.dueDate && new Date(book.dueDate) < now
        );

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching delayed books:', err);
        this.isLoading = false;
      }
    });
  }
}
