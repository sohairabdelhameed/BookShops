import { Component } from '@angular/core';
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
  
  `
  
})
export class AppComponent {
  title = 'BookShops';
}
