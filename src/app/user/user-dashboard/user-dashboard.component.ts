import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { UserBookService } from 'src/firebaseServices/userBook.Service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../AuthenticationService/AuthService';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  bookData: any = {
    title: '',
    author: '',
    choice: '', // Add choice property
    price: null, // Initialize price property
    photoUrl:''
  };
  loadingImage: boolean = false;
  username: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserBookService,
    private storage: AngularFireStorage
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
            price: null, // Clear the price after submission
            photoUrl: '',
            userId: ''
          };
        })
        .catch(error => {
          console.error('Error adding book: ', error);
        });
    } else {
      console.error('User not logged in or username not available.');
    }
  }
}
