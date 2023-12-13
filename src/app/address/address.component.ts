import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../user/AuthenticationService/AuthService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  userId: string | null = null;
  userAddress: any = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };
  countries: string[] = [];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private http: HttpClient,
    private location: Location
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      } else {
        this.userId = null;
      }
    });
  }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserID();
    if (this.userId) {
      this.fetchAddress();
      this.getCountries();
    }
  }

  fetchAddress() {
    if (this.userId) {
      const userDocRef = this.afs.collection('users').doc(this.userId);

      userDocRef.get().subscribe((userData: any) => {
        if (userData.exists) {
          this.userAddress = userData.data().address || {};
        } else {
          console.log('User document does not exist. Creating a new one.');
          // Create a new user document with the address
          userDocRef.set({ address: this.userAddress })
            .then(() => {
              console.log('New user document created with address.');
            })
            .catch((error) => {
              console.error('Error creating user document:', error);
            });
        }
      });
    } else {
      console.error('User not authenticated');
    }
  }

  updateAddress() {
    if (this.userId) {
      const userDocRef = this.afs.collection('users').doc(this.userId);

      userDocRef.get().subscribe((userData: any) => {
        if (userData.exists) {
          // Update the existing user document with the new address
          userDocRef.update({ address: this.userAddress })
            .then(() => {
              console.log('Address updated successfully!');
              this.openSnackBar('Address updated successfully!');
            })
            .catch((error) => {
              console.error('Error updating address:', error);
              this.openSnackBar('Failed to update address.');
            });
        } else {
          console.log('User document does not exist. Cannot update address.');
          this.openSnackBar('User document does not exist.');
        }
      });
    } else {
      console.error('User not authenticated');
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
goesBack(){
  this.location.back();
}

  getCountries(): void {
    this.http.get<any>('https://restcountries.com/v3.1/all').subscribe(data => {
      this.countries = data.map((country: any) => country.name.common)
                          .sort((a: string, b: string) => a.localeCompare(b)); // Sort alphabetically
    });
  }
  
}
