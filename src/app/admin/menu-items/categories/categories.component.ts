import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = ['index', 'Libelle', 'description', 'edit', 'remove'];
  dataSource!: MatTableDataSource<Category>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(public appService:AppService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.appService.getCategories().subscribe((categories:Category[]) => {
      this.initDataSource(categories); 
    })
  }

  public initDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  } 
 
  public remove(category: Category) {
    const index: number = this.dataSource.data.indexOf(category);
  
    if (index !== -1) {
      const message = this.appService.getTranslateValue('MESSAGE.SURE_DELETE');
      let dialogRef = this.appService.openConfirmDialog('', message!);
      
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.appService.deleteCategory(category._id).subscribe(
            () => {
              this.dataSource.data.splice(index, 1);
              this.initDataSource(this.dataSource.data);
              console.log(dialogResult)
            },
            error => {
              console.error('Erreur lors de la suppression côté serveur', error);
            }
          );
        }
      });
    }
  }

  public openCategoryDialog(category: Category | null) {
    const dialogRef = this.appService.openDialog(CategoryDialogComponent, category, 'theme-dialog');
    dialogRef.afterClosed().subscribe(category => {
      if (category) {
        let message = '';
        const index: number = this.dataSource.data.findIndex(x => x._id == category._id);
  
        if (index !== -1) {
          this.appService.updateCategory(category._id, category).subscribe(
            () => {
              this.dataSource.data[index] = category;
              message = 'Category ' + category.Libelle + ' updated successfully';
              this.initDataSource(this.dataSource.data);
              this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
            },
            error => {
              console.error('Erreur lors de la mise à jour côté serveur', error);
            }
          );
        } else {
          this.appService.addCategory(category.Libelle, category.description).subscribe(
            (response: any) => {
              category._id = response.category._id;
              this.dataSource.data.push(category);
              this.paginator.lastPage();
              const message = 'New category ' + category.Libelle + ' added successfully!';
              this.initDataSource(this.dataSource.data);
              this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
            },
            error => {
              console.error('Erreur lors de l\'ajout côté serveur', error);
            }
          );
          
        }
      }
    });
  }
  
}
