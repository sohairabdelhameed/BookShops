import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../user/AuthenticationService/AuthService';
import * as firebase from 'firebase';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  books$: Observable<any[]>;
  userFavorites: string[] = []; // To store user's favorite book IDs
  userId: string | null = null; // To store the current user's ID

  constructor(private firestoreService: FirestoreService, private storage: AngularFireStorage , private auth:AuthService) { }

  ngOnInit(): void {
    this.loadBooks();
    this.fetchUserFavorites();
  }

  getBookPhotoUrl(bookId: string): Observable<string | null> {
    const storageRef = this.storage.ref(`books/${bookId}/photo.jpg`);
    return storageRef.getDownloadURL().pipe(
      catchError((error) => {
        // Handle the error when the file is not found
        console.error('Error fetching photo URL:', error);
        // Return a URL to a placeholder image or null
        return of('path_to_placeholder_image'); 
      })
    );
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
  fetchUserFavorites() {
    this.userId = this.auth.getCurrentUserID();
    if (this.userId) {
      this.auth.getUserFavorites(this.userId).subscribe((favorites: string[]) => {
        this.userFavorites = favorites;
      });
    }
  }
  isBookInFavorites(bookId: string): boolean {
    return this.userFavorites.includes(bookId);
  }
  addToFavorites(bookId: string) {
    const userId = this.auth.getCurrentUserID(); // Get current user ID
    if (userId) {
      this.auth.updateUserFavorites(userId, bookId)
        .then(() => {
          console.log('Book added to favorites successfully!');
        })
        .catch((error) => {
          console.error('Error adding book to favorites:', error);
        });
    } else {
      console.error('User not logged in.');
    }
  }

}
