import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';  
import { MenuItem } from 'src/app/app.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {  
  public slides = []; 
  public specialMenuItems:Array<MenuItem> = [];
  public bestMenuItems:Array<MenuItem> = [];
  public todayMenu!:MenuItem;
  public menuItems: MenuItem[] = [];

  public settings: Settings;
  constructor(public appSettings:AppSettings, public appService:AppService ) {
    this.settings = this.appSettings.settings;  
  }

  ngOnInit(): void {
    this.getSpecialMenuItems();
    this.getTodayMenu();
  }

 
  public getSpecialMenuItems(){
    this.appService.getSpecialArticles().subscribe(menuItems=>{
      this.specialMenuItems = menuItems;
    });
  } 


  public getTodayMenu(){
   
  }  

}
