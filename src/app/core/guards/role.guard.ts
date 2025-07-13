import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'][0]; // جاي من route config
    const userRole = localStorage.getItem('role');
    console.log('Expected:', expectedRole);
    console.log('User Role:', userRole);

    if (userRole === expectedRole) {
      console.log('Access granted');
      return true;
    } else {
      // توجيه حسب الدور
      this.router.navigate(
        userRole === 'admin' ? ['/admin/dashboard'] : ['/books']
      );
      return false;
    }
  }
}
