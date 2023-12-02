import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as bcrypt from 'bcryptjs'; // Import bcrypt
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,private firestore: AngularFirestore) { }
 
  getCurrentUserID(): string | null {
    const user = this.afAuth.auth.currentUser;
    return user ? user.uid : null;
  }
  
  getCurrentUsername(): string | null {
    const user = this.afAuth.auth.currentUser;
    return user ? user.displayName : null;
  }
  // Sign up with email and password
  signUpWithEmail(username: string, email: string, password: string): Promise<any> {
    // Hash the password before creating user in Firebase Authentication (for demonstration purposes only)
    return bcrypt.hash(password, 10) // 10 is the number of salt rounds
      .then((hashedPassword) => {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, hashedPassword)
          .then((credential) => {
            return credential.user.updateProfile({
              displayName: username // Set the display name after successful sign-up
            })
            .then(() => {
              // Get the user ID and email
              const userId = credential.user.uid;
              const userEmail = credential.user.email;
  
              // Add user data to Firestore
              const userData = {
                username: username,
                email: userEmail,
                userId: userId
                // Add more user data as needed
              };
  
              return this.addUser(userData);
            });
          });
      });
  }
  
  addUser(userData: any) {
    return this.firestore.collection('users').add(userData);
  }


  
  
  // Sign in with email and password
  signInWithEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password) .then((credential) => {
      // Log the user ID when successfully signed in
      console.log('User ID:', credential.user.uid);
      return credential.user;
    });
  }
  
  updateUserData(userId: string, newData: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).update(newData);
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
