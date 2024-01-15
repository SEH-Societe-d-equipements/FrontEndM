import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AppSettings, Settings } from '../../../app.settings'; 
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class MenuComponent implements OnInit {
  @Input('menuItems') menuItems:Menu[] = [];
  @Input('menuParentId') menuParentId = 0;
  parentMenu:Array<any> = [];
  @Input('userRole') userRole: string = '';
  public settings: Settings;
  constructor(public appSettings:AppSettings, public menuService:MenuService,public appService:AppService) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {     
    this.userRole = this.appService.getUserRole();
    console.log('User Role:', this.userRole);  // Ajoutez cette ligne
    this.menuItems = this.getMenuItemsByRole(this.userRole);
    this.parentMenu = this.menuItems.filter((item) => item.parentId == this.menuParentId);
  }
  
  onClick(menuId:number){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);    
  }
  private getMenuItemsByRole(userRole: string): Menu[] {
    if (userRole === 'admin') {
      // Return menu items for admin role
      return [
        new Menu(10, 'ADMIN_NAV.DASHBOARD', '/admin', null, 'dashboard', null, false, 0),
        new Menu(20, 'ADMIN_NAV.MENU_ITEMS', null, null, 'grid_on', null, true, 0),
        new Menu(21, 'ADMIN_NAV.CATEGORIES', '/admin/menu-items/categories', null, 'category', null, false, 20),
        new Menu(22, 'ADMIN_NAV.MENU_ITEMS_LIST', '/admin/menu-items/list', null, 'list', null, false, 20),
        new Menu(24, 'ADMIN_NAV.ADD_MENU_ITEM', '/admin/menu-items/add', null, 'add_circle_outline', null, false, 20),
        new Menu(80, 'ADMIN_NAV.ANALYTICS', '/admin/analytics', null, 'multiline_chart', null, false, 0),
       
      ];
    } else if (userRole === 'commerciale') {   
      return [
        new Menu(20, 'ADMIN_NAV.MENU_ITEMS', null, null, 'grid_on', null, true, 0),
        new Menu(21, 'ADMIN_NAV.CATEGORIES', '/admin/menu-items/categories', null, 'category', null, false, 20),
        new Menu(22, 'ADMIN_NAV.MENU_ITEMS_LIST', '/admin/menu-items/list', null, 'list', null, false, 20),
        new Menu(24, 'ADMIN_NAV.ADD_MENU_ITEM', '/admin/menu-items/add', null, 'add_circle_outline', null, false, 20),
       
      ];
    }
    return [];
  }

}
