import { Component, OnInit } from '@angular/core';
import {FirestoreCartService} from '../../../firebaseServices/firbaseCart.service'
import { UserBookService } from '../../../firebaseServices/userBook.Service';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  
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
    deleteProduct(bookId: string) {
      // Call the deleteProduct method from your Firestore service
      this.userBookService.deleteProduct(bookId)
        .then(() => {
          console.log('Product deleted successfully');
          // Perform any additional actions upon successful deletion if needed
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
          // Handle errors if product deletion fails
        });
    }
    

}
