import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/firebaseServices/fireStore.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';


@Component({
  selector: 'section-one',
  templateUrl: './section1.html',
  styleUrls:['./section1.css']
})
export class SectionComponent implements OnInit {
  books$: Observable<any[]>;
  book$: Observable<any>
 

  constructor(private firestoreService: FirestoreService,private storage: AngularFireStorage , private route: ActivatedRoute) { }
  ngOnInit(): void {
    const numberOfRandomBooksToShow = 6;
    this.books$ = this.firestoreService.getRandomBooks(numberOfRandomBooksToShow);

    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id');
      if (bookId) {
        this.book$ = this.firestoreService.getBookById(bookId); // Assign the Observable from service to book$
      }
    });
  }
}