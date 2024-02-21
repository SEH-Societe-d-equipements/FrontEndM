import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { 
    path: '', 
    component: PagesComponent, children: [
        //{ path: '', redirectTo: '/landing', pathMatch: 'full' },
        { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
        { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule) },
        { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
        { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuModule) },
        { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    ]
  },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '**', component: NotFoundComponent } 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabledBlocking'
})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }