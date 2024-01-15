import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router'; 
import { AppSettings, Settings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: UntypedFormGroup;
  public hide = true;
  public bgImage:any;
  public settings: Settings;
  constructor(public fb: UntypedFormBuilder, public router:Router, private sanitizer:DomSanitizer, public appSettings:AppSettings,public appService:AppService) { 
    this.settings = this.appSettings.settings; 
  }

  ngOnInit(): void {
    this.bgImage = this.sanitizer.bypassSecurityTrustStyle('url(assets/images/others/login.png');
    
    this.loginForm = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      rememberMe: false
    });
  }

  public onLoginFormSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.appService.login(username, password).subscribe(
        (response) => {
          if (response.success) {
            console.log('User Role from Server:', response.user.role);
            this.appService.setUserRole(response.user.role);
            this.router.navigate(['/admin']);
          } else {
            console.error(response.error_message);
          }
        },
        (error) => {
          console.error(error);
        }
      );
      
    }
  }
  

}
