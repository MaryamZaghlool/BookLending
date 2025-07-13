import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuOpen = false;
  isBorrowed = false;
  isAdmin = localStorage.getItem("role") === "Admin";
  isLoggedIn = !!localStorage.getItem("token");

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    this.updateIsBorrowed();

    this.AuthService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.AuthService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
    // check every second if the borrow status has changed
    setInterval(() => {
      this.updateIsBorrowed();
    }, 1000);
  }



  updateIsBorrowed() {
    const value = localStorage.getItem("isBorrowed");
    this.isBorrowed = value === "true";
  }


  logout() {
    this.AuthService.logout()
    this.isLoggedIn=false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
