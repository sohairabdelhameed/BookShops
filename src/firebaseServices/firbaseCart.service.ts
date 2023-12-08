import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, combineLatest, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/user/AuthenticationService/AuthService';


@Injectable({
  providedIn: 'root'
})
export class FirestoreCartService  {
  private cartCollection: any;
  private userId: string | null;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth , ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log(this.userId)
        this.cartCollection = this.afs.collection(`users/${this.userId}/cart`);
      } else {
        this.userId = null;
        this.cartCollection = null;
      }
    });
    

  }
 
  addToCart(bookId: string) {
    if (this.userId) {
      const isBookIdValid = typeof bookId === 'string' && bookId.trim() !== '';
  
      if (isBookIdValid) {
        const bookRef = this.afs.collection('books').doc(bookId);
        bookRef.get().toPromise()
          .then((bookSnapshot: any) => {
            if (bookSnapshot.exists) {
              const bookData = bookSnapshot.data();
              const availableQuantity = bookData.quantity || 0;
  
              this.cartCollection.doc(bookId).get().toPromise()
                .then((cartSnapshot: any) => {
                  const currentQuantityInCart = cartSnapshot.exists ? cartSnapshot.data().quantity || 0 : 0;
                  const requestedQuantity = currentQuantityInCart + 1;
  
                  if (requestedQuantity <= availableQuantity) {
                    // If the book already exists in the cart, update its quantity
                    if (cartSnapshot.exists) {
                      this.cartCollection.doc(bookId).update({ quantity: requestedQuantity })
                        .then(() => {
                          console.log('Item quantity updated in cart successfully!');
                        })
                        .catch((error: any) => {
                          console.error('Error updating item quantity in cart:', error);
                          // Handle error
                        });
                    } else {
                      // Otherwise, add a new cart item
                      const cartItem = {
                        id: bookId,
                        quantity: 1 // Initial quantity when adding to cart
                      };
                      this.cartCollection.doc(bookId).set(cartItem)
                        .then(() => {
                          console.log('Item added to cart successfully!');
                        })
                        .catch((error: any) => {
                          console.error('Error adding item to cart:', error);
                          // Handle error
                        });
                    }
                  } else {
                    console.error('Requested quantity exceeds available quantity.');
                    // Handle the case where the requested quantity exceeds available quantity
                  }
                })
                .catch((error: any) => {
                  console.error('Error checking cart:', error);
                  // Handle error
                });
            } else {
              console.error('Book not found in the bookstore.');
              // Handle the case where the book is not found in the bookstore
            }
          })
          .catch((error: any) => {
            console.error('Error fetching book details:', error);
            // Handle error
          });
      } else {
        console.error('Invalid book ID.' + bookId);
        // Handle the case where the book ID is invalid
      }
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
    }
  }
  
  
  updateCartItemQuantity(userId: string, itemId: string, newQuantity: number): Promise<void> {
    const cartItemRef = this.afs.collection(`users/${userId}/cart`).doc(itemId);

    return cartItemRef.update({ quantity: newQuantity })
      .then(() => {
        console.log('Item quantity updated in cart successfully!');
      })
      .catch((error: any) => {
        console.error('Error updating item quantity in cart:', error);
        // Handle error
        throw error; // Rethrow the error for handling in the component if needed
      });
  }
  increaseCartItemQuantity(userId: string, bookId: string) {
    if (userId) {
      const cartItemRef = this.afs.collection(`users/${userId}/cart`).doc(bookId);

      return cartItemRef.get().toPromise().then((doc) => {
        if (doc.exists) {
          const currentQuantity = doc.data()?.quantity || 0;
          return cartItemRef.update({ quantity: currentQuantity + 1 });
        } else {
          console.error('Item not found in the cart.');
          // Handle the case where the item is not found in the cart
          return Promise.reject('Item not found in the cart.');
        }
      }).catch((error) => {
        console.error('Error increasing item quantity in cart:', error);
        return Promise.reject(error);
      });
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
      return Promise.reject('User not authenticated');
    }
  }
  removeFromCart(bookId: string) {
    if (this.userId) {
      this.cartCollection.doc(bookId).delete();
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
    }
  }

  getCartItems(): Observable<any[]> {
    if (this.userId) {
      return this.cartCollection.valueChanges();
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
      return new Observable<any[]>(observer => {
        observer.next([]); // Return an empty array if user is not authenticated
        observer.complete();
      });
    }
  }
  checkoutCart(cartItems: any[]): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (this.userId) {
        const orderId = this.afs.createId();
        const orderRef = this.afs.collection(`users/${this.userId}/orders`).doc(orderId); // Save under users/{userId}/orders
  
        // Fetch details for each product in the cartItems array
        const fetchProductDetails = cartItems.map(item => {
          return this.afs.collection('books').doc(item.id).valueChanges().pipe(
            map((productDetails: any) => ({
              id: item.id || '',
              quantity: item.quantity || 0,
              title: productDetails.title || '',
              author:productDetails.author ||'',
              price: productDetails.price || 0,
              photo:productDetails.photoUrl || '',

          
            }))
          );
        });
  
        // Combine all the fetched product details into a single Observable
        combineLatest(fetchProductDetails).subscribe((productDetailsArray: any[]) => {
          const totalPrice = this.calculateTotalPrice(cartItems); // Calculate total price
  
          const orderData = {
            userId: this.userId,
            items: productDetailsArray, // Use the fetched product details
            totalPrice: totalPrice // Add the total price to the order data
          };
  
          orderRef.set(orderData)
            .then(() => {
              resolve(orderId); // Resolve the orderId when the order is successfully created
            })
            .catch(error => {
              console.error('Error creating order:', error);
              reject(null); // Reject with null if there's an error creating the order
            });
        });
      } else {
        console.error('User not authenticated');
        reject(null); // Reject with null if the user is not authenticated
      }
    });
  }
  

 
  calculateTotalPrice(cartItems: any[]): number {
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += (item.bookDetails?.price || 0) * (item.quantity || 0);
    }
    return totalPrice; 
  }
  
  
  getCartItemCount(): Observable<number> {
    if (this.userId) {
      return this.cartCollection.valueChanges().pipe(
        switchMap((items: any[]) => {
          return new Observable<number>(observer => {
            observer.next(items.length); // Return the length of items array
            observer.complete();
          });
        })
      );
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
      return new Observable<number>(observer => {
        observer.next(0); // Return 0 if user is not authenticated
        observer.complete();
      });
    }
  }
  clearCart(): Promise<void> {
    if (this.userId) {
      // Get a reference to the user's cart collection in Firestore
      const cartRef = this.afs.collection(`users/${this.userId}/cart`);

      // Use batched writes to delete all documents in the cart collection
      const batch = this.afs.firestore.batch();
      return cartRef.ref.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Commit the batched write to delete all cart items
        return batch.commit();
      });
    } else {
      console.error('User not authenticated');
      return Promise.reject('User not authenticated');
    }
  }
}
