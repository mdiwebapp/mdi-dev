import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { VendorInfoModel } from '../../vendor/vendor-info/vendor-info.model';
import { VendorInfoService } from '../../vendor/vendor-info/vendor-info.service';

@Component({
  selector: 'app-bins',
  templateUrl: './bins.component.html',
  styleUrls: ['./bins.component.scss']
})
export class BinsComponent implements OnInit {

  form: FormGroup;  
  id: number = 0;
  data: VendorInfoModel[];  
  isDisabled: boolean = true;
  VendorType = ["A", "B", "C"];
  
  constructor(private formBuilder: FormBuilder,
    public service: VendorInfoService,
    private utils: UtilityService,
    public dropdownservice: DropdownService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      vendorName: ['', Validators.required],
      vendorType: [''],
      qbNameMDI: [''],
      qbNameGPC: [''],
      address: [''],
      address2: [''],
      state: [''],
      zip: [''],
      city: [''],
      comments: [''],
      inactive: [false]
    });
  }
}
