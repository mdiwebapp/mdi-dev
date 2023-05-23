import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public form: FormGroup
  passwordresettoken: string;
  email: string;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private utility: UtilityService,
    private route: ActivatedRoute,
    private router: Router,
    public storageService: StorageService) { }

  ngOnInit(): void {
    debugger
    // this.passwordresettoken = this.route.snapshot.paramMap.get('passwordresettoken');
    // this.email = this.route.snapshot.paramMap.get('email');
    this.passwordresettoken = this.route.snapshot.queryParams["passwordresettoken"]
    this.email = this.route.snapshot.queryParams["email"];
    this.setLoginForm();
  }

  setLoginForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(20), Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{8,}')]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.checkPasswords });


  }
  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }
  resetPassword() {
    const formValues = this.form.value
    formValues.passwordResetToken = this.passwordresettoken;
    formValues.email = this.email;
    this.authService.ResetUserPassword(formValues).subscribe((res: any) => {
      if (res["status"] == 200) {
        debugger
        this.utility.toast.success(res["message"]);
        this.router.navigate(['/auth/login/'])
      }
      else {
        this.utility.toast.success(res["message"]);
      }
    }, (error) => {
      this.utility.toast.error(error.error.userName)
    }, () => {

    })
  }
}
