import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
@Input() currentPage = 1;
@Input() isLastPage = false;
@Output() change = new EventEmitter<number>();


changePage(direction: 'next' | 'prev') {
  if (direction === 'next' && !this.isLastPage) {
    this.change.emit(this.currentPage + 1);
  } else if (direction === 'prev' && this.currentPage > 1) {
    this.change.emit(this.currentPage - 1);
  }
}
}
