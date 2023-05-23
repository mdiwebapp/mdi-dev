import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { VendorInfoModel } from '../../vendor/vendor-info/vendor-info.model';
import { VendorInfoService } from '../../vendor/vendor-info/vendor-info.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  form: FormGroup;
  data: any;
  VendorType: any;
  public skip = 0;
  multiple: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public service: VendorInfoService,
    private utils: UtilityService,
    public dropdownservice: DropdownService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  public sort: SortDescriptor[] = [
    {
      field: 'vendorName',
      dir: 'asc',
    },
  ];
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
      inactive: [false],
    });
  }
}
