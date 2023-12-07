import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirestoreCartService } from '../../firebaseServices/firbaseCart.service';
import { AuthService } from '../user/AuthenticationService/AuthService';
import { BookService } from 'src/firebaseServices/bookServices';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId: string | null = null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private firestoreCartService: FirestoreCartService,
    private auth: AuthService,
    private book: BookService
  ) {}

  ngOnInit() {
    this.userId = this.auth.getCurrentUserID(); // Assign the user ID directly

    if (this.userId) {
      this.updateCart(); // Call updateCart once the userId is retrieved
      this.updateCartDetails();
    }
  }

  updateCart() {
    this.firestoreCartService.getCartItems().subscribe(items => {
      console.log('Basic Cart Items:', items); // Log to check the basic items received
      this.cartItems = items;
      this.updateCartDetails(); // Fetch book details once the cart items are updated
    });
  }

  updateCartDetails() {
    const updatedCartItems = []; // Create a new array to store updated cart items
    let processedItemCount = 0; // To track the number of processed items

    this.cartItems.forEach(cartItem => {
      // Fetch book details for each item in the cart using stored IDs
      this.book.getBookById(cartItem.id).subscribe(bookDetails => {
        // Combine book details with cart item and push to updatedCartItems array
        if (bookDetails) {
          const itemWithDetails = {
            ...cartItem,
            bookDetails: bookDetails
          };
          updatedCartItems.push(itemWithDetails);
        }

        processedItemCount++;

        if (processedItemCount === this.cartItems.length) {
          // If all items processed, update cartItems and trigger change detection
          this.cartItems = updatedCartItems;
          this.totalPrice = this.calculateTotalPrice();
          this.changeDetectorRef.detectChanges(); // Trigger change detection
        }
      });
    });
  }

  updateCartItemQuantity(item: any) {
    if (this.userId) {
      this.firestoreCartService.updateCartItemQuantity(this.userId, item.id, item.quantity)
        .then(() => {
          // Update the book details in the cartItems array
          const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
          if (index !== -1) {
            this.book.getBookById(item.id).subscribe(bookDetails => {
              if (bookDetails) {
                this.cartItems[index].bookDetails = bookDetails;
                this.totalPrice = this.calculateTotalPrice();
                this.changeDetectorRef.detectChanges(); // Trigger change detection
              }
            });
          }
        })
        .catch((error: any) => {
          console.error('Error updating item quantity in cart:', error);
          // Handle error
        });
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
    }
  }
  
  decreaseQuantity(item: any) {
    if (item.quantity > 1) { // Ensure quantity doesn't go below 1
      item.quantity--; // Decrease quantity by 1
      this.updateCartItemQuantity(item); // Update the quantity in the cart
    }
  }

  increaseQuantity(item: any) {
    if (this.userId) {
      this.firestoreCartService.increaseCartItemQuantity(this.userId, item.id)
        .then(() => {
          // Update the cart items after increasing the quantity
          this.updateCartDetails(); // Update cart items with details
        })
        .catch((error: any) => {
          console.error('Error increasing item quantity in cart:', error);
          // Handle error
        });
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
    }
  }

  removeFromCart(bookId: string) {
    this.firestoreCartService.removeFromCart(bookId);
    this.updateCart();
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cartItems) {
      totalPrice += item.bookDetails?.price * item.quantity;
    }
    return totalPrice;
  }

  checkout() {
    this.firestoreCartService.checkoutCart(this.cartItems);
  }
}
