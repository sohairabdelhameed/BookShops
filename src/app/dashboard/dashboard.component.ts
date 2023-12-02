import { Component } from '@angular/core';
import { BookService } from '../../firebaseServices/bookServices';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {}

