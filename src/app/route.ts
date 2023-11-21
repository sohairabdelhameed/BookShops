import { Routes } from '@angular/router';
import { SigninComponent } from './user/signin/signin.component';
import { Error404Component } from './error404/error404.component';
import { HomePageComponent } from './HomePage/HomePage.component';
import { SignupComponent } from './user/sign-up/sign-up.component';
import { ProfileComponent } from './user/profile/profile.component';

export const appRoutes: Routes = [
  { path: 'HomePage', component: HomePageComponent },
  { path: '', redirectTo: '/HomePage', pathMatch: 'full' },
  { path: 'signIn', component: SigninComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'error', component: Error404Component },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
