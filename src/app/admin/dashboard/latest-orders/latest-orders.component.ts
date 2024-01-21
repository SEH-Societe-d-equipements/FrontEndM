import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-latest-orders',
  templateUrl: './latest-orders.component.html',
  styleUrls: ['./latest-orders.component.scss']
})
export class LatestOrdersComponent implements OnInit {
  public orders = [];
  constructor(private appService: AppService) { }
  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.appService.getContacts().subscribe(
      (contacts) => {
        // Mettez à jour la liste des contacts
        this.orders = contacts.map((contact) => ({
          email: contact.email, 
          message: contact.message, 
          phone: contact.phone,
          name : contact.name 
          
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des contacts', error);
      }
    );
  }

}
