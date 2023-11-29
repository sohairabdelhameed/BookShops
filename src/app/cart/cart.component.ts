import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firebaseServices/fireStore.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.updateCart();
  }

  updateCart() {
    this.cartItems = this.firestoreService.getCartItems();
    this.totalPrice = this.firestoreService.calculateTotalPrice();
  }

  removeFromCart(index: number) {
    this.firestoreService.removeFromCart(index);
    this.updateCart();
  }
}
