import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-proposal-templates',
  templateUrl: './proposal-templates.component.html',
  styleUrls: ['./proposal-templates.component.scss'],
})
export class ProposalTemplatesComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({});
  }
}
