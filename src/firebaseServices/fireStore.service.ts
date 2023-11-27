import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private booksCollection: AngularFirestoreCollection<any>;
  books: Observable<any[]>;

  constructor(private afs: AngularFirestore) {
    this.booksCollection = this.afs.collection<any>('books');
    this.books = this.booksCollection.valueChanges();
  }

  getBooks(): Observable<any[]> {
    return this.books;
  }
}
