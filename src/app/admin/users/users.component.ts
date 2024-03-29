import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from '../../app.settings';
import { User } from './user.model';
import { UsersService } from './users.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { DomHandlerService } from 'src/app/dom-handler.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ UsersService ]  
})
export class UsersComponent implements OnInit {
    public users: User[] = [];
    public searchText: string = '';
    public page:any;
    public settings: Settings;
    public maxSize:number = 5;
    public autoHide:boolean = true;
    constructor(public appSettings:AppSettings, 
                public dialog: MatDialog,
                public usersService: UsersService,
                private domHandlerService: DomHandlerService){
        this.settings = this.appSettings.settings; 
    }

    ngOnInit() {
        this.getUsers();         
    }

    public getUsers(): void {
        this.users = []; //for show spinner each time
        this.usersService.getUsers().subscribe(users => this.users = users);    
    }
    public addUser(user:User){
        this.usersService.addUser(user).subscribe(user => this.getUsers());
    }
    public updateUser(user:User){
        this.usersService.updateUser(user).subscribe(user => this.getUsers());
    }
    public deleteUser(user:User){
       this.usersService.deleteUser(user.id).subscribe(user => this.getUsers());
    }


    public onPageChanged(event:any){
        this.page = event;
        this.getUsers();
        this.domHandlerService.winScroll(0,0);
    }

    public openUserDialog(user:User | null){
        let dialogRef = this.dialog.open(UserDialogComponent, {
            data: user,
            panelClass: ['theme-dialog']
        });

        dialogRef.afterClosed().subscribe(user => {
            if(user){
                (user.id) ? this.updateUser(user) : this.addUser(user);
            }
        });
    }

}