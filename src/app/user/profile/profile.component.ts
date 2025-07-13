import { Component } from '@angular/core';
import { BookDetailsComponent } from "../../books/book-details/book-details.component";

@Component({
  selector: 'app-profile',
  imports: [BookDetailsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
