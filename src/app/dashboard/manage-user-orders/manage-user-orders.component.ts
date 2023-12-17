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
    this.loadUsersAndOrders();
    
  }
loadUsersAndOrders(){
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
// updateOrderDate(userId: string, orderId: string, newDate: string): void {
//   this.db.object(`/users/${userId}/orders/${orderId}/date`).set(newDate)
//     .then(() => {
//       this.loadUsersAndOrders(); // Refresh the order list after updating the date
//     })
//     .catch((error) => {
//       console.error('Error updating order date:', error);
//     });
// }

// updateOrderStatus(userId: string, orderId: string, newStatus: string): void {
//   this.db.object(`/users/${userId}/orders/${orderId}/status`).set(newStatus)
//     .then(() => {
//       this.loadUsersAndOrders(); // Refresh the order list after updating the status
//     })
//     .catch((error) => {
//       console.error('Error updating order status:', error);
//     });
// }
// In your component.ts file
getStatusClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'status-indicator pending';
    case 'delivered':
      return 'status-indicator delivered';
    case 'cancelled':
      return 'status-indicator cancelled';
    default:
      return 'status-indicator';
  }
}

}
