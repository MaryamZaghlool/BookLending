import { Component } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { BookModalComponent } from "../../shared/components/book-modal/book-modal.component";
import { CommonModule } from '@angular/common';
import { ToasterComponent } from "../../shared/components/toaster/toaster.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { ProgressSpinnerOverviewExample } from "../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-manage-books',
  imports: [BookModalComponent, CommonModule, ToasterComponent, PaginationComponent, ProgressSpinnerOverviewExample],
  templateUrl: './manage-books.component.html',
  styleUrl: './manage-books.component.css'
})
export class ManageBooksComponent {

  isLoading = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';
  allBooks?: Book[];
  showModal = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedBook?: Book;
  currentPage = 1;
  pageSize = 10;
  isLastPage = false;

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.fetchBooks();
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }

  constructor(private bookService: BookService) { }

  fetchBooks(): void {
    this.isLoading = true;
    this.bookService.getAllBooks(this.currentPage, this.pageSize).subscribe({
      next: (books) => {
        this.allBooks = books;
        this.isLastPage = books.length < this.pageSize; // If the number of books is less than pageSize, it's the last page
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showToast('Error fetching books', 'error');
      }
    });
  }


  nextPage() {
    this.isLoading = true;
    this.currentPage++;
    this.fetchBooks();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.isLoading = true;
      this.currentPage--;
      this.fetchBooks();
    }
  }


  ngOnInit(): void {
    this.fetchBooks();
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
      isAvailable: true
    };
    this.showModal = true;
  }

  openEditModal(book: Book) {
    this.modalMode = 'edit';
    this.selectedBook = { ...book };
    this.showModal = true;
  }

  openViewModal(book: Book) {
    this.modalMode = 'view';
    this.selectedBook = { ...book };
    this.showModal = true;
  }



  handleSave(book: Book) {
    if (this.modalMode === 'add') {
      this.bookService.addBook(book).subscribe({
        next: () => {
          this.showToast('Book added successfully', 'success');
          this.fetchBooks();
          this.showModal = false;
        },
        error: (error) => {
          console.error('Error adding book:', error);
          this.showToast('Error adding book', 'error');
        }
      });
    } else if (this.modalMode === 'edit' && book.id) {
      this.bookService.updateBook(book.id, book).subscribe({
        next: () => {
          this.showToast('Book updated successfully', 'success');
          this.fetchBooks(); // ✅ rerender table
          this.showModal = false;
        },
        error: (error) => {
          console.error('Error updating book:', error);
          this.showToast('Error updating book', 'error');
        }
      });
    }
  }



  // viewBook(bookId: number) {
  //   this.bookService.getBookById(bookId).subscribe({
  //     next: (book) => {
  //       console.log('Book details:', book);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching book details:', error);
  //     }
  //   });
  // }

  // editBook(bookId: number, book: Book) {
  //   this.bookService.updateBook(bookId, book).subscribe({
  //     next: (book) => {
  //       this.showToast('Book updated successfully', 'success');
  //       console.log('Book details:', book);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching book details:', error);
  //     }
  //   });
  // }

  deleteBook(bookId: number) {
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        this.fetchBooks();
        this.showToast('Book deleted successfully', 'success');
        console.log("book deleted successfully");
      },
      error: (error) => {
        this.showToast('Error deleting book', 'error');
        console.error('Error fetching book details:', error);
      }
    });
  }

  // addBook(book: Book) {
  //   this.bookService.addBook(book).subscribe({
  //     next: (book) => {
  //       this.fetchBooks();
  //       this.showToast('Book added successfully', 'success');
  //     },
  //     error: (error) => {
  //       console.error('Error adding book:', error);
  //     }
  //   });
  // }
}
