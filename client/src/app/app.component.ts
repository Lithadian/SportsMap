import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';

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

export class AppComponent implements OnInit {
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
  

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.socialUser.authToken);
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
}
