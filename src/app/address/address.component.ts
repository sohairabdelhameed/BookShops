// address.component.ts
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  userId: string | null = null;
  fullName: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  phone:number ;
  city: string = '';
  state: string = '';
  zipCode: string = '';
  country: string = '';
  userEmail: string | null = null;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    // Existing code...

    // Subscribe to the authentication state changes
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.userEmail = user.email; // Get user's email
      } else {
        this.userId = null;
        this.userEmail = null;
      }
    });
  }

  updateAddress() {
    if (this.userId) {
      const addressData = {
        fullName: this.fullName,
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2,
        city: this.city,
        state: this.state,
        zipCode: this.zipCode,
        country: this.country,
        phone: this.phone
      };

      const userDocRef = this.afs.collection('users').doc(this.userId);

      userDocRef.get().toPromise()
        .then(doc => {
          if (doc.exists) {
            return userDocRef.update({ address: addressData });
          } else {
            return userDocRef.set({ address: addressData }); // Create the document if it doesn't exist
          }
        })
        .then(() => {
          console.log('Address updated successfully in the users collection');
          // Optionally, navigate to the next step in the checkout process
        })
        .catch(error => {
          console.error('Error updating address:', error);
          // Handle error
        });
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
    }
  }
  
}
