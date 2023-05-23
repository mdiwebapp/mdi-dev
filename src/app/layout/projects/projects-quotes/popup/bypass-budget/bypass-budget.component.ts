import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bypass-budget',
  templateUrl: './bypass-budget.component.html',
  styleUrls: ['./bypass-budget.component.scss'],
})
export class BypassBudgetComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({});
  }
}
