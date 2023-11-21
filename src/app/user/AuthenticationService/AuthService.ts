import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  // Sign up with email and password
  signUpWithEmail(username: string, email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)  .then((credential) => {
        return credential.user.updateProfile({
          displayName: username // Set the display name after successful sign-up
        });
      });
  }

  // Sign in with email and password
  signInWithEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  // Sign out
  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  // Get the currently authenticated user
  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }
}
