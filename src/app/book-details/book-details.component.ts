import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FirestoreCartService } from 'src/firebaseServices/firbaseCart.service';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { UserBookService } from 'src/firebaseServices/userBook.Service';
import { AuthService } from '../user/AuthenticationService/AuthService';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: any;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private firestoreCartService: FirestoreCartService,
    private snackBar : MatSnackBar,
    private user: UserBookService,
    private auth:AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id'); 
      if (bookId) {
        this.getBookFromFirestore(bookId);
       
      }
    });
    
  }
  getBookFromFirestore(bookId: string): void {
    this.firestoreService.getBookById(bookId).subscribe(book => {
      this.book = book;
    
    });
  }

  addToCart() {
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id');
      if (bookId) {
        if (this.auth.getCurrentUserID()) { 
          this.firestoreService.getBookById(bookId).subscribe(book => {
            this.firestoreCartService.addToCart(bookId);
            const message = 'Book Added successfully!';
            this.openSnackBar(message);
          });
        } else {
          const loginMessage = 'Please log in to add to cart.';
          this.openSnackBar(loginMessage);
        }
      }
    });
  }

  

  getFontFamily(title: string | undefined): string {
    if (title) {
      // Checking if the title contains Arabic characters
      const containsArabic = /[\u0600-\u06FF]/.test(title);
      return containsArabic ? 'Lemonada, sans-serif' : 'Lobster Two';
    }
    return 'Pacifico, cursive'; // Default to Pacifico if title is undefined
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
   
  }
}
