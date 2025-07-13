import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToasterComponent } from '../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, ToasterComponent,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

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
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  getUserRoleFromToken(): string | null {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1]; // ناخد الجزء التاني من الـ JWT
      const decoded = JSON.parse(atob(payload)); // نفك تشفير base64

      const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      return userRole || null;
    } catch (err) {
      console.error('Error decoding token', err);
      return null;
    }
  }


  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    this.authService.login(payload).subscribe({
      next: (res: any) => {

        this.authService.saveToken(res.token);

        const role = this.getUserRoleFromToken();

        this.authService.loginUpdates(res.token, this.getUserRoleFromToken()!);

        if (role) {
          localStorage.setItem('role', role);
        }

        this.showToast('Login successful', 'success');

        // 🧭 بعد الدخول، التوجيه حسب الدور (اختياري):
        setTimeout(() => {
          if (role === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/books']);
          }
        }, 1000);
      },
      error: (err: any) => {
        this.showToast('email or password is incorrect', 'error');
        console.error('Login error:', err);
      }
    });
  }
}
