import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

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
}
