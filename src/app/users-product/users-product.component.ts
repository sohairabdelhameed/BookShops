import { Component, OnInit } from '@angular/core';
import {FirestoreCartService} from '../../firebaseServices/firbaseCart.service'
import { UserBookService } from '../../firebaseServices/userBook.Service';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-users-product',
  templateUrl: './users-product.component.html',
  styleUrls: ['./users-product.component.css']
})
export class UsersProductComponent implements OnInit {
  books: Observable<any[]>;

  constructor(private userBookService: UserBookService,private storage: AngularFireStorage) { }

  ngOnInit() {
    this.books = this.userBookService.getAllBooks();
  }
  getBookPhotoUrl(bookId: string): Observable<string | null> {
    const storageRef = this.storage.ref(`userbook/${bookId}/photo.jpg`);
    return storageRef.getDownloadURL();
  }
  loadBooks() {
    // Retrieve books from Firestore
    this.books = this.userBookService.getAllBooks();

    // Iterate through the books to get the photo URLs from Firebase Storage
    this.books.subscribe((books) => {
      books.forEach((book) => {
        this.getBookPhotoUrl(book.id).subscribe((photoUrl) => {
          book.photoUrl = photoUrl; // Update the book object with the photo URL
        });
      });
    });
  }
  
  
}
  


