import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, forkJoin, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
//import * as bcrypt from 'bcryptjs'; // Import bcrypt
import { map, switchMap, tap } from 'rxjs/operators';
import { editAuth } from './edit';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<any>;
  users: Observable<any[]>;
  user$: Observable<firebase.User | null>;
  constructor(private afAuth: AngularFireAuth,private firestore: AngularFirestore, private edit : editAuth) {
    this.user$ = this.afAuth.authState;
    this.usersCollection = this.firestore.collection<any>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  getUserInfo(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }
  getCurrentUserID(): string | null {
    const user = this.afAuth.auth.currentUser;
    return user ? user.uid : null;
  }
  getUserAddress(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }
 
  getCurrentUsername(): string | null {
    const user = this.afAuth.auth.currentUser;
    return user ? user.displayName : null;
  }
  getAllUsers(): Observable<any[]> {
    return this.users; // Already fetching users collection in the constructor
  }

  signInWithEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password) .then((credential) => {
      // Log the user ID when successfully signed in
      console.log('User ID:', credential.user.uid);
      return credential.user;
    });
  }
  signUpWithEmail(username: string, email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        return credential.user.updateProfile({
          displayName: username
        })
        .then(() => {
          const userId = credential.user.uid;
          const userEmail = credential.user.email;
  
          const userData = {
            username: username,
            email: userEmail,
          
          };
  
          return this.usersCollection.doc(userId).set(userData)
            .then(() => {
              return this.firestore.collection('userProfiles').doc(userId).set({
              
              });
            });
        });
      })
      .catch(error => {
        
        console.error('Error in signUpWithEmail:', error);
        throw error;
      });
  }
  
  
  // Sign out
  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  // Get the currently authenticated user
  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }
  updateUserFavorites(userId: string, bookId: string): Promise<void> {
    const userDocRef = this.firestore.collection('users').doc(userId);
    return userDocRef.update({
      favorites: firebase.firestore.FieldValue.arrayUnion(bookId)
    });
  }
  removeFromUserFavorites(userId: string, bookId: string): Promise<void> {
    const userDocRef = this.firestore.collection('users').doc(userId);
    return userDocRef.update({
      favorites: firebase.firestore.FieldValue.arrayRemove(bookId)
    });
  }
  getUserFavorites(userId: string): Observable<string[]> {
    return this.firestore.collection('users').doc(userId).valueChanges().pipe(
      map((userData: any) => {
        if (userData && userData.favorites) {
          // Assuming favorites is an array of book IDs in user data
          return userData.favorites; // Return user's favorites
        } else {
          return []; // Return an empty array if favorites field is not present or empty
        }
      })
    );
  }
 
}
  


