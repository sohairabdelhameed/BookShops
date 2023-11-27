import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../user/AuthenticationService/AuthService';

@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  username: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        // User is logged in, retrieve and display username
        this.username = user.displayName || user.email || 'User';
      } else {
        // User is not logged in, do something (e.g., redirect to login)
        this.username = ''; // Clear username if not logged in
      }
    });
  }
  
  logout() {
    this.authService.signOut()
      .then(() => {
        // Clear the username after logout
        this.username = ''; // Set username to empty string or null
        this.router.navigate(['/signIn']);
      })
      .catch(error => {
        // Handle logout errors
        console.error('Error logging out:', error);
      });
  }
  
  
}
