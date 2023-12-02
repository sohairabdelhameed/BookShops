import { Component,OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',

  template: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Any additional head elements can be added here -->
    </head>
    <body>
        <!-- Your body content goes here -->
        <nav-bar></nav-bar>
      
        <router-outlet></router-outlet>
     
    </body>

    </html>
  
  `,
 styleUrls:['./app.component.css']
  
})
export class AppComponent implements OnInit{
  title = 'BookShops';
  constructor() { }

  ngOnInit(): void {
    // Get the body element
    const body = document.body;

    // Listen to the scroll event
    window.addEventListener('scroll', () => {
      // Calculate the total height of the content including the scrolled area
      const totalHeight = document.documentElement.scrollHeight;

      // Calculate how much the user has scrolled from the top
      const scrolled = window.scrollY + window.innerHeight;

      // Update the body height based on the scroll position
      if (scrolled >= totalHeight) {
        // Increase the body height when scrolled to the bottom
        body.style.height = `${scrolled}px`;
      }
    });
  }
}
