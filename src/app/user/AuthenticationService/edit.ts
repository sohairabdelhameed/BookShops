import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class editAuth {

  private usersCollection: AngularFirestoreCollection<any>;
  users: Observable<any[]>;
  constructor(private afAuth: AngularFireAuth,private firestore: AngularFirestore) {
    this.usersCollection = this.firestore.collection<any>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log(id); // Logging the id
          return { id, ...data };
        });
      })
    );
  }
 

  
  
  addUser(userData: any) {
    return this.firestore.collection('users').add(userData)
      .then((docRef) => {
        const id = docRef.id; 
        console.log(id); 
        return id; 
      })
      .catch((error) => {
        console.error('Error adding user:', error);
      });
  }

  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }
  getUserById(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  updateUser(userId: string, updatedUserData: any): Promise<void> {
    const userDocRef = this.firestore.collection('users').doc(userId);
    return userDocRef.update(updatedUserData)
      .catch(error => {
        console.error('Error updating user:', error);
        throw error; // Propagate the error if needed
      });
  }
  
 
}
