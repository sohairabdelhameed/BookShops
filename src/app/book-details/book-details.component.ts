import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FirestoreCartService } from 'src/firebaseServices/firbaseCart.service';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { UserBookService } from 'src/firebaseServices/userBook.Service';

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
    private user: UserBookService
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
        this.firestoreService.getBookById(bookId).subscribe(book => {
          this.firestoreCartService.addToCart(bookId)
            const message = 'Book Added successfully!';
              this.openSnackBar(message);
           
        });
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
      verticalPosition: 'top'
    })
   
  }
}
