import { Component, OnInit } from '@angular/core';
import {FirestoreCartService} from '../../../firebaseServices/firbaseCart.service'
import { UserBookService } from '../../../firebaseServices/userBook.Service';
import { Observable, of } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  
    books: Observable<any[]>;
  
    constructor(private dialog: MatDialog , private userBookService: UserBookService,private storage: AngularFireStorage) { }
  
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
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: { message: 'Are you sure you want to delete this Book?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userBookService.deleteProduct(bookId)
            .then(() => {
              dialogRef.close('Book deleted successfully'); // Close the dialog with a success message
            })
            .catch((error) => {
              dialogRef.close('Error deleting product: ' + error); // Close the dialog with an error message
            });
        }
      });
    }
}
