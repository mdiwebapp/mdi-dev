import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss']
})
export class MoreInfoComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) { }
  status:boolean=false;
  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      engine: ['', Validators.required],
      transmission: [''],
      length: [''],     
      width: [''],
      builtDate: [''],
      keyTag: [''],
      purchaseFrom: [''],
      actualWeight: [''],
      noOfAxles: [''],
      spacing: [''],
      rearAxleRatio: [''],
      rearGAWR: [''],
      frontGAWR: [''],
      cvwr: [''],
      gvwr: [''],
      tires:[''],
      tireBrand:[''],
      rims:[''],
      psi:[''],
      absSystem:[''],
      oilFilter:[''],
      airFilter:[''],
      fuelFilter:[''],
      utilityBoxBrand:[''],
      utilityBoxModel:[''],
      utilityBoxSN:[''],
      utilityBoxType:[''],
      fifthWheel:[''],
      trailerHitch:[''],
      pkgpurchaseFrom:[''],
      pkgkeyTag:[''],
    });
  }
}
