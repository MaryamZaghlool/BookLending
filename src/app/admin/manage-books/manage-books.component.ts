import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { BookModalComponent } from '../../shared/components/book-modal/book-modal.component';
import { CommonModule } from '@angular/common';
import { ToasterComponent } from '../../shared/components/toaster/toaster.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ProgressSpinnerOverviewExample } from '../../shared/components/spinner/spinner.component';
import { ConfirmAlertComponent } from '../../shared/components/shared/components/confirm-alert/confirm-alert.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [
    BookModalComponent,
    CommonModule,
    ToasterComponent,
    PaginationComponent,
    ProgressSpinnerOverviewExample,
    ConfirmAlertComponent,
  ],
  templateUrl: './manage-books.component.html',
  styleUrl: './manage-books.component.css',
})
export class ManageBooksComponent implements OnInit, OnDestroy {
  isLoading = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';
  allBooks: Book[] = [];
  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedBook?: Book;
  currentPage = 1;
  pageSize = 10;
  isLastPage = false;
  showConfirm = false;
  bookToDeleteId?: number;

  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchBooks(): void {
    this.isLoading = true;
    this.cd.markForCheck();

    this.bookService
      .getAllBooks(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books) => {
          if (JSON.stringify(this.allBooks) !== JSON.stringify(books)) {
            this.allBooks = books;
            this.isLastPage = books.length < this.pageSize;
          }
          this.isLoading = false;
          this.cd.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.showToast('Error fetching books', 'error');
          this.cd.markForCheck();
        },
      });
  }

  openAddModal() {
    this.modalMode = 'add';
    this.selectedBook = {
      title: '',
      author: '',
      isbn: '',
      publishedYear: new Date().getFullYear(),
      description: '',
      coverImageUrl: '',
      isAvailable: true,
    };
    this.showModal = true;
  }

  openEditModal(book: Book) {
    if (this.selectedBook?.id !== book.id) {
      this.modalMode = 'edit';
      this.selectedBook = { ...book };
      this.showModal = true;
    }
  }

  openViewModal(book: Book) {
    if (this.selectedBook?.id !== book.id) {
      this.modalMode = 'view';
      this.selectedBook = { ...book };
      this.showModal = true;
    }
  }

  handleSave(book: Book) {
    const action$ =
      this.modalMode === 'add'
        ? this.bookService.addBook(book)
        : book.id
          ? this.bookService.updateBook(book.id, book)
          : null;

    if (!action$) return;

    action$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showToast(
          this.modalMode === 'add'
            ? 'Book added successfully'
            : 'Book updated successfully',
          'success'
        );
        this.fetchBooks();
        this.showModal = false;
      },
      error: (error) => {
        console.error(
          this.modalMode === 'add' ? 'Error adding book:' : 'Error updating book:',
          error
        );
        this.showToast(
          this.modalMode === 'add'
            ? 'Error adding book'
            : 'Error updating book',
          'error'
        );
        this.cd.markForCheck();
      },
    });
  }

  confirmDelete(bookId: number) {
    this.bookToDeleteId = bookId;
    this.showConfirm = true;
  }

  handleConfirmDelete() {
    if (!this.bookToDeleteId) return;

    this.bookService
      .deleteBook(this.bookToDeleteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.fetchBooks();
          this.showToast('Book deleted successfully', 'success');
          this.showConfirm = false;
        },
        error: () => {
          this.showToast('Error deleting book', 'error');
          this.showConfirm = false;
          this.cd.markForCheck();
        },
      });
  }

  onPageChange(newPage: number) {
    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      this.fetchBooks();
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    if (this.toastMessage !== message) {
      this.toastMessage = message;
      this.toastType = type;
      this.cd.markForCheck();
      setTimeout(() => {
        this.toastMessage = null;
        this.cd.markForCheck();
      }, 3000);
    }
  }

  trackByBookId(index: number, book: Book): number {
    return book.id!;
  }
}
