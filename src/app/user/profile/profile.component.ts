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
  email: string = '';
  newName: string = '';
  newEmail: string = '';
  isEditing: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          this.username = user.displayName || user.email || 'User';
          this.email = user.email || '';
        } else {
          // Handle not logged in
        }
      },
      error => {
        console.error('Error retrieving user info:', error);
        // Handle error
      }
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.newName = this.username;
      this.newEmail = this.email;
    }
  }

  saveChanges() {
    // Perform save logic
    this.username = this.newName;
    this.email = this.newEmail;
    this.isEditing = false; // Exit edit mode
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/HomePage']);
      })
      .catch(error => {
        console.error('Error logging out:', error);
        // Handle logout error
      });
  }
}
