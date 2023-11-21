import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthenticationService/AuthService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.getUsername(); // Call the method to retrieve the username
  }

  getUsername() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        // User is logged in, retrieve and display username
        this.username = user.displayName || user.email || 'User';
      } else {
        // User is not logged in
        // Handle this scenario if needed
      }
    });
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        // Redirect to the home page after successful logout
        this.router.navigate(['/HomePage']);
      })
      .catch(error => {
        console.error('Error logging out:', error);
        // Handle logout errors
      });
  }
}
