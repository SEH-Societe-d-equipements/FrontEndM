import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, Order } from 'src/app/app.models'; 
import { AppSettings } from 'src/app/app.settings'; 
import { environment } from 'src/environments/environment';   
import { ConfirmDialogComponent, ConfirmDialogModel } from './shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { map } from 'rxjs/operators';
import { DomHandlerService } from './dom-handler.service';


export class Data {
  constructor(public categories: Category[], 
              public cartList: MenuItem[],
              public orderList: Order[],
              public favorites: MenuItem[], 
              public totalPrice: number,
              public totalCartCount: number
              ) { }
}

interface Category {
  _id: string;
  description: string;
  Libelle: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface User {
  _id: string;
  username: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Injectable({
  providedIn: 'root',
})
export class AppService {



  
  public loggedInUser: User | null = null;
  public url = environment.url + '/assets/data/'; 
  public url2 = environment.backendUrl ;
  private userRole: string = 'admin';  // Assignez la valeur par défaut ou obtenez-la après la connexion

  
  constructor(public http:HttpClient, 
              private datePipe:DatePipe,
              private bottomSheet: MatBottomSheet, 
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              public appSettings:AppSettings,
              public translateService: TranslateService,
              private domHandlerService: DomHandlerService) { } 
               
              public categories: Category[] = [];
              public articles: MenuItem[] = [];
              public user: User[] = [];


              public getMenuItems(categoryId: string): Observable<MenuItem[]> {
                const params = new HttpParams().set('categoryId', categoryId);
                return this.http.get<{ articles: MenuItem[] }>(`${this.url2}api/article/articles`, { params })
                  .pipe(map(response => response.articles));
              }
               
              public getMenuItemsA(): Observable<MenuItem[]>{
                return this.http.get<{articles: MenuItem[]}>(`${this.url2}api/article/articles`)
                .pipe(map(response => response.articles));
              }
 
  public getMenuItemById(id:string): Observable<MenuItem>{
    return this.http.get<{articles: MenuItem}>(`${this.url2}api/article/articles/${id}` )
    .pipe(map(response => response.articles));
  }
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(this.url2 + 'api/user/login', body);
  }
  setUserRole(role: string): void {
    this.userRole = role;
  }

  getUserRole(): string {
    return this.userRole;
  }
  
 

  addArticle(reference: string, designation: string, categorie: string, file: File | null): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Reference', reference);
    formData.append('Designation', designation);
    formData.append('Categorie', categorie);
    if (file) {
      formData.append('Photo', file, file.name);
    }
  
    return this.http.post<any>(this.url2 + 'api/article/articles', formData);
  }
  updateArticle(articleId: string, updatedData: any): Observable<any> {
    const url = `${this.url2}api/article/articles/${articleId}`;
    return this.http.put(url, updatedData);
  }

  deleteArticle(articleId: string): Observable<any> {
    const url = `${this.url2}api/article/articles/${articleId}`;
    return this.http.delete(url);
  }
  getAllArticles(categoryId?: string): Observable<any> {
    const url = `${this.url2}api/article/articles`;
    const params: any = {};
    if (categoryId) {
      params.categoryId = categoryId;
    }

    return this.http.get(url, { params });
  }
 
