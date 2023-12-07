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
import{AngularFirestoreModule} from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ProfileComponent } from './user/profile/profile.component';
import { ProductComponent } from './product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartComponent } from './cart/cart.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { SidenavComponent } from './dashboard/sidenav/sidenav.component';
import { AddBookComponent } from './dashboard/add-book/add-book.component';
import { ManageUsersComponent } from './dashboard/manage-users/manage-users.component';
import { UsersProductComponent } from './users-product/users-product.component';
import { DialogComponent } from './dashboard/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SucessDialogComponent } from './dashboard/sucess-dialog/sucess-dialog.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { AddressComponent } from './address/address.component';
import { OrderComponent } from './order/order.component';






@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatDialogModule


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
    ProductComponent,
    DashboardComponent,
    CartComponent,
    BookDetailsComponent,
    UserDashboardComponent,
    SidenavComponent,
    AddBookComponent,
    ManageUsersComponent,
    UsersProductComponent,
    DialogComponent,
    SucessDialogComponent,
    FavoriteComponent,
    AddressComponent,
    OrderComponent,


    
   
 
  
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
