import { Component } from '@angular/core';
import { BookService } from '../../../firebaseServices/bookServices';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SucessDialogComponent } from '../sucess-dialog/sucess-dialog.component';

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
    // Add other book details needed
  };
  loadingImage: boolean = false;
  constructor( private dialog: MatDialog ,private bookService: BookService, private storage: AngularFireStorage) { }
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
    const dialogRef = this.dialog.open(SucessDialogComponent, {
      width: '250px',
      data: { message: 'Book Added Successfully' }
    });

    this.bookService.addBook(this.bookData)
      .then((docRef) => {
        console.log('Book added successfully with ID:', docRef.id); // Log the ID
        this.bookData = {
          title: '',
          author: '',
          photoUrl: ''
        };

        dialogRef.close(); // Close the dialog when book is added successfully
      })
      .catch(error => {
        console.error('Error adding book: ', error);
        dialogRef.close(); // Close the dialog in case of an error
      });
  }
}