  addCategory(Libelle: string, description: string): Observable<Category> {
    const body = {  Libelle: Libelle, description: description };
    return this.http.post<any>(this.url2 + 'api/category/categories', body);
  }
  updateCategory(categoryId: string,updatedData: any): Observable<any> {
    const url = `${this.url2}api/category/categories/${categoryId}`;

    return this.http.put(url, updatedData);
  }
  deleteCategory(categoryId: string): Observable<any> {
    const url = `${this.url2}api/category/categories/${categoryId}`;
    return this.http.delete(url);
  }
  public getSpecialMenuItems(): Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(this.url + 'special-menu-items.json');
  }
 
  public getSpecialArticles(): Observable<MenuItem[]>{
    return this.http.get<{articles: MenuItem[]}>(`${this.url2}api/article/firstFourArticles`)
    .pipe(map(response => response.articles));
  } 
  

  public getBestMenuItems(): Observable<MenuItem[]>{
    return this.http.get<MenuItem[]>(this.url + 'best-menu-items.json');
  } 

  public getCategories(): Observable<Category[]> {
    return this.http.get<{categories: Category[] }>(`${this.url2}api/category/categories`)
      .pipe(map(response => response.categories));
  }
  
 

  public getHomeCarouselSlides(){
    return this.http.get<any[]>(this.url + 'slides.json');
  }

  public getReservations(){
    return this.http.get<any[]>(this.url + 'reservations.json');
  }

  public getOrders(){
    return this.http.get<any[]>(this.url + 'orders.json');
  }

  public getGUID(){
    let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toLowerCase();
    return guid;
  }

  

 
  

  public openDialog(component:any, data:any, panelClass:any){ 
    return this.dialog.open(component, {
      data: data, 
      panelClass: panelClass,
      autoFocus: false,
      direction: (this.appSettings.settings.rtl) ? 'rtl':'ltr'
    });  
  }

  public openConfirmDialog(title:string, message:string) {  
    const dialogData = new ConfirmDialogModel(title, message); 
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    }); 
    return dialogRef; 
  }

  public openAlertDialog(message:string) {   
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "400px",
      data: message
    }); 
    return dialogRef; 
  }

  public makeReservation(dialogComponent:any, data:any, onDialog:boolean = false){
    if(onDialog){
      const dialogRef = this.openDialog(dialogComponent, null, 'theme-dialog');
      dialogRef.afterClosed().subscribe(data => {  
        if(data){ 
          this.showReservationMessage(data);
        } 
      }); 
    }
    else{
      this.showReservationMessage(data);
    } 
  }
  private showReservationMessage(data:any){
    this.snackBar.open('Dear ' + data.fullName + ', thank you for your reservation! Your reservation at Popino on the '+ this.datePipe.transform( data.date,'dd-MM-yyyy') +' at '+ data.time +' for '+ data.guests +' people will review by our team and someone will be in touch soon.', '×', { panelClass: 'success', verticalPosition: 'top', duration: 9000 });
  } 

  public getTranslateValue(key:string, param:string = ''){  
    let value = null;
    this.translateService.get(key, { param: param }).subscribe((res: string) => {
      value = res;
    }) 
    return value; 
  } 

  public filterData(data:any, categoryId:number, sort?:string, page?:number, perPage?:number){  
    if(categoryId){
      data = data.filter((item:any) => item.categoryId == categoryId);
    } 
    this.sortData(sort, data);
    return this.paginator(data, page, perPage)
  }

  public sortData(sort?:string, data?:any){
    if(sort){
      switch (sort) { 
        case 'Popular':
          data = data.sort((a:any, b:any) => { 
            if(a.ratingsValue/a.ratingsCount < b.ratingsValue/b.ratingsCount){
              return 1;
            }
            if(a.ratingsValue/a.ratingsCount > b.ratingsValue/b.ratingsCount){
              return -1;
            }
            return 0; 
          });
          break;
        case 'Price (Low to High)': 
          data = data.sort((a:any,b:any) => {
            if(a.price > b.price){
              return 1;
            }
            if(a.price < b.price){
              return -1;
            }
            return 0;  
          });
          break;
        case 'Price (High to Low)': 
          data = data.sort((a:any,b:any) => {
            if(a.price < b.price){
              return 1;
            }
            if(a.price > b.price){
              return -1;
            }
            return 0;  
          }); 
          break;
        default:
          break;
      }
    }
    return data;
  }

  public paginator(items: any[], page = 1, perPage = 4) {
    if (!Array.isArray(items)) {
      console.error('Paginator error: items is not an array.');
      return {
        data: [],
        pagination: {
          page: 1,
          perPage: 0,
          prePage: null,
          nextPage: null,
          total: 0,
          totalPages: 0,
        },
      };
    }
  
    const offset = (page - 1) * perPage;
    const paginatedItems = items.slice(offset, offset + perPage);
    const totalPages = Math.ceil(items.length / perPage);
  
    return {
      data: paginatedItems,
      pagination: {
        page: page,
        perPage: perPage,
        prePage: page > 1 ? page - 1 : null,
        nextPage: totalPages > page ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
      },
    };
  }
  
  public getCountries(){
    return [ 
        {name: 'Afghanistan', code: 'AF'}, 
        {name: 'Aland Islands', code: 'AX'}, 
        {name: 'Albania', code: 'AL'}, 
        {name: 'Algeria', code: 'DZ'}, 
        {name: 'American Samoa', code: 'AS'}, 
        {name: 'AndorrA', code: 'AD'}, 
        {name: 'Angola', code: 'AO'}, 
        {name: 'Anguilla', code: 'AI'}, 
        {name: 'Antarctica', code: 'AQ'}, 
        {name: 'Antigua and Barbuda', code: 'AG'}, 
        {name: 'Argentina', code: 'AR'}, 
        {name: 'Armenia', code: 'AM'}, 
        {name: 'Aruba', code: 'AW'}, 
        {name: 'Australia', code: 'AU'}, 
        {name: 'Austria', code: 'AT'}, 
        {name: 'Azerbaijan', code: 'AZ'}, 
        {name: 'Bahamas', code: 'BS'}, 
        {name: 'Bahrain', code: 'BH'}, 
        {name: 'Bangladesh', code: 'BD'}, 
        {name: 'Barbados', code: 'BB'}, 
        {name: 'Belarus', code: 'BY'}, 
        {name: 'Belgium', code: 'BE'}, 
        {name: 'Belize', code: 'BZ'}, 
        {name: 'Benin', code: 'BJ'}, 
        {name: 'Bermuda', code: 'BM'}, 
        {name: 'Bhutan', code: 'BT'}, 
        {name: 'Bolivia', code: 'BO'}, 
        {name: 'Bosnia and Herzegovina', code: 'BA'}, 
        {name: 'Botswana', code: 'BW'}, 
        {name: 'Bouvet Island', code: 'BV'}, 
        {name: 'Brazil', code: 'BR'}, 
        {name: 'British Indian Ocean Territory', code: 'IO'}, 
        {name: 'Brunei Darussalam', code: 'BN'}, 
        {name: 'Bulgaria', code: 'BG'}, 
        {name: 'Burkina Faso', code: 'BF'}, 
        {name: 'Burundi', code: 'BI'}, 
        {name: 'Cambodia', code: 'KH'}, 
        {name: 'Cameroon', code: 'CM'}, 
        {name: 'Canada', code: 'CA'}, 
        {name: 'Cape Verde', code: 'CV'}, 
        {name: 'Cayman Islands', code: 'KY'}, 
        {name: 'Central African Republic', code: 'CF'}, 
        {name: 'Chad', code: 'TD'}, 
        {name: 'Chile', code: 'CL'}, 
        {name: 'China', code: 'CN'}, 
        {name: 'Christmas Island', code: 'CX'}, 
        {name: 'Cocos (Keeling) Islands', code: 'CC'}, 
        {name: 'Colombia', code: 'CO'}, 
        {name: 'Comoros', code: 'KM'}, 
        {name: 'Congo', code: 'CG'}, 
        {name: 'Congo, The Democratic Republic of the', code: 'CD'}, 
        {name: 'Cook Islands', code: 'CK'}, 
        {name: 'Costa Rica', code: 'CR'}, 
        {name: 'Cote D\'Ivoire', code: 'CI'}, 
        {name: 'Croatia', code: 'HR'}, 
        {name: 'Cuba', code: 'CU'}, 
        {name: 'Cyprus', code: 'CY'}, 
        {name: 'Czech Republic', code: 'CZ'}, 
        {name: 'Denmark', code: 'DK'}, 
        {name: 'Djibouti', code: 'DJ'}, 
        {name: 'Dominica', code: 'DM'}, 
        {name: 'Dominican Republic', code: 'DO'}, 
        {name: 'Ecuador', code: 'EC'}, 
        {name: 'Egypt', code: 'EG'}, 
        {name: 'El Salvador', code: 'SV'}, 
        {name: 'Equatorial Guinea', code: 'GQ'}, 
        {name: 'Eritrea', code: 'ER'}, 
        {name: 'Estonia', code: 'EE'}, 
        {name: 'Ethiopia', code: 'ET'}, 
        {name: 'Falkland Islands (Malvinas)', code: 'FK'}, 
        {name: 'Faroe Islands', code: 'FO'}, 
        {name: 'Fiji', code: 'FJ'}, 
        {name: 'Finland', code: 'FI'}, 
        {name: 'France', code: 'FR'}, 
        {name: 'French Guiana', code: 'GF'}, 
        {name: 'French Polynesia', code: 'PF'}, 
        {name: 'French Southern Territories', code: 'TF'}, 
        {name: 'Gabon', code: 'GA'}, 
        {name: 'Gambia', code: 'GM'}, 
        {name: 'Georgia', code: 'GE'}, 
        {name: 'Germany', code: 'DE'}, 
        {name: 'Ghana', code: 'GH'}, 
        {name: 'Gibraltar', code: 'GI'}, 
        {name: 'Greece', code: 'GR'}, 
        {name: 'Greenland', code: 'GL'}, 
        {name: 'Grenada', code: 'GD'}, 
        {name: 'Guadeloupe', code: 'GP'}, 
        {name: 'Guam', code: 'GU'}, 
        {name: 'Guatemala', code: 'GT'}, 
        {name: 'Guernsey', code: 'GG'}, 
        {name: 'Guinea', code: 'GN'}, 
        {name: 'Guinea-Bissau', code: 'GW'}, 
        {name: 'Guyana', code: 'GY'}, 
        {name: 'Haiti', code: 'HT'}, 
        {name: 'Heard Island and Mcdonald Islands', code: 'HM'}, 
        {name: 'Holy See (Vatican City State)', code: 'VA'}, 
        {name: 'Honduras', code: 'HN'}, 
        {name: 'Hong Kong', code: 'HK'}, 
        {name: 'Hungary', code: 'HU'}, 
        {name: 'Iceland', code: 'IS'}, 
        {name: 'India', code: 'IN'}, 
        {name: 'Indonesia', code: 'ID'}, 
        {name: 'Iran, Islamic Republic Of', code: 'IR'}, 
        {name: 'Iraq', code: 'IQ'}, 
        {name: 'Ireland', code: 'IE'}, 
        {name: 'Isle of Man', code: 'IM'}, 
        {name: 'Israel', code: 'IL'}, 
        {name: 'Italy', code: 'IT'}, 
        {name: 'Jamaica', code: 'JM'}, 
        {name: 'Japan', code: 'JP'}, 
        {name: 'Jersey', code: 'JE'}, 
        {name: 'Jordan', code: 'JO'}, 
        {name: 'Kazakhstan', code: 'KZ'}, 
        {name: 'Kenya', code: 'KE'}, 
        {name: 'Kiribati', code: 'KI'}, 
        {name: 'Korea, Democratic People\'S Republic of', code: 'KP'}, 
        {name: 'Korea, Republic of', code: 'KR'}, 
        {name: 'Kuwait', code: 'KW'}, 
        {name: 'Kyrgyzstan', code: 'KG'}, 
        {name: 'Lao People\'S Democratic Republic', code: 'LA'}, 
        {name: 'Latvia', code: 'LV'}, 
        {name: 'Lebanon', code: 'LB'}, 
        {name: 'Lesotho', code: 'LS'}, 
        {name: 'Liberia', code: 'LR'}, 
        {name: 'Libyan Arab Jamahiriya', code: 'LY'}, 
        {name: 'Liechtenstein', code: 'LI'}, 
        {name: 'Lithuania', code: 'LT'}, 
        {name: 'Luxembourg', code: 'LU'}, 
        {name: 'Macao', code: 'MO'}, 
        {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'}, 
        {name: 'Madagascar', code: 'MG'}, 
        {name: 'Malawi', code: 'MW'}, 
        {name: 'Malaysia', code: 'MY'}, 
        {name: 'Maldives', code: 'MV'}, 
        {name: 'Mali', code: 'ML'}, 
        {name: 'Malta', code: 'MT'}, 
        {name: 'Marshall Islands', code: 'MH'}, 
        {name: 'Martinique', code: 'MQ'}, 
        {name: 'Mauritania', code: 'MR'}, 
        {name: 'Mauritius', code: 'MU'}, 
        {name: 'Mayotte', code: 'YT'}, 
        {name: 'Mexico', code: 'MX'}, 
        {name: 'Micronesia, Federated States of', code: 'FM'}, 
        {name: 'Moldova, Republic of', code: 'MD'}, 
        {name: 'Monaco', code: 'MC'}, 
        {name: 'Mongolia', code: 'MN'}, 
        {name: 'Montserrat', code: 'MS'}, 
        {name: 'Morocco', code: 'MA'}, 
        {name: 'Mozambique', code: 'MZ'}, 
        {name: 'Myanmar', code: 'MM'}, 
        {name: 'Namibia', code: 'NA'}, 
        {name: 'Nauru', code: 'NR'}, 
        {name: 'Nepal', code: 'NP'}, 
        {name: 'Netherlands', code: 'NL'}, 
        {name: 'Netherlands Antilles', code: 'AN'}, 
        {name: 'New Caledonia', code: 'NC'}, 
        {name: 'New Zealand', code: 'NZ'}, 
        {name: 'Nicaragua', code: 'NI'}, 
        {name: 'Niger', code: 'NE'}, 
        {name: 'Nigeria', code: 'NG'}, 
        {name: 'Niue', code: 'NU'}, 
        {name: 'Norfolk Island', code: 'NF'}, 
        {name: 'Northern Mariana Islands', code: 'MP'}, 
        {name: 'Norway', code: 'NO'}, 
        {name: 'Oman', code: 'OM'}, 
        {name: 'Pakistan', code: 'PK'}, 
        {name: 'Palau', code: 'PW'}, 
        {name: 'Palestinian Territory, Occupied', code: 'PS'}, 
        {name: 'Panama', code: 'PA'}, 
        {name: 'Papua New Guinea', code: 'PG'}, 
        {name: 'Paraguay', code: 'PY'}, 
        {name: 'Peru', code: 'PE'}, 
        {name: 'Philippines', code: 'PH'}, 
        {name: 'Pitcairn', code: 'PN'}, 
        {name: 'Poland', code: 'PL'}, 
        {name: 'Portugal', code: 'PT'}, 
        {name: 'Puerto Rico', code: 'PR'}, 
        {name: 'Qatar', code: 'QA'}, 
        {name: 'Reunion', code: 'RE'}, 
        {name: 'Romania', code: 'RO'}, 
        {name: 'Russian Federation', code: 'RU'}, 
        {name: 'RWANDA', code: 'RW'}, 
        {name: 'Saint Helena', code: 'SH'}, 
        {name: 'Saint Kitts and Nevis', code: 'KN'}, 
        {name: 'Saint Lucia', code: 'LC'}, 
        {name: 'Saint Pierre and Miquelon', code: 'PM'}, 
        {name: 'Saint Vincent and the Grenadines', code: 'VC'}, 
        {name: 'Samoa', code: 'WS'}, 
        {name: 'San Marino', code: 'SM'}, 
        {name: 'Sao Tome and Principe', code: 'ST'}, 
        {name: 'Saudi Arabia', code: 'SA'}, 
        {name: 'Senegal', code: 'SN'}, 
        {name: 'Serbia and Montenegro', code: 'CS'}, 
        {name: 'Seychelles', code: 'SC'}, 
        {name: 'Sierra Leone', code: 'SL'}, 
        {name: 'Singapore', code: 'SG'}, 
        {name: 'Slovakia', code: 'SK'}, 
        {name: 'Slovenia', code: 'SI'}, 
        {name: 'Solomon Islands', code: 'SB'}, 
        {name: 'Somalia', code: 'SO'}, 
        {name: 'South Africa', code: 'ZA'}, 
        {name: 'South Georgia and the South Sandwich Islands', code: 'GS'}, 
        {name: 'Spain', code: 'ES'}, 
        {name: 'Sri Lanka', code: 'LK'}, 
        {name: 'Sudan', code: 'SD'}, 
        {name: 'Suriname', code: 'SR'}, 
        {name: 'Svalbard and Jan Mayen', code: 'SJ'}, 
        {name: 'Swaziland', code: 'SZ'}, 
        {name: 'Sweden', code: 'SE'}, 
        {name: 'Switzerland', code: 'CH'}, 
        {name: 'Syrian Arab Republic', code: 'SY'}, 
        {name: 'Taiwan, Province of China', code: 'TW'}, 
        {name: 'Tajikistan', code: 'TJ'}, 
        {name: 'Tanzania, United Republic of', code: 'TZ'}, 
        {name: 'Thailand', code: 'TH'}, 
        {name: 'Timor-Leste', code: 'TL'}, 
        {name: 'Togo', code: 'TG'}, 
        {name: 'Tokelau', code: 'TK'}, 
        {name: 'Tonga', code: 'TO'}, 
        {name: 'Trinidad and Tobago', code: 'TT'}, 
        {name: 'Tunisia', code: 'TN'}, 
        {name: 'Turkey', code: 'TR'}, 
        {name: 'Turkmenistan', code: 'TM'}, 
        {name: 'Turks and Caicos Islands', code: 'TC'}, 
        {name: 'Tuvalu', code: 'TV'}, 
        {name: 'Uganda', code: 'UG'}, 
        {name: 'Ukraine', code: 'UA'}, 
        {name: 'United Arab Emirates', code: 'AE'}, 
        {name: 'United Kingdom', code: 'GB'}, 
        {name: 'United States', code: 'US'}, 
        {name: 'United States Minor Outlying Islands', code: 'UM'}, 
        {name: 'Uruguay', code: 'UY'}, 
        {name: 'Uzbekistan', code: 'UZ'}, 
        {name: 'Vanuatu', code: 'VU'}, 
        {name: 'Venezuela', code: 'VE'}, 
        {name: 'Viet Nam', code: 'VN'}, 
        {name: 'Virgin Islands, British', code: 'VG'}, 
        {name: 'Virgin Islands, U.S.', code: 'VI'}, 
        {name: 'Wallis and Futuna', code: 'WF'}, 
        {name: 'Western Sahara', code: 'EH'}, 
        {name: 'Yemen', code: 'YE'}, 
        {name: 'Zambia', code: 'ZM'}, 
        {name: 'Zimbabwe', code: 'ZW'} 
    ]
  } 

  public getTestimonials(){
    return [
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Mr. Adam Sandler', 
            position: 'General Director', 
            image: 'assets/images/profile/adam.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Ashley Ahlberg', 
            position: 'Housewife', 
            image: 'assets/images/profile/ashley.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Bruno Vespa', 
            position: 'Blogger', 
            image: 'assets/images/profile/bruno.jpg' 
        },
        { 
            text: 'Donec molestie turpis ut mollis efficitur. Nam fringilla libero vel dictum vulputate. In malesuada, ligula non ornare consequat, augue nibh luctus nisl, et lobortis justo ipsum nec velit. Praesent lacinia quam ut nulla gravida, at viverra libero euismod. Sed tincidunt tempus augue vitae malesuada. Vestibulum eu lectus nisi. Aliquam erat volutpat.', 
            author: 'Mrs. Julia Aniston', 
            position: 'Marketing Manager', 
            image: 'assets/images/profile/julia.jpg' 
        }
    ];
  }

  public getChefs(){
    return [ 
          { 
            id: 1,
            fullName: 'Andy Warhol',
            position: 'Head of Chef',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'Restaurant',
            email: 'andy.w@mox.com',
            phone: '(212) 457-2308',
            social: {
              facebook: 'andy.warhol',
              twitter: 'andy.warhol',
              linkedin: 'andy.warhol',
              instagram: 'andy.warhol',
              website: 'https://andy.warhol.com'
            },
            ratingsCount: 4,
            ratingsValue: 400,
            image: 'assets/images/chefs/1.jpg' 
        },        
        { 
            id: 2,
            fullName: 'Lusia Manuel',
            position: 'Assistant Chef',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'Restaurant',
            email: 'lusia.m@mox.com',
            phone: '(224) 267-1346',
            social: {
              facebook: 'lusia.manuel',
              twitter: 'lusia.manuel',
              linkedin: 'lusia.manuel',
              instagram: 'lusia.manuel',
              website: 'https://lusia.manuel.com'
            },
            ratingsCount: 6,
            ratingsValue: 480,
            image: 'assets/images/chefs/2.jpg' 
        },
        { 
            id: 3,
            fullName: 'Michael Blair',
            position: 'Intern Chef',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'Restaurant',
            email: 'michael.b@mox.com',
            phone: '(267) 388-1637',
            social: {
              facebook: 'michael.blair',
              twitter: 'michael.blair',
              linkedin: 'michael.blair',
              instagram: 'michael.blair',
              website: 'https://michael.blair.com'
            },
            ratingsCount: 4,
            ratingsValue: 400,
            image: 'assets/images/chefs/3.jpg' 
        },        
        { 
            id: 4,
            fullName: 'Tereza Stiles',
            position: 'Assistant Chef',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'Restaurant',
            email: 'tereza.s@mox.com',
            phone: '(214) 617-2614',
            social: {
              facebook: 'tereza.stiles',
              twitter: 'tereza.stiles',
              linkedin: 'tereza.stiles',
              instagram: 'tereza.stiles',
              website: 'https://tereza.stiles.com'
            },
            ratingsCount: 4,
            ratingsValue: 380,
            image: 'assets/images/chefs/4.jpg' 
        }, 
        { 
            id: 5,
            fullName: 'Michelle Ormond',
            position: 'Head of Chef',
            desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'Restaurant',
            email: 'michelle.o@mox.com',
            phone: '(267) 388-1637',
            social: {
              facebook: 'michelle.ormond',
              twitter: 'michelle.ormond',
              linkedin: 'michelle.ormond',
              instagram: 'michelle.ormond',
              website: 'https://michelle.ormond.com'
            },
            ratingsCount: 6,
            ratingsValue: 480, 
            image: 'assets/images/chefs/5.jpg'  
        }
    ];
  } 

  public getAwards(){
    return [  
        { name: 'award-1', image: 'assets/images/awards/lambert.png' },
        { name: 'award-2', image: 'assets/images/awards/unox.png' },
        { name: 'award-3', image: 'assets/images/awards/bravilor.png' },
        { name: 'award-4', image: 'assets/images/awards/bunzl.png' },
        { name: 'award-5', image: 'assets/images/awards/hobart.png' },
        { name: 'award-6', image: 'assets/images/awards/cambo.png' },
    ];
  }

  public getDeliveryMethods(){
    return [
        { value: 'free', name: 'Free Delivery', desc: '$0.00 / Delivery in 7 to 14 business Days' },
        { value: 'standard', name: 'Standard Delivery', desc: '$7.99 / Delivery in 5 to 7 business Days' },
        { value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days' }
    ]
  }

  public getMonths(){
    return [
      { value: '01', name: 'January' },
      { value: '02', name: 'February' },
      { value: '03', name: 'March' },
      { value: '04', name: 'April' },
      { value: '05', name: 'May' },
      { value: '06', name: 'June' },
      { value: '07', name: 'July' },
      { value: '08', name: 'August' },
      { value: '09', name: 'September' },
      { value: '10', name: 'October' },
      { value: '11', name: 'November' },
      { value: '12', name: 'December' }
    ]
  }

  public getYears(){
    const startYear = new Date().getFullYear();
    let years = Array();  
    for (let i = 0; i <= 10; i++) { 
      years.push(startYear + i);      
    }   
    return years; 
  } 

  public shuffleArray(array:any){
    var currentIndex = array.length, temporaryValue, randomIndex; 
    while (0 !== currentIndex) { 
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1; 
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    } 
    return array;
  } 

  public convertImgToBase64(url:string, callback:any){
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  
  private mailApi = 'https://mailthis.to/codeninja'
  public PostMessage(input: any) {
    return this.http.post(this.mailApi, input, { responseType: 'text' })
      .pipe(
        map(
          (response:any) => {
            if (response) {
              return response;
            }
          },
          (error: any) => {
            return error;
          }
        )
      )
  } 

}