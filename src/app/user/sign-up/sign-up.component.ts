import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthenticationService/AuthService';
import * as bcrypt from 'bcryptjs'; // Import bcrypt

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

    // Hash the password
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        this.errorMessage = 'Error hashing password.';
        return;
      }

      // Call your AuthService's signUpWithEmail method with hashed password
      this.authService.signUpWithEmail(this.username, this.email, hashedPassword)
        .then(() => {
          // Redirect to Home page or any other desired page after successful sign-up
          this.router.navigate(['/HomePage']);
        })
        .catch(error => {
          this.errorMessage = error.message;
          console.error('Error signing up:', error);
        });
    });
  }
}
