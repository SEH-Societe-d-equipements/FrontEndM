import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'; 
import { MenuItem } from 'src/app/app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-overview',
  templateUrl: './cart-overview.component.html',
  styleUrls: ['./cart-overview.component.scss']
})
export class CartOverviewComponent implements OnInit {
  public menuItems: MenuItem[] = [];
  public settings: Settings;
  constructor(public appService:AppService, 
              public appSettings:AppSettings,
              private bottomSheetRef: MatBottomSheetRef<CartOverviewComponent>,
              public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
  }

  public hideSheet(isRedirect:boolean){
    this.bottomSheetRef.dismiss(isRedirect);
  }

 
  
 
 

}
