import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AppSettings, Settings } from '../app.settings';
import { Router, NavigationEnd } from '@angular/router'; 
import { MenuService } from './components/menu/menu.service';
import { Menu } from './components/menu/menu.model';
import { DomHandlerService } from '../dom-handler.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('sidenav') sidenav:any;  
  public userImage = 'assets/images/others/admin.jpg'; 
  public settings:Settings;
  public menuItems:Array<Menu> = [];
  public toggleSearchBar:boolean = false;
  constructor(public appSettings:AppSettings, 
              public router:Router,
              private menuService: MenuService,
              private domHandlerService: DomHandlerService){        
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {  
    if(this.domHandlerService.window?.innerWidth <= 960){ 
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    };  
    this.menuItems = this.menuService.getMenuItems();    
  }

  ngAfterViewInit(){  
    if(this.domHandlerService.winDocument.getElementById('preloader')){
      this.domHandlerService.winDocument.getElementById('preloader')?.classList.add('hide');
    } 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.domHandlerService.isBrowser) {
          this.scrollToTop();
        } 
      } 
      if(this.domHandlerService.window?.innerWidth <= 960){
        this.sidenav.close(); 
      }                
    });  
    this.menuService.expandActiveSubMenu(this.menuService.getMenuItems());  
  } 

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -this.domHandlerService.window?.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(this.domHandlerService.window?.pageYOffset != 0){
        this.domHandlerService.window?.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);

    if(this.domHandlerService.window?.innerWidth <= 768){
      this.domHandlerService.winScroll(0,0);
    }
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    if(this.domHandlerService.window?.innerWidth <= 960){
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false; 
    }
    else{ 
      this.settings.adminSidenavIsOpened = true;
      this.settings.adminSidenavIsPinned = true;
    }
  }


}
