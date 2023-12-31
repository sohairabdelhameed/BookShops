import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { UserBookService } from 'src/firebaseServices/userBook.Service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../AuthenticationService/AuthService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  bookData: any = {
    title: '',
    author: '',
    choice: '',
    price: null, 
    photoUrl:''
  };
  loadingImage: boolean = false;
  //imageUploaded: boolean = false;
  //imageTouched: boolean = false;

  username: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserBookService,
    private storage: AngularFireStorage,
    private snackBar : MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getCurrentUser();
  }
  onOptionChange() {
    if (this.bookData.choice === 'swap') {
      // If the user selects "Swap", clear the price value and hide the price field
      this.bookData.price = null;
    }
  }
  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.username = user.displayName || user.email || 'User';
      } else {
        this.username = '';
      }
    });
  }
  onImageLoad() {
    this.loadingImage = false; // Hide the loader when the image is loaded
  }
  onFileSelected(event: any) {
 
    const file = event.target.files[0];
    const filePath = `books/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
   
    this.loadingImage = true; //image loader
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.bookData.photoUrl = url;
          this.loadingImage = false; 
        });
      })
    ).subscribe();
  }
 
  onSubmit() {
    const userID = this.authService.getCurrentUserID();
    const username = this.authService.getCurrentUsername();
  
    if (userID && username) {
      this.authService.getUserAddress(userID).subscribe(addressData => {
        if (addressData && addressData.address) {
          if (this.bookData.photoUrl) { // Check if an image is uploaded
            this.bookData.userId = userID;
            this.bookData.username = username;
            this.bookData.choice = this.bookData.choice === 'swap' ? 'swap' : 'sell';
            this.userService.addBook(this.bookData)
              .then((docRef) => {
                console.log('Book added successfully with ID:', docRef.id);
                this.bookData = {
                  title: '',
                  author: '',
                  choice: '',
                  price: null,
                  title_of_exchange_book: '',
                  author_of_exchange_book: '',
                  photoUrl: '',
                  userId: ''
                };
              })
              .catch(error => {
                console.error('Error adding book: ', error);
                const errorMessage = 'An error occurred while adding the book.';
                this.openSnackBar(errorMessage);
              });
          } else {
            const message = 'Please Upload the image of the Book';
            this.openSnackBar(message);
            console.error('Please upload an image before submitting the form.');
          }
        } else {
          const message = 'Please add your address before adding a book.';
          this.openSnackBar(message);
          this.router.navigate(['/address']); // Redirect to add address page
        }
      }, error => {
        console.error('Error fetching user address: ', error);
        const errorMessage = 'An error occurred while fetching user address.';
        this.openSnackBar(errorMessage);
      });
    } else {
      console.error('User not logged in or username not available.');
      const errorMessage = 'Please log in to add a book.';
      this.openSnackBar(errorMessage);
      this.router.navigate(['/signIn']); // Redirect to login page
    }
  }
  
  
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    })
   
  }
}  
  

