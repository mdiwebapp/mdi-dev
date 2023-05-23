import { Component, OnInit } from '@angular/core';
import { groupBy, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { UtilityService } from 'src/app/core/services/utility.service';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeCertificateService } from './employee-certificate.service';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-certificate',
  templateUrl: './employee-certificate.component.html',
  styleUrls: ['./employee-certificate.component.scss'],
})
export class EmployeeCertificateComponent implements OnInit {
  certificate: any;
  certificateFilter: any;
  employeeId: any;
  ngOnInit() {}
  disable:boolean=true;
  public groups: GroupDescriptor[] = [{ field: "group" }];

  constructor(
    public employeeservice: EmployeeService,
    public employeeCertService: EmployeeCertificateService,
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService,
    public datepipe: DatePipe
  ) {}
  isEdit: boolean = true;

  public data: any[];
  public sort: SortDescriptor[] = [
    {
      field: 'type',
      dir: 'asc',
    },
    {
      field: 'name',
      dir: 'asc',
    },
  ];
  btnAdd(){
    console.log("data",this.data)
    this.data = null
    this.disable = true;
  }
  btnEditClick(){
    this.disable = false;
  }
  btnCancel(){
    this.disable = true;
  }
  GetCertificate(id) {
    this.employeeId = id;
    //this.employeeCertService.GetCertifictes(id).subscribe(
    this.employeeCertService.GetCertificteHeader().subscribe(
      (res) => { this.data = [];
        if (res) {
          //this.data = groupBy(res, this.groups);
          this.certificateFilter = res;
          this.employeeCertService.GetCertifictes(id).subscribe((data) => {
            data.forEach(element => {
             var certi = res.find(c=> c.id == element.id);
             if(certi){
              certi.date = element.certificateDate;
              certi.hasMultiple = element.hasMultiple;
             }
              
            });
            var dl = data;
           
          });
          this.data = groupBy(res, this.groups);
        } else {
          this.data = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_certificates);
      }
    );
  }
  DateChange(data: any) {
    
    
    var obj ={
      "id": data.id,
      "employeeId": this.employeeId,
      "certification": data.certification,
      "description": data.description,
      "group": data.group,
      "dateType": data.dateType,
      "date":this.datepipe.transform(
       new Date(),
        'MM/dd/yyyy'
      ),
      "hasMultiple": true
    }
    this.employeeCertService.SaveCertificates(obj).subscribe(
      (res) => {
        if (res) {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
           
            this.GetCertificate(this.employeeId);
            // this.data
            //   .find((x) => x.certification == data.group)
            //   .child.find((x) => x.certification == data.certification).id =
            //   res['result']['employeeCertificateId'];
            // return false;
          }
        } else {
          this.data = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.save_certificates);
      }
    );
  }

  DeleteCertificate(data, bool) {
    if (data.id <= 0) return;
    this.employeeCertService.DeleteCertificates(data.id).subscribe(
      (res) => {
        if (res) {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            this.data
              .find((x) => x.certification == data.group)
              .child.find((x) => x.certification == data.certification).id = 0;

            return false;
          }
        } else {
          this.data = [];
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.delete_certificates);
      }
    );
  }

  DateConvert(date) {
    if (date != null) return new Date(date);
    else return null;
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.employee_certificate,
      customMessage
    );
  }
}
