import { Component } from '@angular/core';
import { BookService } from '../../../firebaseServices/bookServices';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent{
  bookData: any = {
    title: '',
    author: '',
    photoUrl: '' 
    // Add other book details as needed
  };
  loadingImage: boolean = false;
  constructor(private bookService: BookService, private storage: AngularFireStorage) { }
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
          this.bookData.photoUrl = url; // Set 'photoUrl' in bookData
          this.loadingImage = false; 
        });
      })
    ).subscribe();
  }
  
  onSubmit() {
    this.bookService.addBook(this.bookData)
    .then((docRef) => {
      console.log('Book added successfully with ID:', docRef.id); // Log the ID
      this.bookData = {
        title: '',
        author: '',
        photoUrl: '' // Change to 'photoUrl' to be consistent
      };
    })
    .catch(error => {
      console.error('Error adding book: ', error);
    });
  }
}
