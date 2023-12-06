import { Component, OnInit } from '@angular/core';
import { AuthService } from '../user/AuthenticationService/AuthService';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dashboard/dialog/dialog.component'; 

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  favoriteBooks$: Observable<any[]>; // Observable to hold favorite books
  user: string | null;
  bookDetails: any[] = []; // Variable to store book details

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserID();

    if (this.user) {
      this.authService.getUserFavorites(this.user).subscribe((favorites: string[]) => {
        console.log("User's favorite book IDs:", favorites);

        if (favorites.length > 0) {
          favorites.forEach(bookId => {
            this.firestoreService.getBookById(bookId).subscribe((bookDetail: any) => {
              this.bookDetails.push({
                id: bookId,
                details: bookDetail
              });
            });
          });
          console.log('Book Details: Testing', this.bookDetails);
        }
      });
    }
  }

  removeFromFavorites(bookId: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this Book?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.user) {
          this.authService.removeFromUserFavorites(this.user, bookId)
            .then(() => {
              console.log('Book removed from favorites.');
              // Remove the book from bookDetails array
              this.bookDetails = this.bookDetails.filter(book => book.id !== bookId);
              this.cdr.detectChanges(); // Trigger change detection
  
              dialogRef.close('Book deleted successfully'); // Close the dialog with a success message
            })
            .catch((error) => {
              dialogRef.close('Error deleting product: ' + error); // Close the dialog with an error message
            });
        }
      }
    });
  }
}  
