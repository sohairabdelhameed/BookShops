import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FirestoreCartService } from 'src/firebaseServices/firbaseCart.service';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { UserBookService } from 'src/firebaseServices/userBook.Service';

@Component({
  selector: 'app-user-product-details',
  templateUrl: './user-product-details.component.html',
  styleUrls: ['./user-product-details.component.css']
})
export class UserProductDetailsComponent implements OnInit {
  book: any;
  userDetails: any;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private firestoreCartService: FirestoreCartService,
    private snackBar: MatSnackBar,
    private user: UserBookService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id');
      if (bookId) {
        this.getBookAndUserDetails(bookId);
      }
    });
  }

  getBookAndUserDetails(bookId: string): void {
    this.user.getBookById(bookId).subscribe((book: any) => {
      if (book) {
        this.book = book;

        const userId = book.userId;

        this.user.getUserById(userId).subscribe((user: any) => {
          if (user) {
            this.userDetails = user;
          } else {
            console.log('User details not found');
          }
        });
      } else {
        console.log('Book details not found');
      }
    });
  }

getAddressArray(addresses: any): any[] {
  if (Array.isArray(addresses)) {
    return addresses;
  } else if (addresses && typeof addresses === 'object') {
    // Convert object to array (if it's an object)
    return Object.values(addresses);
  } else {
    return [];
  }
}


  getFontFamily(title: string | undefined): string {
    if (title) {
      const containsArabic = /[\u0600-\u06FF]/.test(title);
      return containsArabic ? 'Lemonada, sans-serif' : 'Lobster Two';
    }
    return 'Pacifico, cursive';
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  copyPhoneNumber(phoneNumber) {
    const tempInput = document.createElement('input');
    tempInput.value = phoneNumber;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Phone number copied: ' + phoneNumber);
  }
 
  
}
 
