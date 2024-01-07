import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(public router:Router, private domHandlerService: DomHandlerService) { }

  ngOnInit() {
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }

  ngAfterViewInit(){
    this.domHandlerService.winDocument.getElementById('preloader')?.classList.add('hide');    
  }

}