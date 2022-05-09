import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
declare const google: any;
class userInfo{
  id:string;
  firstName:string;
  lastName:string;
  email:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  //map
  @ViewChild('mapElement') mapElement:any;



  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean;
  title = 'The Sports Map';
  userInfo: userInfo;
  users: any;
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };
  constructor(private http: HttpClient, 
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService){}
  ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center:{ lat: 56.946, lng: 24.10589},
      zoom: 8,
    });
    var locations = [
      ['Bondi Beach',  56.946, 24.10589, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];
    var i;
    for (i = 0; i < locations.length; i++) {  
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        draggable: false,
        map: this.map,
        title: locations[i][0]
      });}
  }
  

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.socialUser.authToken);
      console.log(user);
      this.setUserInfo();
      this.loginUser();
    }); 
    this.getUsers();
     
  };
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  };
  setUserInfo(): void{
    this.userInfo={
      id :this.socialUser.id,
      firstName: this.socialUser.firstName,
      lastName: this.socialUser.lastName,
      email: this.socialUser.email
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
  map:any;

}
