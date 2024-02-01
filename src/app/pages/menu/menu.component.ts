import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@ngbracket/ngx-layout';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, map } from 'rxjs/operators';
import { Category, MenuItem, Pagination } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { AppSettings, Settings } from 'src/app/app.settings';
import { DomHandlerService } from 'src/app/dom-handler.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})


export class MenuComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen:boolean = false;
  public showSidenavToggle:boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public originmenuItems: MenuItem[] = [];
  public menuItems: MenuItem[] = [];
  public headerVideoSource: string = 'assets/images/others/test.mp4'
  public categories:Array<Category> = [];
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public count: number = 12;
  public sort: string = '';
  public selectedCategoryId: any ; // Change the type to string
  searchQuery: string = '';
  public pagination:Pagination = new Pagination(1, this.count, null, 2, 0, 0); 
  public message:string | null = '';
  public watcher: Subscription;
  public settings: Settings;
  filteredMenuItems: MenuItem[] = [];
  typesOffilter: string[] = ['Touts Designations'];  
  selectedFilter: string = 'Touts Designations';



  constructor(public appSettings:AppSettings, 
              public appService:AppService,
              public mediaObserver: MediaObserver,
              private domHandlerService: DomHandlerService) {
    this.settings = this.appSettings.settings; 
    this.watcher = mediaObserver.asObservable()
    .pipe(filter((changes: MediaChange[]) => changes.length > 0), map((changes: MediaChange[]) => changes[0]))
    .subscribe((change: MediaChange) => {
      if(change.mqAlias == 'xs') {
        this.sidenavOpen = false;
        this.showSidenavToggle = true;
        this.viewCol = 100;
      }
      else if(change.mqAlias == 'sm'){
        this.sidenavOpen = false;
        this.showSidenavToggle = true;
        this.viewCol = 50;
      }
      else if(change.mqAlias == 'md'){
        this.sidenavOpen = false;
        this.showSidenavToggle = false;
        this.viewCol = 33.3;
      }
      else{
        this.sidenavOpen = false;
        this.showSidenavToggle = false;
        this.viewCol = 25;
      }
    });


  }
  getUniqueDesignations(): string[] {
    const designationsSet = new Set<string>();
  
    // Extract unique designations from menuItems
    this.originmenuItems.forEach(item => {
      designationsSet.add(item.Designation);
    });
  
    // Convert the Set to an array
    return Array.from(designationsSet);
  }
  
  applyFilter() {
     // Debugging line
    if (this.selectedFilter === "Touts Designations") {
      this.menuItems = this.originmenuItems
    } else {
      const trimmedQuery = this.selectedFilter.trim().toLowerCase();
      this.menuItems = this.originmenuItems.filter(item =>
        
        item.Designation.toLowerCase().includes(trimmedQuery) 
      );
    }
    this.resetPagination();
  }
  applySearchFilter(): void {
    const trimmedQuery = this.searchQuery.trim().toLowerCase();
    if (trimmedQuery === '') {
      this.resetPagination();

    } else {
      this.menuItems = this.originmenuItems.filter(item =>
        item.Reference.toLowerCase().includes(trimmedQuery) ||
        item.Categorie.Libelle.toLowerCase().includes(trimmedQuery) ||
        item.Categorie.description.toLowerCase().includes(trimmedQuery) ||
        item.Designation.toLowerCase().includes(trimmedQuery) 
      );
    }
    this.resetPagination();
  }

  ngOnInit(): void {
    this.getCategories();
    this.getMenuItemsA();
  }

  ngOnDestroy(){ 
    this.watcher.unsubscribe();
  }

  public getCategories() {
    this.appService.getCategories().subscribe(categories => {
      this.categories = categories.map(category => ({
        ...category,
        _id: category._id.toString()  // Convertir l'ID en chaîne si c'est un nombre
      }));
    });
  }
  
  public selectCategory(_id: string): void {
  
    if (_id !== undefined && _id !== null) {
      this.selectedCategoryId = _id.toString();
  
      if (this.selectedCategoryId === '0') {
        // Load all items when "All Categories" is selected
        this.typesOffilter = ['Touts Designations'];
        this.selectedFilter = 'Touts Designations';
        this.headerVideoSource = 'assets/images/Video.mp4'; // Set the default video source
        this.getMenuItemsA();
      } else {
        // Load items based on the selected category
        this.selectedFilter = 'Touts Designations';  // Set the selected filter

        this.getArticlesByCategory(this.selectedCategoryId);
        
        if (this.selectedCategoryId === '65b16ba2410573636451b7f3')
        {this.headerVideoSource = 'assets/images/GRADUS.mp4';}
        else if (this.selectedCategoryId === '65b16bad410573636451b7f6')
        {  this.headerVideoSource = 'assets/images/LA SPAZIALE_cappuccino.mp4';}
        else if (this.selectedCategoryId === '65b16b51410573636451b7f1')
        {  this.headerVideoSource = 'assets/images/others/test.mp4';}
        else if (this.selectedCategoryId === '65b16bcb410573636451b7fb')
        {  this.headerVideoSource = 'assets/images/Tecnoinox - Intro.mp4';}
        else if (this.selectedCategoryId === 'test')
        {  this.headerVideoSource = 'assets/images/others/test.mp4';}
        else if (this.selectedCategoryId === 'test')
        {  this.headerVideoSource = 'assets/images/others/test.mp4';}
        // Set video source based on the selected category (modify as needed)
        // Example: this.headerVideoSource = 'assets/videos/' + this.selectedCategoryId + '.mp4';
      }
      this.sidenav.close();
    } else {
      console.error("Invalid category ID. Value received:", _id);
    }
  }
