import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../user/AuthenticationService/AuthService';
import { FirestoreService } from '../../firebaseServices/fireStore.service'; 
@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  username: string = '';

  constructor(private router: Router, private authService: AuthService,private firestoreService: FirestoreService, private el: ElementRef) {}

  ngOnInit() {
    this.getCurrentUser();

  }
  @Output() scrollToSectionEvent = new EventEmitter<string>();

  scrollToSection(sectionId: string) {
    this.scrollToSectionEvent.emit(sectionId);
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
