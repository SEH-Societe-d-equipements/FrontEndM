import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MenuItem } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public total:any[] = []; 
  public cartItemCount:any[] = [];
  public cartItemCountTotal:number = 0; 
  public currentTotalCartCount:number = 0;
  
  constructor(public appService:AppService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {  
  } 

 



  


 

}