z  
  
  
  

  public onChangeCategory(event:any){ 
    
    this.selectCategory(event.value);
    
  }
  public getArticlesByCategory(categoryId: string): void {
    const trimmedQuery = this.selectedFilter.trim().toLowerCase();

    this.appService.getMenuItems(categoryId).subscribe(data => {
      this.originmenuItems = data;
      if (this.selectedFilter === "Touts Designations") {
        this.menuItems = data;
        this.typesOffilter = ['Touts Designations', ...this.getUniqueDesignations()];
      } else {
      this.menuItems = data.filter(item =>
        
        item.Designation.toLowerCase().includes(trimmedQuery) 
        
      );
      this.typesOffilter = ['Touts Designations', ...this.getUniqueDesignations()];

      }
      this.pagination = new Pagination(1, this.count, null, 2, data.length, Math.ceil(data.length / this.count));
      this.message = null;
    });
  }
  

  public getMenuItemsA(){
    this.appService.getMenuItemsA().subscribe(data => {
      this.originmenuItems = data;
      this.menuItems = data;
      this.pagination = new Pagination(1, this.count, null, 2, data.length, Math.ceil(data.length / this.count));
      this.message = null;
    });
  }  

  public resetPagination(){ 
    if(this.paginator){
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data: any[]): { data: any[], pagination: Pagination } {
    // Implement your filtering logic here
    // Example: filter data based on a condition
    let filteredData = data.filter(item => item.someCondition);

    // Example: calculate pagination
    let pagination = new Pagination(1, this.count, null, 2, filteredData.length, Math.ceil(filteredData.length / this.count));

    return { data: filteredData, pagination: pagination };
}
 
  public changeCount(count:number){
    this.count = count;   
    this.menuItems.length = 0;
    this.resetPagination();
    this.getMenuItemsA();
  }
  public changeSorting(sort:any){    
    this.sort = sort; 
    this.menuItems.length = 0;
    this.getMenuItemsA();
  }
  public changeViewType(obj:any){ 
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol; 
  } 


  public onPageChange(e:any){ 
    this.pagination.page = e.pageIndex + 1;
    this.getMenuItemsA();
    this.domHandlerService.winScroll(0,0);  
  }

} 