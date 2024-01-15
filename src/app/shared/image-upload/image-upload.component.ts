import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';  
import { AppService } from 'src/app/app.service';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input('base64') base64:string = ''; 
  @Input('fileSize') fileSize = 500;  
  @Input('acceptTypes') acceptTypes:any; 
  @Output() onFileChange: EventEmitter<any> = new EventEmitter(); 
  @Output() onFileUploadClick: EventEmitter<any> = new EventEmitter();
  public files:any[] = [];  

  constructor(public appService:AppService, private domHandlerService: DomHandlerService) { } 

  ngOnInit(): void {  
    if(this.base64){ 
      this.files.push({
        name: 'image-' + new Date().getDate, 
        content: this.base64,
        size: null
      })
    } 
  }
 

  public fileChange(event: any): void {
    const input = event.target;
    if (input.files && input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
            const reader = new FileReader();
            const file = input.files[i];

            if (file.size / 1024 > this.fileSize) {
                const message = this.appService.getTranslateValue('MESSAGE.FILE_SIZE', this.fileSize.toString());
                let dialogRef = this.appService.openAlertDialog(message!);
                dialogRef.afterClosed().subscribe(dialogResult => {
                    this.clearInput();
                });
            } else {
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.files.push({
                        "name": file.name,
                        "size": file.size,
                        "content": reader.result
                    });
                    this.onFileChange.emit(this.files);
                };
            }
        }
    }
}

   
  public fileUploadClick(){ 
    this.onFileUploadClick.emit();
  }

  public clearInput(){
    if(this.files.length == 0){  
      if(this.domHandlerService.winDocument.getElementById('singleFileUploader')){ 
        (<HTMLInputElement>this.domHandlerService.winDocument.getElementById('singleFileUploader')).value = ''; 
      }
    }  
  } 

  public deleteFile() {  
    const message = this.appService.getTranslateValue('MESSAGE.SURE_DELETE');
    let dialogRef = this.appService.openConfirmDialog('', message!);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.files.length = 0;          
        this.onFileChange.emit(this.files);
        this.clearInput();   
      }
    });  
  }  

}
