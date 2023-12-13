import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthenticationService/AuthService';
import { editAuth } from "../AuthenticationService/edit";
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  newName: string = '';
  newEmail: string = '';
  newGender:string='';
  newAge:string='';
 
  isEditing: boolean = false;
  userId: string = ''; // Store the user ID
  selectedGender: string = '';
  userData: any = {
    photoUrl:''
  };
  loadingImage: boolean = false;
  newphotoUrl: any;
  constructor(private storage: AngularFireStorage , private router: Router, private authService: AuthService, private edit: editAuth) {}

  ngOnInit() {
    this.getUserInfo();
    this.getUserInfos();
  }
  getUserInfos() {
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          this.userId = user.uid || '';
          this.getUserDataFromFirestore(this.userId);
        } else {
          // Handle if user is not logged in
        }
      },
      error => {
        console.error('Error retrieving user info:', error);
        // Handle error
      }
    );
  }

  getUserDataFromFirestore(userId: string) {
    this.authService.getUserInfo(userId).subscribe(
      userData => {
        this.userData = userData;
      },
      error => {
        console.error('Error retrieving user data from Firestore:', error);
        // Handle error
      }
    );
  }
  getUserInfo() {
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          this.username = this.username || user.email || 'User';
          this.email = user.email || '';
          this.userId = user.uid || ''; 
          
          
        } else {
          
        }
      },
      error => {
        console.error('Error retrieving user info:', error);
        // Handle error
      }
    );
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.newName = this.username;
      this.newEmail = this.email;
    }
  }
  onImageLoad() {
    this.loadingImage = false; // Hide the loader when the image is loaded
  }
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const filePath = `books/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.loadingImage = true; // Show loader

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(
          url => {
            this.userData.photoUrl = url; 
            this.newphotoUrl = url; 
            this.loadingImage = false; // Hide loader
          },
          error => {
            console.error('Error getting download URL:', error);
            this.loadingImage = false; // Hide loader in case of error
   
          }
        );
      })
    ).subscribe(
      // Handle additional errors if needed
    );
  }
}
  onGenderChange() {}
 
  
  saveChanges() {
    const updatedUserData: any = {};
  
    if (this.newName !== this.username) {
      updatedUserData.username = this.newName;
    }
    
  
    if (this.newEmail !== this.email) {
      updatedUserData.email = this.newEmail;
    }
  
    if (this.selectedGender !== '') {
      updatedUserData.gender = this.selectedGender;
    }
  
    if (this.newAge !== '') {
      updatedUserData.age = this.newAge;
    }
  
    if (this.newphotoUrl !== undefined) {
      updatedUserData.photoUrl = this.newphotoUrl;
    }
  
    if (Object.keys(updatedUserData).length === 0) {
      console.log('No changes to save');
      return; // No changes to save
    }
  
    if (this.userId) {
      this.edit.updateUser(this.userId, updatedUserData)
        .then(() => {
          console.log('User data updated successfully');
          // Update the displayed name after successful update
          this.toggleEdit(); // Close editing mode if needed
          this.userData.username = updatedUserData.username || this.userData.username;
 
        })
        .catch((error) => {
          console.error('Error updating user data:', error);
        });
    }
    
  }
  

  
  
  logout() {
    this.authService
      .signOut()
      .then(() => {
        this.router.navigate(['/HomePage']);
      })
      .catch(error => {
        console.error('Error logging out:', error);
        // Handle logout error
      });
  }
}
