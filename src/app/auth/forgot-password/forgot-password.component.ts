import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public form: FormGroup
  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private utility: UtilityService,
    public storageService: StorageService) { }

  ngOnInit(): void {
    this.setForm();
  }

  setForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onForgotClick() {
    const formValues = this.form.value;
    this.authService.forgot(formValues).subscribe((res: any) => {
      if (res["status"] == 200)
        this.utility.toast.success(res["message"]);
      else
        this.utility.toast.error(res["message"]);
    }, (error) => {
      this.utility.toast.error(error.error.userName)
    }, () => {

    })
  }
}
