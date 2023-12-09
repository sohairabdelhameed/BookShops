import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../user/AuthenticationService/AuthService';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit {
  userAddress: any;
  userId: string | null;
  userOrders: any[] = [];
  groupedOrders: any[] = []; // New array to hold grouped orders

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.userAddress = {};
    this.userId = this.authService.getCurrentUserID();
  }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserID();
    if (this.userId) {

      this.fetchUserOrders();
    }
    this.fetchUserOrders();
  }
  
  fetchUserOrders() {
    if (this.userId) {
      const ordersCollectionRef = this.afs.collection(`users/${this.userId}/orders`);

      ordersCollectionRef.snapshotChanges().subscribe((ordersSnapshot: any[]) => {
        this.userOrders = [];

        ordersSnapshot.forEach((orderDoc: any) => {
          const orderId = orderDoc.payload.doc.id;
          const orderData = orderDoc.payload.doc.data();

          if (orderData && orderData.items) {
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
                  date:orderData.date || 'Processing'
                });
              }
            });
          }
        });

        // Group orders by ID
        this.groupOrdersById();
      });
    }
  }

  groupOrdersById() {
    const groupedOrdersMap = new Map();
    
    this.userOrders.forEach((order) => {
      if (!groupedOrdersMap.has(order.id)) {
        groupedOrdersMap.set(order.id, [order]);
      } else {
        groupedOrdersMap.get(order.id).push(order);
      }
    });

    this.groupedOrders = Array.from(groupedOrdersMap.values());
  }
}
