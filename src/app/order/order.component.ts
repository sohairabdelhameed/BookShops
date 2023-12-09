import { Component, OnInit } from '@angular/core';
import { AuthService } from '../user/AuthenticationService/AuthService';
import { AngularFirestore } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  userAddress: any;
  userId: string | null;
  userOrders: any[] = [];
  showPaymentOptions: boolean = true;
  userOrdersWithProducts: any[] = [];
  showCreditCardForm: boolean = false;


  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.userAddress = {};
    this.userId = this.authService.getCurrentUserID();
  }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserID();
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
    }
  }

  fetchUserOrders() {
    if (this.userId) {
      const ordersCollectionRef = this.afs.collection(`users/${this.userId}/orders`);

      ordersCollectionRef.snapshotChanges().subscribe((ordersSnapshot: any[]) => {
        this.userOrders = [];

        ordersSnapshot.forEach((orderDoc: any) => {
          const orderId = orderDoc.payload.doc.id;
          const orderData = orderDoc.payload.doc.data();

          if (orderData && orderData.items && orderData.paid !== true) {
            orderData.items.forEach((item: any) => {
              if (item && item.id && item.title && item.author && item.photo) {
                this.userOrders.push({
                  id: orderId || '',
                  userId: orderData.userId || '',
                  paid: orderData.paid || false,
                  paymentMethod: orderData.paymentMethod || '',
                  quantity: item.quantity || 0,
                  productId: item.id,
                  title: item.title,
                  totalPrice: orderData.totalPrice || 0,
                  author: item.author,
                  photo: item.photo,
                  price: item.price || 0,
                  status: orderData.status || 'Pending',
            
                });
              }
            });
          }
        });
      });
    }
  }

  updateOrderPayment(orderId: string, paymentMethod: string) {
    if (this.userId) {
      const orderDocRef = this.afs.collection(`users/${this.userId}/orders`).doc(orderId);

      orderDocRef.update({
        paid: true,
        paymentMethod: paymentMethod
      })
      .then(() => {
        const message = 'Payment successfully!';
        this.openSnackBar(message);
      })
      .catch((error) => {
        console.error('Error updating payment:', error);
        const errorMessage = 'Failed to update payment.';
        this.openSnackBar(errorMessage);
      });
    } else {
      console.error('User not authenticated');
    }
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
    this.showPaymentOptions = false;
  }

  allOrdersPaid(): boolean {
    return this.userOrders.every(order => order.paid);
  }

  payOnDelivery() {
    const selectedPaymentMethod = 'On delivery';
    this.updateOrdersPayment(selectedPaymentMethod);
  }
opencreditcard(){
  this.showCreditCardForm = true;
}
  payWithCreditCard() {
    const selectedPaymentMethod = 'Credit Card';
    this.updateOrdersPayment(selectedPaymentMethod);
    this.showCreditCardForm = false;
    this.openSnackBar('Payment successful!');
  
  }

  updateOrdersPayment(paymentMethod: string) {
    this.userOrders.forEach(order => {
      if (!order.paid) {
        this.updateOrderPayment(order.id, paymentMethod);
      }
    });
    this.removePaidOrders();
  }


  removePaidOrders() {
    this.userOrders = this.userOrders.filter(order => !order.paid);
  }
}
