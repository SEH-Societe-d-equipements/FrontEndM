import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';  
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { MenuItem } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit { 
  displayedColumns: string[] = ['index', 'image', 'categoryId', 'Reference', 'Designation', 'actions'];
  dataSource!: MatTableDataSource<MenuItem>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(public appService:AppService) { }

  ngOnInit(): void {
    this.getCategories(); 
    this.appService.getMenuItemsA().subscribe((menuItems:MenuItem[]) => {
      this.initDataSource(menuItems); 
    })
  }

  getFullImageUrl(imageSrc: string): string {
    const fullUrl = environment.backendUrl + "" + imageSrc;
    return fullUrl;
}


  public initDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;  
  }  

  public getCategories(){
    if(!this.appService.categories.length){
      this.appService.getCategories().subscribe(categories=>{ 
        this.appService.categories = categories;
      });
    } 
  } 


  public remove(menuItem: MenuItem) {
    const index: number = this.dataSource.data.indexOf(menuItem);
    if (index !== -1) {
      const message = this.appService.getTranslateValue('MESSAGE.SURE_DELETE');
      let dialogRef = this.appService.openConfirmDialog('', message!);
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          this.appService.deleteArticle(menuItem._id).subscribe(
            () => {
              this.dataSource.data.splice(index, 1);
              this.initDataSource(this.dataSource.data);
            },
            (error) => {
              console.error('Erreur lors de la suppression côté serveur', error);
            }
          );
        }
      });
    }
  }
  

}
