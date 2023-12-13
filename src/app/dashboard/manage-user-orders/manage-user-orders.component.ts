import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/user/AuthenticationService/AuthService';

@Component({
  selector: 'app-manage-user-orders',
  templateUrl: './manage-user-orders.component.html',
  styleUrls: ['./manage-user-orders.component.css']
})
export class ManageUserOrdersComponent implements OnInit {
  usersWithOrders: any[] = [];
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(
      (users: any[]) => {
        // For each user, fetch their orders
        users.forEach(user => {
          this.authService.getUserOrders(user.id).subscribe(
            (orders: any[]) => {
              const userWithOrders = {
                user: user,
                orders: orders
              };
              this.usersWithOrders.push(userWithOrders);
            },
            (error) => {
              console.error('Error fetching orders for user:', user.id, error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

}
