import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import {
  ViewEmpData,
  ViewEmpColumn1,
} from './../../../../../data/personal-day-calender-data';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { PurchasingService } from '../purchasing.service';
import { ErrorHandlerService } from 'src/app/core/services';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { EmployeeService } from '../../../ssg/employee/employee/employee.service';
import { PurchaseOrderRequestModel } from '../purchase-order/purchase-orderRequestModel.model';
import {PurchaseOrderExcelFileViewResultModel} from './purchase-orderRequestModel.model'
import { VendorService } from '../../vendor/vendor/vendor.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import * as fileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
})
export class PurchaseOrderComponent implements OnInit {
  form: FormGroup;
  isDisabled: boolean;
  isDisabledShip: boolean;
  isDisabledVendor: boolean;
  isDisableVendorCombo: boolean;
  isExpanded: boolean = true;
  openedPOR: boolean = false;
  openedQBPO: boolean = false;
  displayEmpDialog: boolean = false;
  viewEmpColumn: any;
  displayDepartmentDrp: boolean = false;
  displayDivisionDrp: boolean = false;
  displaySubmitPOR: boolean = false;
  displayPrintButtonOptions: boolean = false;
  displayPrintButtonOptionsForEmail:boolean = false;
  displayReceivePOR: boolean = false;
  displayClosePOR: boolean = false;
  employeeList: any;
  viewEmpData: any;
  viewData: any;
  data: any;
  vendorList: any = [];
  shippingTypeList: any;
  vendor: any;
  divisionList: any;
  PONumberData: any = [];
  lookUpValue: boolean;
  vendorData: any = [];
  ApprovalViewData: any = [];
  shipData: any = [];
  shipTermsData: any = [];
  PONumber: string;
  searchText: any;
  empData: any = [];
  lineItems: any = [];
  receivePORData: any = [];
  employeeName: string;
  employeeId: number;
  vendorStatus = '0';
  shipStatus = '0';
  searchEmp = '';
  branch: string;
  branchCode: any = [];
  vendorId: Number;
  createdByValue: string;
  receivingInventories: any = [];
  isReceiveConfirmDialog: boolean = false;
  isReceiveDialog: boolean = false;
  isErrorDialog: boolean = false;
  multiple: boolean = false;
  isAdd: boolean = false;
  isDisableShipCombo: boolean;
  isEdit: boolean = false;
  isCopyPO: boolean = false;
  newPoNumber: string;
  lineitemsPOData: any = [];
  isClosePO: boolean = false;
  porTotal: number;
  printCount:number = 0;
  vendorsData: any;
  tempList: any;
  printInOneFile:boolean = false;
  excelFeilds:any
  public sort: SortDescriptor[] = [
    {
      field: 'ee',
      dir: 'asc',
    },
    {
      field: 'name',
      dir: 'asc',
    },
  ];
  public mySelection: number[] = [0];

  data1: any;
  public sort1: SortDescriptor[] = [
    {
      field: 'approver',
      dir: 'asc',
    },
    {
      field: 'approverValue',
      dir: 'asc',
    },
    {
      field: 'approvalDate',
      dir: 'asc',
    },
  ];
  public mySelection1: number[] = [0];

