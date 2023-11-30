import { Component, OnInit } from '@angular/core';
import { FirestoreAuthorService } from 'src/firebaseServices/firebaseServiceAuthors';
import { Observable } from 'rxjs';

@Component({
  selector: 'HomePage',
  templateUrl: './Homepage.html',
  styleUrls: ['./HomePage.css']
})
export class HomePageComponent implements OnInit {
  author$: Observable<any[]>;

  constructor(private firestoreAuthorService: FirestoreAuthorService) {}

  ngOnInit(): void {
    this.author$ = this.firestoreAuthorService.getRandomAuthor();
  }
}
