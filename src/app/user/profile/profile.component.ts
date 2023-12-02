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
id:any;
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
    this.id = this.authService.getCurrentUserID();
    const userId = this.id; 
    if (userId) {
      const newData = {
        username: this.newName,
        email: this.newEmail,
        // Add other fields you want to update
      };
  
      this.authService.updateUserData(userId, newData)
        .then(() => {
          // Update successful
          // You might want to update the displayed user info here
          this.username = this.newName;
          this.email = this.newEmail;
  
          this.toggleEdit(); // Close the editing mode
        })
        .catch(error => {
          console.error('Error updating user data:', error);
          // Log specific details about the error
          console.log('Error code:', error.code);
          console.log('Error message:', error.message);
          // Handle error
        });
    }
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
