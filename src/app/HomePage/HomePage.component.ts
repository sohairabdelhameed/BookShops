import { Component, OnInit, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FirestoreAuthorService } from 'src/firebaseServices/firebaseServiceAuthors';
import { Observable } from 'rxjs';
import Typed from 'typed.js';

@Component({
  selector: 'HomePage',
  templateUrl: './Homepage.html',
  styleUrls: ['./HomePage.css']
})
export class HomePageComponent implements OnInit {
  author$: Observable<any[]>;
  section2AnimationTriggered = false;
  section3AnimationTriggered = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private firestoreAuthorService: FirestoreAuthorService
  ) {}

  ngOnInit(): void {
    const typed = new Typed('#typed', {
      strings: ['Purchase', 'sell', 'swap'],
      backSpeed: 70,
      typeSpeed: 70,
      loop: true,
      cursorChar: '|'
    });
    this.author$ = this.firestoreAuthorService.getRandomAuthor();
  }

}


    // this.author$ = this.firestoreAuthorService.getRandomAuthor();
  
  
  
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const section2 = this.el.nativeElement.querySelector('#section2');
  //   const section2Position = section2.getBoundingClientRect().top;
  //   const windowHeight = window.innerHeight;

  //   if (section2Position < windowHeight && !this.section2AnimationTriggered) {
  //     // Start animation logic for section 2 here
  //     this.section2AnimationTriggered = true;

  //     this.renderer.addClass(section2, 'animate__animated');
  //     this.renderer.addClass(section2, 'animate__fadeInRight');
    
  //   }

  //   const section3 = this.el.nativeElement.querySelector('#section3');
  //   const section3Position = section3.getBoundingClientRect().top;

  //   if (section3Position < windowHeight && !this.section3AnimationTriggered) {
  //     // Start your animation logic for section 3 here
  //     this.section3AnimationTriggered = true;

  //     this.renderer.addClass(section3, 'animate__animated');
  //     this.renderer.addClass(section3, 'animate__fadeInLeft');
   
  //   }
  // }
  

