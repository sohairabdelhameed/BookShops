import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserBookService {
  private userBookCollection: AngularFirestoreCollection<any>;
  userBooks: Observable<any[]>;
  constructor(private firestore: AngularFirestore) { 
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
  
 
  getBookById(bookId: string): Observable<any> {
    return this.firestore.doc(`userbook/${bookId}`).valueChanges();
  }
  deleteProduct(userBookId: string) {
    // Use the AngularFirestore service to delete the product document
    return this.firestore.collection('userbook').doc(userBookId).delete();
  }
}
