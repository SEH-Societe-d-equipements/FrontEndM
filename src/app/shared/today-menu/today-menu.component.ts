import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MenuItem } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { AppSettings, Settings } from 'src/app/app.settings';

@Component({
  selector: 'app-today-menu',
  templateUrl: './today-menu.component.html',
  styleUrls: ['./today-menu.component.scss']
})
export class TodayMenuComponent implements OnInit {
  @Input() menuItem!: MenuItem; 
  public quantityCount:number = 1;
  public settings: Settings;
  constructor(public appService:AppService, public snackBar: MatSnackBar, public appSettings:AppSettings) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit(): void { } 

  public counterChange(count:number){ 
    this.quantityCount = count;   
  } 

  public addToCart(){ 
   
  }


 

}
