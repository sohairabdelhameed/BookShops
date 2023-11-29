import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreCartService {
  private cartCollection: any;
  private userId: string | null;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.cartCollection = this.afs.collection(`users/${this.userId}/cart`);
      } else {
        this.userId = null;
        this.cartCollection = null;
      }
    });
  }

  addToCart(book: any, quantity: number) {
    if (!book || !book.id || book.id.trim() === '') {
      console.error('Invalid book or book ID');
      return;
    }
  
    if (this.userId) {
      const { id, ...rest } = book;
      this.cartCollection.doc(id).set({ ...rest, quantity });
    } else {
      console.error('User not authenticated');
      // Handle the case where the user is not authenticated
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
}
