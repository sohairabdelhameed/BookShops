import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { AuthService } from 'src/app/user/AuthenticationService/AuthService';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserBookService {
  private userBookCollection: AngularFirestoreCollection<any>;
  userBooks: Observable<any[]>;
  users:Observable<any[]>
  constructor(private firestore: AngularFirestore,private auth: AuthService) { 
    this.userBookCollection = this.firestore.collection<any>('userbook');
    this.userBooks = this.userBookCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Method to add a book to Firestore
  addBook(bookData: any) {
    return this.firestore.collection('userbook').add(bookData);
  }

  // Method to get all books from Firestore
  getAllBooks(): Observable<any[]> {
    return this.userBooks;
  }
 

  getUserById(userId: string): Observable<any> {
    return this.firestore.doc(`users/${userId}`).valueChanges();
  }

  fetchUserDetailsFromUserId(bookId: string) {
    this.getBookById(bookId).subscribe((book: any) => {
      if (book) {
        const userId = book.userId;
        this.getUserById(userId).subscribe((user: any) => {
          if (user) {
            // User details retrieved
            console.log('User Details:', user);
           
          } else {
            console.log('User details not found');
          }
        });
      } else {
        console.log('Book details not found');
      }
    });
  }
 
  getBookById(bookId: string): Observable<any> {
    return this.firestore.doc(`userbook/${bookId}`).valueChanges();
  }
  deleteProduct(userBookId: string) {
    // AngularFirestore service to delete the product document
    return this.firestore.collection('userbook').doc(userBookId).delete();
  }
}
