import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-terms-n-conditions',
  templateUrl: './terms-n-conditions.component.html',
  styleUrls: ['./terms-n-conditions.component.scss'],
})
export class TermsNConditionsComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({});
  }
}
