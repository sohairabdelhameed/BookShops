import { Routes } from '@angular/router';
import { SigninComponent } from './user/signin/signin.component';
import { Error404Component } from './error404/error404.component';
import { HomePageComponent } from './HomePage/HomePage.component';
import { SignupComponent } from './user/sign-up/sign-up.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ProductComponent } from './product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CartComponent } from './cart/cart.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';

export const appRoutes: Routes = [
  { path: 'HomePage', component: HomePageComponent },
  { path: '', redirectTo: '/HomePage', pathMatch: 'full' },
  { path: 'signIn', component: SigninComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  {path:'books',component:ProductComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'userDash',component:UserDashboardComponent},
  {path:'cart',component:CartComponent},
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'error', component: Error404Component },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
