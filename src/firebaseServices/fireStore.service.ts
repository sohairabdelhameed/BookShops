import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private booksCollection: AngularFirestoreCollection<any>;
  books: Observable<any[]>;
  private cartItems: any[] = [];
  constructor(private afs: AngularFirestore) {
    this.booksCollection = this.afs.collection<any>('books');
    this.books = this.booksCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    // Call a function to log book IDs
   //this.logBookIds();
  }
  getBooks(): Observable<any[]> {
    return this.books;
  }
  logBookIds() {
    this.getBooks().subscribe((books: any[]) => {
      books.forEach((book: any) => {
        console.log('Book ID:', book.id); // Accessing Firebase document ID
      });
    });
  }
  getBookById(bookId: string): Observable<any> {
    return this.afs.collection('books').doc(bookId).valueChanges();
  }
  getRandomBooks(limit: number): Observable<any[]> {
    return this.books.pipe(
      map(booksArray => {
        const randomBooks = [];
        for (let i = 0; i < limit; i++) {
          const randomIndex = Math.floor(Math.random() * booksArray.length);
          randomBooks.push(booksArray[randomIndex]);
        }
        return randomBooks;
      })
    );
  }
   // Add book to cart
   addToCart(book: any) {
    this.cartItems.push(book);
    console.log('Book added to cart:', book); 
    // Log to check if book is added to cart
  }
  // Remove book from cart
  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  // Get cart items
  getCartItems(): any[] {
    return this.cartItems;
  }

  // Calculate total price of items in cart
  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, book) => total + book.price, 0);
  }
 
}
