import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import { appRoutes } from './route';
import { AppComponent } from './app.component';
import { NavbarComponent } from './nav/navbar.component';
import { SectionComponent } from './HomePage/section1';
import { SectionTwoComponent } from './HomePage/section2';
import { FooterComponent } from './footer/footer.component';
import { SigninComponent } from './user/signin/signin.component';
import { Error404Component } from './error404/error404.component';
import{HomePageComponent}from './HomePage/HomePage.component';
import { SignupComponent } from './user/sign-up/sign-up.component';
import {AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ProfileComponent } from './user/profile/profile.component';




@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    AngularFireAuthModule,


   ],
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    SigninComponent,
    SectionComponent,
    SectionTwoComponent,
    FooterComponent,
    Error404Component,
    SignupComponent,
    ProfileComponent,
    
   
 
  
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
