import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthenticationService/AuthService';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  goToSignIn() {
    this.router.navigate(['/signIn']);
  }

  signUp() {
    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords don't match.";
      return;
    }

    // Call your AuthService's signUpWithEmail method to register the user
    this.authService.signUpWithEmail(this.username, this.email, this.password)
      .then(() => {
        // Redirect to Home page or any other desired page after successful sign-up
        this.router.navigate(['/HomePage']);
      })
      .catch(error => {
        this.errorMessage = error.message;
        console.error('Error signing up:', error);
      }); // <-- Add closing parenthesis here
  }
}
