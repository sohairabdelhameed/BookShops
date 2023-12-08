import { Component, OnInit } from '@angular/core';
import { FirestoreCartService } from 'src/firebaseServices/firbaseCart.service';
import { AuthService } from '../user/AuthenticationService/AuthService';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderDetails: any;
  userAddress: any;
  userId: string | null;
  userOrders: any[] = []; 
  creditCard: any = { cardNumber: '', expiryDate: '', cvv: '' };
  showCreditCardForm: boolean = false;
 showPaymentOptions: boolean = true; 
  constructor(
    private firestoreCartService: FirestoreCartService,
    private authService: AuthService,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.userAddress = {};
    this.userId = null; // Initialize userId
  }

  ngOnInit() {
    // Retrieve the current user's ID
    this.userId = this.authService.getCurrentUserID();

    // Fetch the user's address after getting the user ID
    if (this.userId) {
      this.fetchAddress();
      this.fetchUserOrders();
    }
  }
 

  fetchAddress() {
    if (this.userId) {
      const userDocRef = this.afs.collection('users').doc(this.userId);

      userDocRef.valueChanges().subscribe((userData: any) => {
        if (userData && userData.address) {
          this.userAddress = userData.address;
        } else {
          console.log('Address not found for this user.');
        }
      });
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
    }
  }
fetchUserOrders() {
  if (this.userId) {
    const ordersCollectionRef = this.afs.collection(`users/${this.userId}/orders`);

    ordersCollectionRef.valueChanges().subscribe((ordersData: any[]) => {
      // Map the retrieved data and flatten the nested structure
      this.userOrders = [];

      ordersData.forEach(order => {
        // Filter orders based on status (assuming status is a field in your Firestore document)
        if (order.status !== 'delivered') {
          order.items.forEach(item => {
            this.userOrders.push({
              id: order.id,
              userId: order.userId,
              paid:order.paid,
              paymentMethod:order.paymentMethod,
              quantity: item.quantity,
              productId: item.id,
              title: item.title,
              totalPrice: order.totalPrice,
              author: item.author,
              photo: item.photo,
              price: item.price,
            });
          });
        }
      });
    });
  }
}

  payOnDelivery() {
    const message = `Thank you for choosing Pay on Delivery! 
    `;
    this.showCreditCardForm = false; // Hide the credit card form
    this.openSnackBar(message);
  }
  
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration the snackbar is shown (in milliseconds)
      horizontalPosition: 'center', // Snackbar position - 'start', 'center', 'end'
      verticalPosition: 'bottom' // Snackbar position - 'top', 'bottom'
    })
    this.showPaymentOptions = false;
  }
  // Function to handle Pay with Credit Card option
  payWithCreditCard() {
    this.showCreditCardForm = true;
    this.showPaymentOptions = false;
  }
  handlePaymentSuccess(paymentMethod: string, orderId: string) {
    this.updatePaymentInfo(orderId, paymentMethod); // Update payment info for a specific order
    this.clearCart(); // Clear the cart
  
    // Reset UI elements or fetch user orders if needed
    this.fetchUserOrders();
  
    this.showPaymentOptions = false; // Hide payment options
  }
  
  updatePaymentInfo(orderId: string, paymentMethod: string) {
    if (this.userId) {
      const orderDocRef = this.afs.doc(`users/${this.userId}/orders/${orderId}`);
  
      orderDocRef.update({
        paymentMethod: paymentMethod,
        paid: true
      })
      .then(() => {
        console.log('Payment information updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating payment information:', error);
      });
    }
  }
  
  clearCart() {
    this.firestoreCartService.clearCart()
      .then(() => {
        console.log('Cart cleared successfully.');
      })
      .catch((error) => {
        console.error('Error clearing cart:', error);
      });
  }
  
}
