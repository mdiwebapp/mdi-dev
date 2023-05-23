import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import { CurrentUserModel } from 'src/app/core/models/current-user';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from '../auth.service';
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/map";
import { HttpClient } from '@angular/common/http';
// import getMAC, { isMAC } from 'getmac';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public otpForm: FormGroup;
  //public contactForm: FormGroup;
  countdown: number = 0;


  rememberMe: boolean = false;
  isLogin: boolean;
  isOtpSend: boolean = false;
  is2FA: boolean = false;
  isContact: boolean = false;
  id: number = 0;
  ipAddress: string;
  latitude: string;
  longitude: string;
  returnUrl: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utility: UtilityService, private http: HttpClient,
    public storageService: StorageService,

  ) { }

  ngOnInit(): void {
    this.utility.storage.clear();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    //http://api.ipify.org/?format=json
    this.http.get("https://geolocation-db.com/json/").subscribe((res: any) => {

      this.ipAddress = res.IPv4;
      this.latitude = res.latitude;
      this.longitude = res.longitude;
    });

    if (this.isLogin == undefined)
      this.isLogin = true;
    const token = this.storageService.Token;
    if (token)
      this.router.navigate(['/']);
    else {
      var user = JSON.parse(this.utility.storage.getItem("currentUser"));
      if (user) {
        if (user.otpSent == true && user.require2FA == true) {
          this.id = user.id;
          this.isLogin = false;
          this.isOtpSend = true;
          //this.startCountdownTimer();
        }
      }
    }

    this.setLoginForm();
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required],
    });
    // this.contactForm = this.formBuilder.group({
    //   id: [0],
    //   email: [''],
    //   phoneNumber: [''],
    // });

  }
  startCountdownTimer() {
    const interval = 1000;
    const duration = 10 * 3000;
    const stream$ = Observable.timer(0, interval)
      .finally(() => console.log("All done!"))
      .takeUntil(Observable.timer(duration + interval))
      .map(value => duration - value * interval);
    stream$.subscribe(value => this.countdown = value);
  }
  setLoginForm() {
    const emailCookie = this.getCookie('email');
    const passwordCookie = this.getCookie('password');
    const rememberMeCookie = this.getCookie('rememberMe');

    if (rememberMeCookie == 'true') {
      this.rememberMe = true;
    }
    this.loginForm = this.formBuilder.group({
      email: [emailCookie, Validators.required],
      password: [
        passwordCookie,
        [Validators.required, Validators.minLength(1)],
      ],
      rememberMe: [this.rememberMe],
      isEncrypted: [false],
      ipAddress: [0],
      macAddress: [''],
      latitude: [0],
      longitude: [0]
    });
  }

  onLogin() {
    var formValues = this.loginForm.value;
    formValues.ipAddress = this.ipAddress;
    formValues.latitude = this.latitude;
    formValues.longitude = this.longitude;

    this.authService.login(formValues).subscribe(
      (res: any) => {
        if (res['status'] == 200) {

          this.isOtpSend = res.result.otpSent;
          this.is2FA = res.result.require2FA;
          this.id = res.result.id;
          //this.utility.storage.setUserData(res['result']);
          if (this.is2FA) {
            if (this.isOtpSend) {
              this.isLogin = false;
              this.startCountdownTimer();
            } else {
              this.utility.toast.error(res['message']);
              return false;
              // this.isLogin = false;
              // this.isContact = true;
            }
            this.utility.toast.success(res['message']);
          } else {
            this.utility.toast.success(res['message']);
            this.utility.storage.setItem("typeMediator", 'no');
            this.utility.storage.setUserData(res['result']);
            this.router.navigateByUrl(this.returnUrl);
            //this.router.navigate(['/']);
          }
        } else if (res['status'] == 0) {
          this.utility.toast.error(res['message']);
        }
      },
      (error) => {
        this.utility.toast.error('User is Unauthorized');
      },
      () => { }
    );
  }

  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  private deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  private setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ''
  ) {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  submitOTP() {

    var obj = {
      "id": this.id,
      "otp": this.otpForm.value.otp,
      "ipAddress": this.ipAddress=='Not found'?0:this.ipAddress,
      "latitude": this.latitude=='Not found'?0:this.latitude,
      "longitude": this.longitude=='Not found'?0:this.longitude,
      "macAddress": ""
    }
    this.authService.verifyOTP(obj).subscribe(
      (res: any) => {

        if (res['status'] != 0) {
          this.utility.toast.success(res['message']);
          var madi = this.utility.storage.getItem("typeMediator");
          if (madi == null)
            this.utility.storage.setItem("typeMediator", 'no');
          // if (formValues.rememberMe) {
          //   this.setCookie('email', formValues.email, 365);
          //   this.setCookie('password', formValues.password, 365);
          //   this.setCookie('rememberMe', formValues.rememberMe, 365);
          // } else {
          //   this.deleteCookie('email');
          //   this.deleteCookie('password');
          //   this.deleteCookie('rememberMe');
          // }
          this.utility.storage.setUserData(res['result']);
          //this.router.navigate(['/dashboard']);
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.utility.toast.error(res['message']);
        }
      },
      (error) => {
        this.utility.toast.error('User is Unauthorized');
      },
      () => { }
    );

  }
  // updateContactInfo() {
  //   var obj = this.contactForm.value;
  //   obj.id = this.id;
  //   this.authService.updateContact(obj).subscribe(
  //     (res: any) => {
  //       if (res['status'] != 0) {
  //         this.utility.toast.success(res['message']);
  //         this.isOtpSend = true;
  //         this.isContact = false;
  //       } else {
  //         this.utility.toast.error(res['message']);
  //       }
  //     },
  //     (error) => {
  //       this.utility.toast.error('User is Unauthorized');
  //     },
  //     () => { }
  //   );
  // }
  resendOTP() {
    this.onLogin();
  }
}
