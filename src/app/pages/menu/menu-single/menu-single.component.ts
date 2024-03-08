import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppSettings, Settings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { MenuItem } from 'src/app/app.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-single',
  templateUrl: './menu-single.component.html',
  styleUrls: ['./menu-single.component.scss']
})
export class MenuSingleComponent implements OnInit {
  private sub: any;
  public menuItem!: MenuItem; 
  public settings: Settings; 
  public quantityCount:number = 1;
  public relatedMenuItems:Array<MenuItem> = [];

  constructor(public appSettings:AppSettings, 
              public appService:AppService, 
              private activatedRoute: ActivatedRoute,  
              public fb: UntypedFormBuilder,
              public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      const menuItemId = params['id'];
      this.appService.getMenuItemById(menuItemId).subscribe(data => {
        this.menuItem = data;
      });
    });
  }


  
  getFullImageUrl(imageSrc: string): string {
    const fullUrl = environment.backendUrl + "" + imageSrc;
    return fullUrl;
} 

  

  

  public counterChange(count:number){ 
    this.quantityCount = count;   
  } 

 

 

  public getRelatedMenuItems(){ 
    this.appService.getMenuItemsA().subscribe(data=>{
      this.relatedMenuItems = this.appService.shuffleArray(data).slice(0, 8); 
    });
  }  

}
