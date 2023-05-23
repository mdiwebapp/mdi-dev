import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public form: FormGroup
  constructor(  private formBuilder: FormBuilder,
    private authService: AuthService,
    private utility: UtilityService,
    public storageService: StorageService) { }

  ngOnInit(): void {
    this.setLoginForm();
  }

  setLoginForm() {
    this.form = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  ChangePassword() {
    const formValues = this.form.value
    this.authService.ChangePassword(formValues).subscribe((res: any) => {
      this.utility.toast.success(res["message"]);
    }, (error) => {
      this.utility.toast.error(error.error.userName)
    }, () => {

    })
  }
}
