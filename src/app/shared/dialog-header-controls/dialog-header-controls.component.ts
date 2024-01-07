import { Component, OnInit, Input } from '@angular/core';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Component({
  selector: 'app-dialog-header-controls',
  templateUrl: './dialog-header-controls.component.html',
  styleUrls: ['./dialog-header-controls.component.scss']
})
export class DialogHeaderControlsComponent implements OnInit {
  @Input('dialogRef') dialogRef:any;
  @Input('showFullscreenIcon') showFullscreenIcon:boolean = true; 
  public isFullScreen:boolean = false;
  constructor(private domHandlerService: DomHandlerService) { }

  ngOnInit() {
  }

  public toggleFullScreen(){
    this.isFullScreen = !this.isFullScreen;
    if(this.isFullScreen){
      this.dialogRef.addPanelClass('fullscreen');
      this.domHandlerService.winDocument.getElementsByTagName('html')[0].style.overflowY = "hidden"; 
    }
    else{
      this.dialogRef.removePanelClass('fullscreen'); 
      (this.domHandlerService.winDocument.getElementsByTagName('html')[0] as any).style.overflowY = null; 
    } 
  }

  public close(){  
    this.dialogRef.close(); 
    (this.domHandlerService.winDocument.getElementsByTagName('html')[0] as any).style.overflowY = null; 
  }

}
