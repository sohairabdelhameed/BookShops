import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthenticationService/AuthService';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  goToSignUp() {
    this.router.navigate(['/register']);
  }

  signIn() {
    this.authService.signInWithEmail(this.email, this.password)
      .then(() => {
        // Login successful - Redirect to home or desired page
        this.router.navigate(['/HomePage']);
      })
      .catch(error => {

        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'Failed to sigin';
        } else {
          this.errorMessage = 'Email not registered. Please sign up.';
        }
      });
  }

  
}