  constructor(
    public formBuilder: FormBuilder,
    public dropdownservice: DropdownService,
    public purchasingService: PurchasingService,
    public errorHandler: ErrorHandlerService,
    public branchService: BranchService,
    public employeeService: EmployeeService,
    public vendorService: VendorService,
    private utility: UtilityService,
    public datepipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.viewEmpColumn = ViewEmpColumn1;
    this.viewEmpData = ViewEmpData;
    this.initForm();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      PONumber: [''],
      Status: [''],
      Notes: [''],
      NewVendor: [''],
      QBPONumber: [''],
      Address: [''],
      Address2: [''],
      City: [''],
      State: [''],
      Zip: [''],
      Contact: [''],
      Phone: [''],
      ShipTerms: [''],
      ShipAddress: [''],
      ShipCity: [''],
      ShipState: [''],
      ShipZip: [''],
      CreditCard: [''],
      CCHolder: [''],
      CCLast4: [0],
      ClosedDate: [''],
      OrderDate: [''],
      QBNoticeDate: [''],
      CreatedDate: [''],
      ExpectedDate: new Date(),
      Freight: [''],
      Tax: [''],
      RequestedBy: [''],
      EmpName: [''],
      Vendor: [''],
      Branch: [''],
      CreatedBy: [''],
      shipTo: [''],
    });
  }

  public viewColumns = [
    {
      Name: 'approver',
      isCheck: true,
      Text: 'Approver',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'approverValue',
      isCheck: true,
      Text: 'Approved Y/N',
      isDisable: true,
      index: 1,
      width: 100,
    },
    {
      Name: 'approvalDate',
      isCheck: true,
      Text: 'Approval Date',
      isDisable: false,
      index: 2,
      width: 100,
    },
  ];

  receivingInvColumns = [
    {
      Name: 'poNumber',
      isCheck: true,
      Text: 'PO Number',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'branch',
      isCheck: true,
      Text: 'Branch',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'invType',
      isCheck: true,
      Text: 'Item Code',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'description',
      isCheck: true,
      Text: 'Description',
      isDisable: false,
      index: 0,
      width: 200,
    },
    {
      Name: 'uom',
      isCheck: true,
      Text: 'UOM',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'quantity',
      isCheck: true,
      Text: 'Order Quantity',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'recdQty',
      isCheck: true,
      Text: 'Receive Quantity',
      isDisable: false,
      index: 0,
      width: 50,
    },
  ];

  submitQBPO() {
   
    if(this.printCount>9)
    {
      this.displayPrintButtonOptions = true;
      
    }
    else if(this.printCount < 9)
    {
      this.displayPrintButtonOptions = false;
      this.printInOneFile = true;
      this.downloadFile();
    }
    //  this.displayPrintButtonOptions = !this.displayPrintButtonOptions;
    // this.downloadFile();
  }
  
  OnSubmitQbPoYesClick()
  {
    this.printInOneFile = true;
    this.downloadFile();
    this.displayPrintButtonOptions = !this.displayPrintButtonOptions;
  }
  OnSubmitQbPoNoClick()
  {
    this.printInOneFile = false;
   this.downloadFile();
   this.displayPrintButtonOptions = !this.displayPrintButtonOptions;
  }
  downloadFile() {
    if (
      this.form.controls['QBPONumber'].value != null &&
      this.form.controls['QBPONumber'].value != undefined &&
      this.form.controls['QBPONumber'].value != ''
    ) {
      this.purchasingService.downloadPOData(this.PONumber,this.printInOneFile).subscribe(
        (res) => {
          console.log(res)
          if(res.length > 0)
          {
           let excelData = new PurchaseOrderExcelFileViewResultModel()
           
            res.forEach((element) => {
              excelData.fileName = element.fileName;
              excelData.filePath = element.filePath;
            this.purchasingService.downloadPOExcelFiles(excelData).subscribe(
            (res)=>{
              let data = new Blob([res], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
              });
      
              fileSaver.saveAs(
                data,
                'POR-' +
                  this.PONumber +
                  +'_' +
                  new Date().toLocaleDateString('en-US') +
                  '.xlsx'
              );
            }
            )
          });
        
        }
          // let data = new Blob([res], {
          //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
          // });

          // fileSaver.saveAs(
          //   data,
          //   'PO_' +
          //     this.PONumber +
          //     new Date().toLocaleDateString('en-US') +
          //     '.xlsx'
          // );
        },
        (error) => {
          this.onError(error, ErrorMessages.Purchase_Order.download_QB_PO_Data);
        }
      );
    } else {
      this.utility.toast.error(
        'QuickBooks PO number must be enter before you can print.'
      );
    }
  }
  onEmployeeDialog() {
    this.displayEmpDialog = !this.displayEmpDialog;
  }

  public close(status) {
    if (status == 'cancel') {
      this.displayEmpDialog = !this.displayEmpDialog;
    } else {
      this.displayEmpDialog = !this.displayEmpDialog;
    }
  }
  onDepartment() {
    this.displayDepartmentDrp = !this.displayDepartmentDrp;
  }
  onDivision() {
    this.displayDivisionDrp = !this.displayDivisionDrp;
  }
  onVendorChange(data) {
    debugger;
    console.log('data for vendor ' + data);
    this.getVendorDetails(data);
  }
  onShipChange(data) {
    this.getShipToDetails(data);
  }
  onSubmitPOR() {
    this.displaySubmitPOR = !this.displaySubmitPOR;
  }
  onReceivePOR() {
    this.displayReceivePOR = !this.displayReceivePOR;
  }
  onClosePOR() {
    this.displayClosePOR = !this.displayClosePOR;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.viewEmpData, this.sort),
      total: this.viewEmpData.length,
    };
    this.viewEmpData = this.data.data;
  }
  public sortChange1(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.data = {
      data: orderBy(this.viewData, this.sort),
      total: this.viewData.length,
    };
    this.viewData = this.data.data;
  }
  editclick(data: any) {
    this.isDisabled = true;
    this.isDisableVendorCombo = true;
    this.PONumberData = data;
    this.employeeName = this.PONumberData.empName;
    if (data != null) {
      this.PONumber = this.PONumberData.poNumber;
      this.setValue(this.PONumberData);
      this.GetVendors();
      this.GetApproval();
      this.GetShip();
      this.GetShipTerms();
      this.GetEmployee();
      this.GetPORTotal();
      ///this.GetPrintCount();
    }
    // this.GetPODetails(this.PONumber);
  }

  setValue(res) {
      this.form.setValue({
      PONumber: res.poNumber,
      Status: res.status,
      Notes: res.notes,
      NewVendor: res.vendor,
      QBPONumber: res.qbpoNumber,
      Address: res.address,
      Address2: null,
      City: res.city,
      State: res.state,
      Zip: res.zip,
      Contact: res.contact,
      Phone: res.phone,
      ShipTerms: res.shipTerms,
      ShipAddress: res.shipAddress,
      ShipCity: res.shipCity,
      ShipState: res.shipState,
      ShipZip: res.shipZip,
      CreditCard: res.creditCard,
      CCHolder: res.ccHolder,
      CCLast4: res.ccLast4 == "" ? 0 : res.ccLast4 == null ? 0 : parseInt(res.ccLast4),
      ClosedDate: res.closedDate == null ? null : new Date(res.closedDate),
      OrderDate: res.orderedDate == null ? null : new Date(res.orderedDate),
      QBNoticeDate:
        res.qbNoticeDate == null ? null : new Date(res.qbNoticeDate),
      CreatedDate: res.createdDate == null ? null : new Date(res.createdDate),
      ExpectedDate:
        res.expectedDate == null ? null : new Date(res.expectedDate),
      Freight: res.freight,
      Tax: res.tax,
      RequestedBy: res.requestedBy,
      EmpName: res.empName,
      Vendor: res.vendorId,
      Branch: res.branch,
      // VendorId: res.VendorId,
      CreatedBy: res.createdBy,
      shipTo: res.shipTo,
    });
    // this.vendorId = res.vendorId;
    this.createdByValue = res.createdBy;
    
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.purchase_order,
      customMessage
    );
  }

  GetVendors() {
    this.dropdownservice.GetVendorList().subscribe(
      (res) => {
        if (res) {
          this.vendorData = res;
        }
      },
      (error) => this.onError(error, ErrorMessages.drop_down.get_vendor_list)
    );
  }

  getVendorDetails(id) {
    this.vendorService.GetById(id).subscribe(
      (res) => {
        if (res) {
          this.form.controls['Address'].setValue(res.billingAddress.address);
          this.form.controls['Address2'].setValue(res.billingAddress.address2);
          this.form.controls['City'].setValue(res.billingAddress.city);
          this.form.controls['State'].setValue(res.billingAddress.state);
          this.form.controls['Zip'].setValue(res.billingAddress.zip);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vendor.get_by_id);
      }
    );
  }

  getShipToDetails(code) {
    this.purchasingService.GetShipDetails(code).subscribe(
      (res) => {
        if (res) {
          this.form.controls['ShipAddress'].setValue(res[0].address);
          this.form.controls['ShipCity'].setValue(res[0].city);
          this.form.controls['ShipState'].setValue(res[0].state);
          this.form.controls['ShipZip'].setValue(res[0].zip);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.Purchase_Order.ship_Details);
      }
    );
  }
  GetApproval() {
    this.purchasingService.GetApproval(this.PONumber).subscribe(
      (res) => {
        if (res.length > 0) {
          this.ApprovalViewData = res;
        }
      },
      (error) => {
        // this.onError(error, ErrorMessages.inventory.load_invenotry);
      }
    );
  }
  GetShip() {
    this.branchService.GetBranchDropdown().subscribe((res) => {
      if (res) {
        this.shipData = res;
      }
    });
  }
  GetShipTerms() {
    this.dropdownservice
      .GetLookupListForDivision('Shipping', false, true)
      .subscribe(
        (res) => {
          if (res) {
            this.shipTermsData = res;
          }
        },
        (error) => {
          this.onError(error, ErrorMessages.drop_down.vehicle_type);
        }
      );
  }
  GetEmployee() {
    this.dropdownservice.GetEmployee().subscribe(
      (res) => {
        if (res) {
          this.empData = res.result;
        }
        else {
          this.empData = [];
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.employee.get_unique_list_user)
    );
  }
  employeeClick(data) {
    this.employeeName = data.value;
    this.employeeId = data.id;
    this.displayEmpDialog = !this.displayEmpDialog;
  }
  btnAdd() {
    this.isExpanded = false;
    this.PONumber = '';
    this.employeeName = 'Requestor';
    this.createdByValue = '';
    this.isAdd = true;
    this.isEdit = false;
    this.form.reset();
    this.form.enable();
    this.isDisabled = false;
    this.isDisabledVendor = false;
    this.isDisableVendorCombo = false;
    this.isDisableShipCombo = false;
    this.form.controls['ExpectedDate'].setValue(new Date());
    this.form.controls['ClosedDate'].setValue(new Date());
    this.form.controls['CreatedDate'].setValue(new Date());
    this.form.controls['PONumber'].disabled;
    this.form.controls['QBPONumber'].disabled;
    this.form.controls['CreatedDate'].disabled;
    this.form.controls['QBNoticeDate'].disabled;
    this.ApprovalViewData = [];
  }
  btnCancel() {
    this.isAdd = false;
    this.isEdit = false;
    this.form.reset();
  }
  btnEdit() {
    this.isDisabled = false;
    this.isDisabledVendor = false;
    this.isDisabledShip = false;
    this.isAdd = false;
    this.isEdit = true;
    this.isDisableVendorCombo = false;
    this.isDisableShipCombo = false;
    this.form.enable();
  }
  onVendorRadioChange(data) {
    if (data == 1) {
      this.form.controls['Vendor'].setValue('');
      this.isDisabledVendor = true;
      this.isDisableVendorCombo = true;
      if (this.isAdd) {
        this.isDisabledVendor = false;
      }
    }
    else if(data == 0)
    {
      this.form.controls['Vendor'].setValue(this.PONumberData.vendorId);
      //this.form.controls['Vendor'].setValue('');
      this.isDisabledVendor = false;
      this.isDisableVendorCombo = false;
      if (this.isAdd) {
        this.isDisabledVendor = false;
      }
    }
  }
  onShipRadioChange(data) {
    if (data == 1) {
      this.isDisabledShip = true;
      this.isDisableShipCombo = true;
      this.form.controls['shipTo'].setValue('');
      this.form.controls['Branch'].setValue('');
      this.form.controls['ShipAddress'].setValue('');
      this.form.controls['ShipCity'].setValue('');
      this.form.controls['ShipState'].setValue('');
      this.form.controls['ShipZip'].setValue('');
    } else if (data == 0 && this.isAdd) {
      this.isDisabledShip = false;
      this.isDisableShipCombo = false;
    }
  }
  OnSave() {
    console.log(this.form.controls);
    if (this.form.controls['Freight'].value == null) {
      this.form.controls['Freight'].setValue(false);
    }
    if (this.form.controls['Tax'].value == null) {
      this.form.controls['Tax'].setValue(false);
    }
    if (this.form.controls['CreditCard'].value == null) {
      this.form.controls['CreditCard'].setValue(false);
    }
    let data = new PurchaseOrderRequestModel();

    data = this.createPurchaseOrderModel();
    if (this.isEdit || this.isClosePO) {
      data.poNumber = this.PONumber;
    } else {
      data.poNumber = '';
    }
    if (data) {
      this.purchasingService.AddData(data).subscribe((res) => {
        if (res) {
          if (res['status'] == 200) {
            if (this.isCopyPO) {
              console.log(res);
              this.newPoNumber = res.result;
              this.getPurchaseOrderLineItemsDetails();
            } else {
              this.utility.toast.success(res['message']);
            }
          } else {
            this.utility.toast.error(res['message']);
          }
        }
      });
    }
    this.isEdit = false;
    this.isClosePO = false;
  }
  onSaveCopyPOR(poDetail) {
    this.setValue(poDetail);
    this.isCopyPO = true;
    this.OnSave();
  }
  onSaveClosePOR(poDetail) {
    this.isClosePO = true;
    this.OnSave();
  }

  createPurchaseOrderModel() {
    let data = new PurchaseOrderRequestModel();
    if (this.isEdit || this.isClosePO) {
      data.poNumber = this.PONumber;
    }
    if (
      this.form.controls['Branch'].value == null ||
      this.form.controls['Branch'].value == undefined ||
      this.form.controls['Branch'].value == ''
    ) {
      this.branch = 'All';
    } else {
      this.branch = this.form.controls['Branch'].value;
    }
    // console.log(this.form.controls['branch'].value);
    data.QBPONumber = this.form.controls['QBPONumber'].value;
    data.submitDate = this.form.controls['ClosedDate'].value;
    data.ExpectedDate = this.form.controls['ExpectedDate'].value;
    data.CreatedDate = this.form.controls['CreatedDate'].value;
    data.Vendor = this.form.controls['Vendor'].value;
    data.vendorAddress = this.form.controls['Address'].value;
    data.vendorCity = this.form.controls['City'].value;
    data.vendorState = this.form.controls['State'].value;
    data.vendorContact = this.form.controls['Contact'].value;
    data.vendorZip = this.form.controls['Zip'].value;
    data.vendorPhone = this.form.controls['Phone'].value;
    data.Notes = this.form.controls['Notes'].value;
    data.Freight = this.form.controls['Freight'].value;
    data.Tax = this.form.controls['Tax'].value;
    data.Branch = this.branch;
    data.ShipAddress = this.form.controls['ShipAddress'].value;
    data.ShipCity = this.form.controls['ShipCity'].value;
    data.ShipZip = this.form.controls['ShipZip'].value;
    data.CreditCard = this.form.controls['CreditCard'].value;
    data.CCHolder = this.form.controls['CCHolder'].value;
    data.CCLast4 = this.form.controls['CCLast4'].value;
    data.ShipTerms = this.form.controls['ShipTerms'].value;
    data.ShipState = this.form.controls['ShipState'].value;
    data.ShipTo = this.form.controls['shipTo'].value;
    data.logo = 'MERSINO';
    if (this.isEdit) {
      data.Status = this.form.controls['Status'].value;
    } else {
      data.Status = 'OPEN';
    }
    data.UserName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.CreatedBy = JSON.parse(localStorage.getItem('currentUser')).userName;
    if (this.employeeId != null || this.employeeId != undefined) {
      data.RequestedBy = this.employeeId;
    }
    data.Closed = false;
    if (this.isClosePO) {
      data.Status = 'CLOSED';
      data.Closed = true;
      let closedDate = new Date();

      data.ClosedDate = new Date(
        this.datepipe.transform(closedDate, 'MM/dd/yyyy', 'EDT')
      );
    }
    return data;
  }

  submitPOR() {}
  getPurchaseOrderLineItemsDetails() {
    this.purchasingService.GetPurchaseOrderLineItems(this.PONumber).subscribe(
      (res) => {
        if (res) {
          console.log(res);
          if (res.length > 0) {
            this.lineItems = res;
            this.lineItems.forEach((element) => {
              var lineItemsPO = {
                costCenter: element.costCenter,
                description: element.description,
                fleetInv: element.fleetInv,
                invNumber: element.invNumber,
                jobSO: element.jobSO,
                mdiRef: element.mdiRef,
                newItemCode: element.partNumber,
                override: element.override,
                paidLess: element.paidLess,
                partNumber: element.partNumber,
                pricePer: element.pricePer,
                puom: element.puom,
                puomQuantity: element.puomQuantity,
                purchasingUOM: element.purchasingUOM,
                quantity: element.quantity,
                rPeriod: element.rPeriod,
                rQty: element.rQty,
                requestor: element.requestor,
                ruom: element.ruom,
                saleRerental: element.saleRerental,
                srPrice: element.srPrice,
                status: element.status,
                stock: element.stock,
                total: element.total,
                uom: element.uom,
                poNumber: this.newPoNumber,
              };
              this.lineitemsPOData.push(lineItemsPO);
            });
            if (this.lineitemsPOData.length > 0) {
              this.purchasingService
                .AddlineItems(this.lineitemsPOData)
                .subscribe((res) => {
                  if (res) {
                    if (res['status'] == 200) {
                      this.utility.toast.success(
                        'New Copied POR #' + this.newPoNumber
                      );
                    } else {
                      this.utility.toast.error(res['message']);
                    }
                    this.lineitemsPOData = [];
                    this.newPoNumber = '';
                    this.isCopyPO = false;
                  }
                });
            }
          } else {
            this.utility.toast.error(
              'No Detail Lines on POR # ' + this.PONumber
            );
            this.isCopyPO = false;
          }
          // this.receivePORData.forEach((element) => {
          //   var receivePO = {
          //     poNumber: this.PONumber,
          //     poDetailId: element.pk,
          //     totalReceivedQty: element.quantity,
          //     receivedQty: element.quantity,
          //     partNumber: element.partNumber,
          //     poStatus: this.poStatus,
          //     userId: 0,
          //   };
          //   this.receivedPOItems.push(receivePO);
          // });
        }
      },
      (error) =>
        this.onError(error, ErrorMessages.Purchase_Order.lineItems_Details)
    );
  }
  GetPORTotal() {
    this.purchasingService.GetPORTotal(this.PONumber).subscribe((res) => {
      if (res) {
        this.porTotal = res;
      } else {
        this.porTotal = 0;
      }
    });
  }
  GetPrintCount()
  {
    this.purchasingService.GetPrintCount(this.PONumber).subscribe((res)=>{
      if(res)
      {
        this.printCount = res;
      }
      else
      {
        this.printCount = 0;
      }
    })
  }
  sendEmail() {
    if (
      this.form.controls['QBPONumber'].value != null ||
      this.form.controls['QBPONumber'].value != undefined ||
      this.form.controls['QBPONumber'].value != ''
    ) {
      this.purchasingService.sendEmail(this.PONumber,this.printInOneFile).subscribe((res) => {
        if(res.length > 0)
        {
          this.utility.toast.success(
            'Email has been sent successfully.'
          );
        }
      });
    } else {
      this.utility.toast.error(
        'Error in Send Email'
      );
    }
  }
  sendEmailButtonOptions() {
   
    if(this.printCount>9)
    {
      this.displayPrintButtonOptionsForEmail = true;
      
    }
    else if(this.printCount < 9)
    {
      this.displayPrintButtonOptionsForEmail = false;
      this.printInOneFile = true;
      this.sendEmail();
    }
    //  this.displayPrintButtonOptions = !this.displayPrintButtonOptions;
    // this.downloadFile();
  }
  OnSubmitSendEmailYesClick()
  {
    this.printInOneFile = true;
    this.sendEmail();
    this.displayPrintButtonOptionsForEmail = !this.displayPrintButtonOptionsForEmail;
  }
  OnSubmitSendEmailNoClick()
  {
    this.printInOneFile = false;
    this.sendEmail();
    this.displayPrintButtonOptionsForEmail = !this.displayPrintButtonOptionsForEmail;
  }
}
