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
  
  typesOffilter: string[] = ['Touts Designations','Pack a Pizza', 'Cuisine', 'réfrigérateur', 'gaz', 'Electrique', 'Chaud', 'froid', 'machine'];  

  selectedFilter: string = 'Touts Designations';

// Existing code...


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
  applyFilter() {
     // Debugging line
    console.log('Selected Filter:', this.selectedFilter);
    if (this.selectedFilter === "Touts Designations") {
      this.getArticlesByCategory(this.selectedCategoryId);
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
      console.log(this.categories);
    });
  }
  
  public selectCategory(_id: string): void {
    console.log("Selected category ID:", _id);
  
    if (_id !== undefined && _id !== null) {
      this.selectedCategoryId = _id.toString();
      console.log("Converted category ID to string:", this.selectedCategoryId);
  
      if (this.selectedCategoryId === '0') {
        // Charger tous les articles lorsque "All Categories" est sélectionné
        this.getMenuItemsA();
      } else {
        // Charger les articles en fonction de la catégorie sélectionnée
        this.getArticlesByCategory(this.selectedCategoryId);
      }
      this.sidenav.close();
    } else {
      console.error("Invalid category ID. Value received:", _id);
    }
  }
  
  
  
  
  

  public onChangeCategory(event:any){ 
    this.selectCategory(event.value);
  }
  public getArticlesByCategory(categoryId: string): void {
    const trimmedQuery = this.selectedFilter.trim().toLowerCase();

    this.appService.getMenuItems(categoryId).subscribe(data => {
      this.originmenuItems = data;
      if (this.selectedFilter === "Touts Designations") {
        this.menuItems = data;
      } else {
      this.menuItems = data.filter(item =>
        
        item.Designation.toLowerCase().includes(trimmedQuery) 
      );
      }
      this.pagination = new Pagination(1, this.count, null, 2, data.length, Math.ceil(data.length / this.count));
      this.message = null;
    });
  }
  

  public getMenuItemsA(){
    this.appService.getMenuItemsA().subscribe(data => {
      this.originmenuItems = data;
      this.menuItems = data;
      console.log(data)
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

  public filterData(data:any){
    return this.appService.filterData(data, this.selectedCategoryId, this.sort, this.pagination.page, this.pagination.perPage);
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