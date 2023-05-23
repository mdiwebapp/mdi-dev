import { Component, OnInit, Input, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectService } from './../../projects.service';
import { DropdownService } from './../../../../core/services/dropdown.service';
import { PAFUpdateRequestModel } from './../../projects.model';
import { UtilityService } from './../../../../core/services/utility.service';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-paf',
  templateUrl: './PAF.component.html',
  styleUrls: ['./PAF.component.scss'],
})
export class PAFComponent implements OnInit {
  form: FormGroup;
  public mask = '(000) 000-0000';
  displayUnicodeDrp: boolean = false;
  public taxExemptData = [
    { id: 1, value: 'YES' },
    { id: 2, value: 'NO' },
  ];
  unicodeData = [];
  stateData = [];
  jobNumber: number;
  pAfData: any = [];
  stateList = [];
  isDisabled: boolean = true;
  isSaveDisabled: boolean = true;
  isEditDisabled: boolean = false;
  pAFUpdateRequestModel = new PAFUpdateRequestModel();
  taxExempt: string;
  pipeline: boolean;
  ocip: boolean;
  mineQuarry: boolean;
  certifiedPayroll: boolean;
  prevailingWage: boolean;
  isPafComplete: boolean;
  @Input() detailJobNumber: number;
  @Output() backButtonEvent = new EventEmitter();
  constructor(private formBuilder: FormBuilder, public projectService: ProjectService, public dropdownService: DropdownService
    , public utilityService: UtilityService) { }

