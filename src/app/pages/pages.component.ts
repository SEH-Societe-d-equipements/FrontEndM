import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings'; 
import { AppService } from '../app.service';
import { DomHandlerService } from '../dom-handler.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  @ViewChild('sidenav') sidenav:any;   
  public headerTypes = ['default', 'image', 'carousel', 'video'];
  public headerTypeOption:string = ''; 
  public headerFixed: boolean = false;
  public showBackToTop: boolean = false;
 
  public settings: Settings;
  constructor(public appSettings:AppSettings, 
              public router:Router,  
              public appService:AppService,
              private domHandlerService: DomHandlerService) {
    this.settings = this.appSettings.settings;  
  } 

  ngOnInit() {    
    this.headerTypeOption = this.settings.header;
    this.getCategories();  
  }
  
  public changeTheme(theme:string){
    this.settings.theme = theme;       
  }


  public chooseHeaderType(){
    this.settings.header = this.headerTypeOption;    
    this.domHandlerService.winScroll(0,0);
    this.router.navigate(['/']);
  }
 

  @HostListener('window:scroll') onWindowScroll() {
    const scrollTop = Math.max(this.domHandlerService.window?.pageYOffset, this.domHandlerService.winDocument.documentElement.scrollTop, this.domHandlerService.winDocument.body.scrollTop);
    (scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false; 

    if(this.settings.stickyMenuToolbar){      
      let top_toolbar = this.domHandlerService.winDocument.getElementById('top-toolbar');
      if(top_toolbar){ 
        if(scrollTop >= top_toolbar.clientHeight) {
          this.settings.mainToolbarFixed = true;
        }
        else{
          if(!this.domHandlerService.winDocument.documentElement.classList.contains('cdk-global-scrollblock')){
            this.settings.mainToolbarFixed = false;
          }  
        } 
      }        
    } 
  }

  public scrollToTop(){
    if (this.domHandlerService.isBrowser) { 
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
    }
    if(this.domHandlerService.window?.innerWidth <= 768){
     this.domHandlerService.winScroll(0,0);
    }
  }

  ngAfterViewInit(){
    if(this.domHandlerService.winDocument.getElementById('preloader')){
      this.domHandlerService.winDocument.getElementById('preloader')?.classList.add('hide');
    } 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {        
        this.sidenav.close();
        this.settings.mainToolbarFixed = false;
        this.domHandlerService.winScroll(0,0);
      }            
    });    
  } 

  public getCategories(){  
    if(this.appService.categories.length == 0) { 
      this.appService.getCategories().subscribe(data => { 
        this.appService.categories = data;
      });
    } 
  }

}
