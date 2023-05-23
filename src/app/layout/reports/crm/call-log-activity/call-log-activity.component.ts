import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { DatePipe } from '@angular/common';
import * as fileSaver from 'file-saver';
import {CallLogActivityService} from './call-log-activity.service';
@Component({
  selector: 'app-call-log-activity',
  templateUrl: './call-log-activity.component.html',
  styleUrls: ['./call-log-activity.component.scss'],
})
export class CallLogActivityComponent implements OnInit {
  callLogActivityForm: FormGroup;

  branches: any = [];
  tempBranches: any = [];
  employees: any = [];
  tempEmployees: any = [];
  customer: any = [];
  tempCustomer: any = [];
  opened: boolean = false;
  constructor(private formBuilder: FormBuilder,public dropdownaService: DropdownService,public service: CallLogActivityService,
    public branchService: BranchService,public datepipe: DatePipe) {}

  ngOnInit(): void {this.onInitForm();
   this.getEmployee();this.GetBranch();this.getCustomerType(); 
  }
  onInitForm() {
    this.callLogActivityForm = this.formBuilder.group({
      dataRange: '',
      fromDate: moment().toDate(),
      toDate: moment().add(3, 'days').toDate(),
      branches:'All' ,
      employees:  'All' ,
      customer: 'All' ,
      last_7days: '',
      inPerson:true
    });
  }
  getEmployee() {
    this.dropdownaService.GetEmployee().subscribe(
      (res) => {   
          this.employees = res.result;     
          this.tempEmployees = res.result;     
          this.employees.unshift({id:'All',value:'All'});
          
      }
    ) 
  }
  getCustomerType() {
    this.dropdownaService.GetLookupList('CRMCustomerType').subscribe(
      (res) => {         
          this.customer = res;     
          this.tempCustomer = res;     
          this.customer.unshift({id:'All',value:'All'});
           
      }
    ) 
  }
  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => { 
          this.branches = res;  
          this.tempBranches = res;  
          this.branches.unshift({code: "All", id: 'All', value: "All"});
           
      }       
    );
  }
  onReportTypeChange(event) {}

  onSelectionChange(type, value) {
    switch (type) {
      case 'last_7_days':
        this.callLogActivityForm.setValue({
          ...this.callLogActivityForm.value,
          last_7days: value.name,
        });
    }
  }

  onHandleOperation(value) {
    switch (value) {
      case 'last_7_days':
        break;
      default:
        break;
    }
  }

  onDateRangeChnage(event) {
    if (event.target.value === '7_days') {
      this.callLogActivityForm.setValue({
        ...this.callLogActivityForm.value,
        fromDate: moment().subtract(7, 'days').toDate(),
        toDate: moment().toDate(),
      });
    } else if (event.target.value === '30_days') {
      this.callLogActivityForm.setValue({
        ...this.callLogActivityForm.value,
        fromDate: moment().subtract(30, 'days').toDate(),
        toDate: moment().toDate(),
      });
    }
  }
  getReport(){
    if (this.callLogActivityForm.invalid) {
      this.callLogActivityForm.markAllAsTouched();
      return false;
    }
    var obj ={
      startDate:this.datepipe.transform(this.callLogActivityForm.value.fromDate, 'MM/dd/yyyy'),
      endDate: this.datepipe.transform(this.callLogActivityForm.value.toDate, 'MM/dd/yyyy'),
      employeeNumber: this.callLogActivityForm.value.employees??'All',
      branch:this.callLogActivityForm.value.branches??'All',
      inPerson:this.callLogActivityForm.value.inPerson,
      customerType:this.callLogActivityForm.value.customer??'All'
    } 
    
    this.service.getDataList(obj).subscribe(
      (res) => {          
        if(res.size > 8176 && res.size > 0 && res != null) 
        {
          let data = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          });
          fileSaver.saveAs(data, 'CallLogActivityReport.xlsx');
        }
        else
        {
          this.opened = true;
        }

      }
    ) 
  }
  branchFilter(value) {
    this.branches = this.tempBranches.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  employeeFilter(value) {
    this.employees = this.tempEmployees.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  customerFilter(value) {
    this.customer = this.tempCustomer.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  openPopup() {
    this.opened = !this.opened;
  }
}
