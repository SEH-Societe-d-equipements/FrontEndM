import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Settings, AppSettings } from './app.settings';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { DomHandlerService } from './dom-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
   
  public settings: Settings;
  constructor(public appSettings:AppSettings, 
              public router:Router, 
              public translate: TranslateService,
              private domHandlerService: DomHandlerService){
    this.settings = this.appSettings.settings;
    translate.addLangs(['en','de','fr','ru','tr']);
    translate.setDefaultLang('fr'); 
    translate.use('fr');
  }

  ngAfterViewInit(){ 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {   
        this.domHandlerService.winScroll(0,0);
      }            
    });    
  }

}