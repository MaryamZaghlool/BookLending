import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ManageBooksComponent } from './admin/manage-books/manage-books.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { DelayedBooksComponent } from './user/delayed-books/delayed-books.component';



export const routes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: '', component: BookListComponent },
            { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
            { path: 'books', component: BookListComponent },
            { path: 'books/:id', component: BookDetailsComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            {
                path: 'dashboard',
                component: ManageBooksComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: ['Admin'] }
            },
              {
                path: 'delayed-books',
                component: DelayedBooksComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: ['Admin'] }
            }
        ]
    }

    // ⛔ Not found
    // { path: '**', component: NotFoundComponent }
];
