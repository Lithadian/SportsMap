import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  styleUrls: [
    './app.component.css',
    './css/home.css',
    './css/map.css',
    './css/events.css',
    './css/administer.css',
    './css/connect.css',
    './css/event-admin.css',
    './css/user-admin.css',
    './css/system-admin.css',
    './css/profile.css'
  ]
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
  isAdminister: boolean;
  isUserAdminPage: boolean;
  isEventAdminPage: boolean;
  isSystemAdminPage: boolean;
  isProfile: boolean;
  isConnectPage: boolean;
  userRole:any;
  userProfile:any;

  title = 'The Sports Map';
  userInfo: userInfo;
  users: any;
  events:any;
  Event:Event;
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };  
  constructor(private http: HttpClient, 
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,private zone:NgZone){
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
  createEventForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl(''),
    type: new FormControl(''),
    usersMaxCount: new FormControl(''),
    placeCoordX: new FormControl(''),
    placeCoordY: new FormControl(''),
    description: new FormControl(''),
  });
  userProfileForm = new FormGroup({
    username: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    userDescription: new FormControl(''),
  });
  createEvent() {
    this.Event={
    Name : this.createEventForm.value.name,
    Date : this.createEventForm.value.date,
    Type : this.createEventForm.value.type,
    EventStatus : 1,
    UsersMaxCount : this.createEventForm.value.usersMaxCount,
    PlaceCoordX : this.createEventForm.value.placeCoordX,
    PlaceCoordY : this.createEventForm.value.placeCoordY,
    Description : this.createEventForm.value.description,
    EventAuthor : this.userInfo.UserId,
    };
    //todo:create validation function for values
    this.CreateEventPost();
  }
  updateProfile(){
    if(this.userProfileForm.value.name.length>0) this.userProfile.name= this.userProfileForm.value.name;
    if(this.userProfileForm.value.username.length>0) this.userProfile.username= this.userProfileForm.value.username;
    if(this.userProfileForm.value.surname.length>0) this.userProfile.surname= this.userProfileForm.value.surname;
    if(this.userProfileForm.value.email.length>0) this.userProfile.email= this.userProfileForm.value.email;
    if(this.userProfileForm.value.userDescription.length>0)this.userProfile.userDescription= this.userProfileForm.value.userDescription; 
    this.updateUserProfile();
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
    if(this.isLoggedin)
    this.userInfo={
      UserId :this.socialUser.id,
      Name: this.socialUser.firstName,
      Surname: this.socialUser.lastName,
      Email: this.socialUser.email
    };

  };
  logOut(): void {
    this.socialAuthService.signOut();
    this.userRole = null;
  };
  
  getUsers(){
    this.http.get('https://localhost:5001/api/User/GetUserlist').subscribe(response => {
      this.users = response;
    }, error=>{
      console.log(error);
    })
  };
  getUserProfile(){
    const headers = new HttpHeaders().append('header', 'value');
    const params = new HttpParams().append('userId', this.userInfo.UserId);
    this.http.get('https://localhost:5001/api/User/GetUserInfo',{headers, params}).subscribe(response => {
      this.userProfile = response;
      console.log(this.userProfile);
      console.log(this.userProfile.userDescription);
    }, error=>{
      console.log(error);
    })
  };
  updateUserProfile(){
    this.http.post('https://localhost:5001/api/User/UpdateUser',this.userProfile,this.httpOptions).subscribe(response => {
    }, error=>{
      console.log(error);
    })  
  };
  loginUser(){
    this.http.post('https://localhost:5001/api/User/LoginUser',this.userInfo,this.httpOptions).subscribe(response => {
      if(response ==1 || response == 2){
        this.userRole = response;
      }
      else if(response = "User Created") {
        this.userRole = 1;
      }
    }, error=>{
      console.log(error);
    })
  };
  CreateEventPost(){

      this.http.post('https://localhost:5001/api/Event/CreateEvent',this.Event,this.httpOptions).subscribe(response => {
        this.getEventList();
      }, error=>{
        console.log(error);
      })    
  };
  getEventList(){
    this.zone.run(() => {
      this.events = this.events || [];
    this.http.get('https://localhost:5001/api/Event/GetEventList').subscribe(response => {
      this.events = response;
    }, error=>{
      console.log(error);
    })
  });
  };
  removeT(input: string) {
    return input.replace('T', ' ');
  };
  //Page navigation
  toHomePage(){
    this.isHomePage=true; 
    this.isMapPage=false;
    this.isEventsPage = false;
    this.isAdminister=false;
    this.isUserAdminPage=false;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=false;
    this.isProfile=false;
    this.isConnectPage=false;
  }
  toMapPage(){
    this.isHomePage=false; 
    this.isMapPage=true;
    this.isEventsPage = false;
    this.isAdminister=false;
    this.isUserAdminPage=false;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=false;
    this.isProfile=false;
    this.isConnectPage=false;
  }
  toEventsPage(){
    this.isHomePage=false; 
    this.isMapPage=false;
    this.isEventsPage = true;
    this.isAdminister=false;
    this.isUserAdminPage=false;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=false;
    this.isProfile=false;
    this.isConnectPage=false;
  }
  toAdminister(){
    this.isHomePage=false;
    this.isMapPage=false;
    this.isEventsPage=false;
    this.isAdminister=true;
    this.isUserAdminPage=false;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=false;
    this.isProfile=false;
    this.isConnectPage=false;
  }
  toUserAdminPage(){
    this.isHomePage=false;
    this.isMapPage=false;
    this.isEventsPage=false;
    this.isAdminister=false;
    this.isUserAdminPage=true;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=false;
    this.isProfile=false;
    this.isConnectPage=false;
  }
  toEventAdminPage(){
    this.isHomePage=false;
    this.isMapPage=false;
    this.isEventsPage=false;
    this.isAdminister=false;
    this.isUserAdminPage=false;
    this.isEventAdminPage=true;
    this.isSystemAdminPage=false;
    this.isProfile=false;
    this.isConnectPage=false;
  }
  toSystemAdminPage(){
    this.isHomePage=false;
    this.isMapPage=false;
    this.isEventsPage=false;
    this.isAdminister=false;
    this.isUserAdminPage=false;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=true;
    this.isProfile=false;
    this.isConnectPage=false;
  }
  toProfile(){
    this.isHomePage=false;
    this.isMapPage=false;
    this.isEventsPage=false;
    this.isAdminister=false;
    this.isUserAdminPage=false;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=false;
    this.isProfile=true;
    this.isConnectPage=false;
  }
  toConnectPage(){
    this.isHomePage=false;
    this.isMapPage=false;
    this.isEventsPage=false;
    this.isAdminister=false;
    this.isUserAdminPage=false;
    this.isEventAdminPage=false;
    this.isSystemAdminPage=false;
    this.isProfile=false;
    this.isConnectPage=true;
  }
  // map page functions
  showOnMap() {
  }
  toEventDescription() {
  }
}

