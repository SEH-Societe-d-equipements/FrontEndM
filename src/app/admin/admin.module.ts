import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module'; 
import { AdminComponent } from './admin.component';
import { MenuComponent } from './components/menu/menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { FullScreenComponent } from './components/fullscreen/fullscreen.component'; 
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component'; 



export const routes = [ 
  
  { 
    
    path: '', 
    component: AdminComponent, children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }, 
      { path: 'menu-items', loadChildren: () => import('./menu-items/menu-items.module').then(m => m.MenuItemsModule) },
    ]
  } 
];


@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    UserMenuComponent,
    FullScreenComponent,
    BreadcrumbComponent 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AdminModule { 
 
}
