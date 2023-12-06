import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: any;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id'); 
      if (bookId) {
        this.firestoreService.getBookById(bookId).subscribe(book => {
          this.book = book;
        });
      }
    });
  }
  getFontFamily(title: string | undefined): string {
    if (title) {
      // Checking if the title contains Arabic characters
      // You might need a more accurate method to detect Arabic text in the title
      const containsArabic = /[\u0600-\u06FF]/.test(title);
      return containsArabic ? 'Lemonada, sans-serif' : 'Lobster Two';
    }
    return 'Pacifico, cursive'; // Default to Pacifico if title is undefined
  }

  addToCart(book: any) {
    this.firestoreService.addToCart(book);
    // Optionally, you can display a message indicating successful addition to the cart
  }
}
