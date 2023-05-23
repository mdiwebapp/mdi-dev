import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceOrderService } from '../../../service-order/service-order.service';
import { commentsModel, TechCheckModel } from '../techCheck.model';

@Component({
  selector: 'app-comments-techcheck',
  templateUrl: './comments-techcheck.component.html',
  styleUrls: ['./comments-techcheck.component.scss'],
})
export class CommentsTechCheckComponent implements OnInit {
  @Output() techCheckSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkAllFields: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  constructor(private formBuilder: FormBuilder, public service: ServiceOrderService) { }
  techcheckCooling: any;
  ngOnInit() {
    this.initForm();
    this.techcheckCooling = this.service.techCheckService.comments;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      comments: ['', Validators.required],
    });
  }
  onChange(value: string) {
    this.techcheckCooling.comments = value;
    this.checkAllFieldsValid();
  }
  setData(fuelIol) {
    this.form.setValue({
      comments: !this.techcheckCooling.comments ? fuelIol.comments : this.techcheckCooling.comments,
    });
  }
  onSave() { 
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    const data = new TechCheckModel();
    data.comments = new commentsModel();
    this.service.techCheckService.comments.comments = this.form.value.comments;
    this.techCheckSave.emit(data);
  }
  checkAllFieldsValid(){
    if (this.form.valid) {
      this.checkAllFields.emit(true);
    }else{this.checkAllFields.emit(false);}
  }
}
