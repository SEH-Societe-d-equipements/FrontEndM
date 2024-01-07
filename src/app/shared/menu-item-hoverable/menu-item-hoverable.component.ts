import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { CartOverviewComponent } from '../cart-overview/cart-overview.component';

@Component({
  selector: 'app-menu-item-hoverable',
  templateUrl: './menu-item-hoverable.component.html',
  styleUrls: ['./menu-item-hoverable.component.scss']
})
export class MenuItemHoverableComponent implements OnInit {
  @Input() menuItem!: MenuItem;
  @Input() onlyImage: boolean = false;
  constructor(public appService:AppService) { }

  ngOnInit(): void {
  }


  

}
