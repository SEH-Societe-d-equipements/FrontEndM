import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/app.models';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit {
  public deliveryAddress = {
    'firstName': 'Emilio',
    'lastName': 'Verdines',
    'middleName': '', 
    'company': '',
    'email': 'emilio.verdines@gmail.com',
    'phone': '(+216) 70 725 240', 
    'country': 'US',
    'city': 'New York',
    'place': 'Brooklyn',
    'postalCode': '11213',
    'address': '1568 Atlantic Ave',
    'id': 1
  }

  constructor(public dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public order: Order) { }
 

  ngOnInit(): void {
  }

}
