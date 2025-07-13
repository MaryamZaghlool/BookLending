import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { format } from 'path';

@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.css'],
})
export class BookModalComponent {

  bookForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      publishedYear: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      coverImageUrl: ['', Validators.required],
      isAvailable: [true]
    });
  }

  @Input() mode: 'add' | 'edit' | 'view' = 'view';
  @Input() book: Book = {
    title: '',
    author: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    description: '',
    coverImageUrl: '',
    isAvailable: true,
  };
  @Output() save = new EventEmitter<Book>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.book);
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched(); // عشان تظهر الأخطاء
      return;
    }

    const book: Book = this.bookForm.value;
    this.save.emit(book); // ترجع القيم للأب
  }

}
