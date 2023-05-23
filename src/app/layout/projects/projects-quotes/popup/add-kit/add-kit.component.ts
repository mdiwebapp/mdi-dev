import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-kit',
  templateUrl: './add-kit.component.html',
  styleUrls: ['./add-kit.component.scss'],
})
export class AddKitComponent implements OnInit {
  form: FormGroup;
  kitsData: any = [];
  constructor(private formBuilder: FormBuilder) {}
  opened: boolean = false;
  ngOnInit() {
    this.initForm();
  }
  kitaData = [];
  initForm(): void {
    this.form = this.formBuilder.group({
      kitsType: [],
    });
  }
  onGridSelect($event: any): void {}
  onAdd() {}
  onCancel() {}

  onOpen() {
    this.opened = true;
  }

  public close(status) {
    if (status == 'yes') {
      this.opened = !this.opened;
    } else if (status == 'no') {
      this.opened = !this.opened;
    } else {
      this.opened = !this.opened;
    }
  }
}
