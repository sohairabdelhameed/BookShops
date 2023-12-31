import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private firestore: AngularFirestore) { }

  // Method to add a book to Firestore
  addBook(bookData: any) {
    return this.firestore.collection('books').add(bookData);
  }

  // Method to get all books from Firestore
  getAllBooks() {
    return this.firestore.collection('books').valueChanges();
  }
 
  getBookById(bookId: string): Observable<any> {
    return this.firestore.doc(`books/${bookId}`).valueChanges();
  }

  matchBook(userId: string): Observable<any[]> {
    return this.firestore.collection('users').doc(userId).collection('books').valueChanges();
  }
 
  
}

