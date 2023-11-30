import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'section-one',
  templateUrl: './section1.html',
})
export class SectionComponent implements OnInit {
  books$: Observable<any[]>;
 

  constructor(private firestoreService: FirestoreService,private storage: AngularFireStorage) { }
  ngOnInit(): void {
    const numberOfRandomBooksToShow = 6; // Set the number of random books to display
    this.books$ = this.firestoreService.getRandomBooks(numberOfRandomBooksToShow);
  }

}