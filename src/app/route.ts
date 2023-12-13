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
import { AddBookComponent } from './dashboard/add-book/add-book.component';
import { ManageUsersComponent } from './dashboard/manage-users/manage-users.component';
import { UsersProductComponent } from './users-product/users-product.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { AddressComponent } from './address/address.component';
import { OrderComponent } from './order/order.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { UserProductDetailsComponent } from './user-product-details/user-product-details.component';
import { SectionTwoComponent } from './HomePage/section2';
import { ManageUserOrdersComponent } from './dashboard/manage-user-orders/manage-user-orders.component';


export const appRoutes: Routes = [
  { path: 'HomePage', component: HomePageComponent },
  { path: '', redirectTo: '/HomePage', pathMatch: 'full' },
  {path:'feature',component:SectionTwoComponent},
  { path: 'signIn', component: SigninComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  {path:'books',component:ProductComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'userDash',component:UserDashboardComponent},
  {path:'cart',component:CartComponent},
  {path:'userOrders',component:ManageUserOrdersComponent},
  {path: 'books/:id',
  component: BookDetailsComponent},
  {path:'addBook',component:AddBookComponent},
  { path: 'usersBook', component:UsersProductComponent},
  { path: 'usersBook/:id', component:UserProductDetailsComponent},
  {path:'manageBooks', component:ManageUsersComponent },
  {path:'fav',component:FavoriteComponent},
  {path:'address',component:AddressComponent},
  {path:'order',component:OrderComponent},
  {path:'track',component:OrderTrackingComponent},
  { path: 'error', component: Error404Component },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];
