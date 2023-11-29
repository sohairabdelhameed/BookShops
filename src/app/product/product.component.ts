import { Component, OnInit } from '@angular/core';
import {FirestoreCartService} from '../../firebaseServices/firbaseCart.service'
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  books$: Observable<any[]>;
 

  constructor(private firestoreService: FirestoreService,private storage: AngularFireStorage) { }
  ngOnInit(): void {
    this.books$ = this.firestoreService.getBooks();
  }
  getBookPhotoUrl(bookId: string): Observable<string | null> {
    const storageRef = this.storage.ref(`books/${bookId}/photo.jpg`);
    return storageRef.getDownloadURL();
  }
  loadBooks() {
    // Retrieve books from Firestore
    this.books$ = this.firestoreService.getBooks();

    // Iterate through the books to get the photo URLs from Firebase Storage
    this.books$.subscribe((books) => {
      books.forEach((book) => {
        this.getBookPhotoUrl(book.id).subscribe((photoUrl) => {
          book.photoUrl = photoUrl; // Update the book object with the photo URL
        });
      });
    });
  }
  addToCart(book: any) {
    this.firestoreService.addToCart(book);
    // Optionally, you can display a message indicating successful addition to the cart
  }
  
  
  
}
