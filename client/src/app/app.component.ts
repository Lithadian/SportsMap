import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';


declare const google: any;
class userInfo{
  UserId:string;
  Name:string;
  Surname:string;
  Email:string;
}
class Event{
  Name:string;
  Date:Date;
  Type:string;
  EventStatus:number;
  UsersMaxCount:number;
  PlaceCoordX:number;
  PlaceCoordY:number;
  Description:string;
  EventAuthor:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./home.css','./map.css','./events.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  //map
  @ViewChild('mapElement') mapElement:any;
  @ViewChild('username') usernameElement: any;


  map:any;
  

  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean;

  isHomePage: boolean;
  isMapPage: boolean;
  isEventsPage: boolean;
  title = 'The Sports Map';
  userInfo: userInfo;
  users: any;
  events:any;
  gay:any;
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };  
  constructor(private http: HttpClient, 
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,usernameElement: ElementRef){
      this.usernameElement=usernameElement;
    }
    
  ngAfterViewInit(): void {
  }
  renderMap(){
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center:{ lat: 56.946, lng: 24.10589},
      zoom: 8,
    });
    var i;
    for (i = 0; i < this.events.length; i++) {  
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.events[i].placeCoordX, this.events[i].placeCoordY),
        draggable: false,
        map: this.map,
        title: this.events[i].name
      });}
  }
  //end Of google map implement

  
  clickme() {
    console.log('it does nothing', this.usernameElement.value);
  }
  ngOnInit() {
    
    this.isHomePage = true;
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      //if(user != null) this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.socialUser.authToken) ;
      console.log(user);
      this.setUserInfo();
    }); 
    this.getUsers();
    this.getEventList();
  };
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    // rerender after Google Auth
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
    //if(user != null) this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.socialUser.authToken) ;
    if(this.isLoggedin){
      this.setUserInfo();
      this.loginUser();
    }
    });

  };
  setUserInfo(): void{
    this.userInfo={
      UserId :this.socialUser.id,
      Name: this.socialUser.firstName,
      Surname: this.socialUser.lastName,
      Email: this.socialUser.email
    };

  };
  logOut(): void {
    this.socialAuthService.signOut();
  };
  
  getUsers(){
    this.http.get('https://localhost:5001/api/User/GetUserlist').subscribe(response => {
      this.users = response;
    }, error=>{
      console.log(error);
    })
  };
  loginUser(){
    this.http.post('https://localhost:5001/api/User/LoginUser',this.userInfo,this.httpOptions).subscribe(response => {
      console.log(response);
    }, error=>{
      console.log(error);
    })
  };
  getEventList(){
    this.http.get('https://localhost:5001/api/Event/GetEventList').subscribe(response => {
      this.events = response;
      console.log(response);
    }, error=>{
      console.log(error);
    })
  };
  //Page navigation
  toHomePage(){
    this.isHomePage=true; 
    this.isMapPage=false;
    this.isEventsPage = false;
  }
  toMapPage(){
    this.isHomePage=false; 
    this.isMapPage=true;
    this.isEventsPage = false;
  }
  toEventsPage(){
    this.isHomePage=false; 
    this.isMapPage=false;
    this.isEventsPage = true;
  }
  

}

