import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import { CurrentUserModel } from 'src/app/core/models/current-user';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-twofactor-auth',
  templateUrl: './twofactor-auth.component.html',
  styleUrls: ['./twofactor-auth.component.scss']
})
export class TwofactorAuthComponent implements OnInit {
  public loginForm: FormGroup;
  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private utility: UtilityService,
    public storageService: StorageService) { }

  ngOnInit(): void {
    const token = this.storageService.Token;
    if (token) this.router.navigate(['/']);
    this.setLoginForm();
  }
  setLoginForm() {
    const emailCookie = '';
    const passwordCookie = '';  
     
    this.loginForm = this.formBuilder.group({
      email: [emailCookie, Validators.required],
      password: [
        passwordCookie,
        [Validators.required, Validators.minLength(1)],
      ],
      rememberMe: this.rememberMe,
    });
  }
  onLogin() {}
}
