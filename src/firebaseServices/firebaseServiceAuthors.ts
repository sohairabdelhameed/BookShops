import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreAuthorService {
  private AuthorsCollection: AngularFirestoreCollection<any>;
  authors: Observable<any[]>;

  constructor(private afs: AngularFirestore) {
    this.AuthorsCollection = this.afs.collection<any>('authors');
    this.authors = this.AuthorsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAuthors(): Observable<any[]> {
    return this.authors;
  }

  getRandomAuthor(): Observable<any[]> {
    return this.authors.pipe(
      map(authorsArray => {
        const randomIndex = Math.floor(Math.random() * authorsArray.length);
        return [authorsArray[randomIndex]]; 
      })
    );
  }
}
