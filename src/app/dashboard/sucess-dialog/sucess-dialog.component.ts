import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sucess-dialog',
  templateUrl: './sucess-dialog.component.html',
  styleUrls: ['./sucess-dialog.component.css']
})
export class SucessDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SucessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
