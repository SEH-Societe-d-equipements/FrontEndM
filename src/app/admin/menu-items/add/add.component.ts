import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MenuItem } from 'src/app/app.models';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { File } from 'buffer';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  public form!: UntypedFormGroup;
  private sub: any;
  public id:any;
  public showImage:boolean = false;

  constructor(public appService:AppService, 
              public formBuilder: UntypedFormBuilder, 
              private activatedRoute: ActivatedRoute,
              public router:Router, 
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {  
  this.form = this.formBuilder.group({ 
  "_id": [null], // Utilisez "_id" au lieu de "id"
  "Reference": [null, Validators.compose([Validators.required, Validators.minLength(4)])],
  "Designation": [null], 
  "description": [null], 
  "image": [null],
  "Categorie": [null, Validators.required]
});

    this.getCategories();
    this.sub = this.activatedRoute.params.subscribe(params => {  
      if (params && params['_id']){
        this.id = params['_id'];
        this.getMenuItemById(); 
      } 
      else {
        this.showImage = true;
      }
    });
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

  public getCategories(){
    if(!this.appService.categories.length){
      this.appService.getCategories().subscribe(categories=>{ 
        this.appService.categories = categories;
      });
    } 
  } 
 
  public getMenuItemById(){
    this.appService.getMenuItemById(this.id).subscribe((menuItem:MenuItem)=>{ 
      this.form.patchValue(menuItem); 
      if (isPlatformBrowser(this.platformId)) {
        this.appService.convertImgToBase64(menuItem.Photo, (dataUrl:string) => { 
          this.showImage = true;
          this.form.controls.image.patchValue(dataUrl.toString());
        }) 
      }  
    });
  }

 // Ajoutez un champ d'erreur dans votre composant
public fileSelectionError: string = '';

public fileChange(event: any): void {
    const files: FileList | null = event?.target?.files;
   console.log(files)
    if (files && files.length > 0) {
        this.form.controls['image'].patchValue(files[0]);
        // Réinitialisez le champ d'erreur s'il était affiché précédemment
        this.fileSelectionError = '';
    } else {
        // Affichez un message d'erreur dans l'interface utilisateur
        this.fileSelectionError = 'Aucun fichier sélectionné.';
        this.form.controls['image'].patchValue(null);
    }
}




  

 
public onSubmit(): void {
  const formValues = this.form.value;

  // Assurez-vous que formValues.Categorie est défini avant de l'utiliser
  if (formValues && formValues.Categorie) {
    const fileInput = this.form.controls.image.value;

    // Si l'ID de l'article est disponible, mettez à jour l'article existant
    if (this.id) {
      this.appService.updateArticle(this.id, formValues);
    } else {
      // Sinon, ajoutez un nouvel article
      this.appService.addArticle(formValues.Reference, formValues.Designation, formValues.description, formValues.Categorie, fileInput).subscribe(
        (response: any) => {
          // Gérez la réponse du serveur ici
          console.log(response);
          this.router.navigate(['/admin/menu-items/list']);
        },
        error => {
          console.error('Erreur lors de l\'ajout côté serveur', error);
          console.log(error);
          // Gérer les erreurs d'ajout côté serveur
        }
      );
    }
  } else {
    console.error('La propriété Categorie est undefined dans formValues.');
  }
}


} 