  ngOnInit() {
    this.initForm();
    console.log(this.detailJobNumber);
    this.jobNumber = this.detailJobNumber;
    this.pAFUpdateRequestModel = new PAFUpdateRequestModel();
    this.getDetails();
    this.getStateDropDown();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      pciName: [],
      pciTitle: [],
      pciEmail: [],
      pciPhone: [],
      taxExemptType: [],
      jobType: [],
      custType: [],
      empGroup: [],
      empGroupCheck: [],
      paperWorkType: [],
      empGroupt: [],
      ocip: [],
      uniCoedType: [],
      ownerName: [],
      streetAdd: [],
      city: [],
      state: [],
      zipCode: [],
      telephone: [],
      displayPipeLine: [],
      checkOCIP: [],
      checkMine: [],
      checkCertifying: [],
      checkPrivailing: [],
      pafComplete: [],
    });

  }


  onSave() { }

  onPrint() { }
  onUnicodes() {
    this.displayUnicodeDrp = !this.displayUnicodeDrp;
  }

  //#region get Details
  getDetails() {
    this.projectService.getPAFDetails(this.jobNumber).subscribe(
      (res) => {
        console.log(res)
        this.pAfData = res;
        this.setFormValue(this.pAfData[0])
      }
    )
  }
  //#endregion

  //#region on Change event
  ngOnChanges() {
    console.log(this.detailJobNumber);
  }
  //#endregion
  //#region set Values
  setFormValue(data) {
    console.log(data);
    this.isPafComplete = data.pafComplete;
    this.form.setValue({
      pciName: data.contactName,
      pciTitle: data.contactTitle,
      pciEmail: data.contactEmail,
      pciPhone: data.contactPhone,
      taxExemptType: data.taxExempt,
      jobType: data.typeOfJob,
      custType: data.customerType,
      empGroup: data.employeeGroup,
      empGroupCheck: null,
      paperWorkType: data.paperwork,
      empGroupt: data.employeeGroup,
      ocip: data.ocip,
      uniCoedType: data.unionCode,
      ownerName: data.ownerName,
      streetAdd: data.ownerAddress,
      city: data.ownerCity,
      state: data.ownerState,
      zipCode: data.ownerZip,
      telephone: data.ownerPhone,
      displayPipeLine: data.pipeline,
      checkOCIP: data.ocip,
      checkMine: data.mineJob,
      checkCertifying: data.certifiedPR,
      checkPrivailing: data.prevailingWage,
      pafComplete: data.pafComplete,
    });
    if (data.employeeGroup == 'UNION')
    {
      this.displayUnicodeDrp = true;
    }  
  }
  //#endregion
  //#region Bind states
  getStateDropDown() {
    this.dropdownService.GetLookupList('States').subscribe(
      (res) => {
        if (res) {
          this.stateList = res;
        }
      },
      // (error) => {
      //   this.onError(error, ErrorMessages.drop_down.states);
      // }
    );
  }
  //#endregion

  //#region create Add Model
  createPAFModel() {
    let data = new PAFUpdateRequestModel();
    data.JobNumber = this.jobNumber;
    data.ContactName = this.form.get('pciName').value;
    data.ContactEmail = this.form.get('pciEmail').value;
    data.ContactTitle = this.form.get('pciTitle').value;
    data.ContactPhone = this.form.get('pciPhone').value;
    data.TaxExempt = this.taxExempt;
    data.TypeOfJob = this.form.get('jobType').value;
    data.CustomerType = this.form.get('custType').value;
    data.EmployeeGroup = this.form.get('empGroupt').value;
    data.OCIP = this.ocip;
    data.MineJob = this.mineQuarry;
    data.PrevailingWage = this.prevailingWage;
    data.CertifiedPR = this.certifiedPayroll;
    data.Paperwork = this.form.get('paperWorkType').value;
    data.OwnerName = this.form.get('ownerName').value;
    data.OwnerAddress = this.form.get('streetAdd').value;
    data.OwnerCity = this.form.get('city').value;
    data.OwnerState = this.form.get('state').value;
    data.OwnerZip = this.form.get('zipCode').value;
    data.OwnerPhone = this.form.get('telephone').value;
    data.PAFComplete = this.form.get('pafComplete').value;
    data.Pipeline = this.pipeline;
    return data;
  }
  //#endregion

  //#region onEditClick
  onEdit() {
    if (!this.isPafComplete) {
      this.isDisabled = false;
      this.isSaveDisabled = false;
      this.isEditDisabled = true;
    }
    else {
      this.utilityService.toast.error('PAF has been completed and cannot be edited');
    }

  }
  //#endregion
  //#region onSaveClick
  onSaveClick() {
    let data = new PAFUpdateRequestModel();
    data = this.createPAFModel();
    this.projectService.editPAF(data).subscribe(
      (res) => {
        if (res['status'] == 200) {
          this.utilityService.toast.success(res.message);
          this.getDetails();
          this.isDisabled = true;
          this.isSaveDisabled = true;
          this.isEditDisabled = false;

        }
        else {
          this.utilityService.toast.error(res.message);
          this.isDisabled = true;
          this.isSaveDisabled = true;
          this.isEditDisabled = false;
        }
      }

    )
  }
  //#endregion

  //#region 
  onCancel() {
    this.isDisabled = true;
    this.isSaveDisabled = true;
    this.isEditDisabled = false;
  }
  //#endregion

  //#region Back button click
  onBack() {
    this.backButtonEvent.emit();
  }
  //#endregion

  //#region export TO Excel
  exportToExcel() {
    this.projectService.exportToExcelPAF(this.detailJobNumber).subscribe((res) => {
      let data = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      });
      fileSaver.saveAs(
        data,
        'PAF_' + new Date().toLocaleDateString('en-US') + '.xlsx'
      );

    });
  }
  //#endregion

  //#region switch Events
  onTaxExempt(event) {
    this.taxExempt = event;
    if (event) {
      this.taxExempt = "YES"
    }
    else {
      this.taxExempt = "NO"
    }
  }
  onDisplayPipeline(event) {
    this.pipeline = event;
  }
  onOCIP(event) {
    this.ocip = event;
  }
  onMineQuarry(event) {
    this.mineQuarry = event;
  }
  onCertifiedPayroll(event) {
    this.certifiedPayroll = event;
  }
  onPrevailingWage(event) {
    this.prevailingWage = event;
  }
  //#endregion
}
