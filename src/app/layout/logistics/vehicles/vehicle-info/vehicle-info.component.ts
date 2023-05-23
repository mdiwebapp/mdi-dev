import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'src/app/core/helper/menu.service';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { BranchService } from 'src/app/layout/admin/branch/branch.service';
import { EmployeeService } from 'src/app/layout/ssg/employee/employee/employee.service';
import { VehicleService } from '../vehicle.service';
import { VehicleInfoModel, moreInfoModel } from './vehicle-info.model';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.scss'],
})
export class VehicleInfoComponent implements OnInit {
  form: FormGroup;
  id: number = 0;
  branch: any = [];
  isExpanded: boolean = false;
  isDisableExp: boolean = true;
  isMoreDisabled: any;
  VehicleTypeData: any = [];
  data: VehicleInfoModel[];
  nonExpiringPlate: boolean = false;
  //  [{ id: 1, value: "Boom Truck" }, { id: 2, value: "Drill Rig" }, { id: 3, value: "Fork Truck" }, { id: 4, value: "Semi Truck" }, { id: 5, value: "Trailer" }, { id: 6, value: "Trencher" }
  //   , { id: 7, value: "Trucks" }, { id: 8, value: "Utility" }]
  isDisabled: boolean;
  // public licenseExpiration: Date = new Date();
  // public assignedDate: Date = new Date();
  // public annualInspectionDate: Date = new Date();
  // public purchasedFrom: Date = new Date();
  // public unitBuildDate: Date = new Date();
  branchData: any;
  lstFrequency: any = [
    { id: 0, value: '30 Days' },
    { id: 0, value: '60 Days' },
    { id: 0, value: '90 Days' },
    { id: 0, value: 'None' },
  ];
  TrailerHitchData: any = [
    { id: 0, value: 'None' },
    { id: 1, value: 'Bumper Pull' },
    { id: 2, value: 'Gooseneck' },
  ];
  WheelMaterialData: any = [
    { id: 1, value: 'Alloy' },
    { id: 2, value: 'Steel' },
  ];
  assignTo: any;
  VehicleTypeFilterData: any;
  assignToFilterData: any;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  wheelMaterial: string;
  isAddRight: boolean = false;
  isVINRight: boolean = false;
  setAssignedDate: Date;

  setannualInspectionDate: Date;
  setpurchaseDate: Date;
  setunitBuildDate: Date;
  constructor(
    private formBuilder: FormBuilder,
    public service: VehicleService,
    public branchService: BranchService,
    private utils: UtilityService,
    public dropdownservice: DropdownService,
    public menuService: MenuService,
    public employeeService: EmployeeService,
    public errorHandler: ErrorHandlerService,
    public datepipe: DatePipe
  ) {
    this.menuService.checkUserBySubmoduleRights('Vehicle Info');

    this.isAddRight = this.menuService.isAddRight;
    this.isVINRight = this.menuService.isVINRight;
  }

  vehicle: VehicleInfoModel;
  ngOnInit(): void {
    this.initForm();
    this.GetBranch();
    this.GetEmployee();
    this.GetVehicleType();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      userName: [''],
      vehicleType: [''],
      vehicleNumber: [''],
      description: ['', Validators.required],
      serialNumber: ['', Validators.required],
      license: [''],
      assignedDate: [null, Validators.required],
      licenseExpiration: [null],
      branchId: ['', Validators.required],
      assignEmployeeId: [0, Validators.required],
      miles: [0],
      hours: [''],
      rental: [false],
      inactive: [false],

      serviceFrequency: [''],
      annualInspectionDate: [null],
      lastServiceDate: [null],
      dailyRate: [''],
      purchasedFrom: ['', Validators.required],
      purchasePrice: ['', Validators.required],
      purchaseDate: [null, Validators.required],
      expensed: [''],
      length: [''],
      //lengthIN: [''],
      height: [''],
      //heightIN: [''],
      width: [''],
      //widthIN: [''],
      dot: [false],
      sold: [false],
      abs: [false],
      cdl: [false],
      milesAtPurchased: [0],
      hoursAtPurchased: [0],

      engineMake: [''],
      engineModel: [''],
      engineSerialNumber: [''],
      engineHP: [''],
      displacement: [''],
      transmissionModel: [''],
      unitBuildDate: [null],
      maxLiftingHeight: [0],
      //maxLiftingHeightIN: [0],
      liftingCapacity: [0],
      telescopicReachLength: [0],
      //telescopicReachLengthIN: [0],

      frontAxelRatio: [''],
      rearAxelRatio: [''],
      frontGAWR: [''],
      rearGAWR: [''],
      tireSize: [''],
      numberOfAxels: [0],
      curbWeight: [''],
      gvwr: [''],
      psiCold: [''],
      wheelMaterial: [''],
      cabType: [''],

      fifthWheel: [false],
      trailerHitch: [''],
      axleSpacing1: [''],
      //axleSpacing1IN: [''],
      axleSpacing2: [''],
      //axleSpacing2IN: [''],
      weight: [''],
      wheel: [''],
      dryWeight: [0],
      operatingWeight: [0],
      maxDrillingDepth: [0],
      //maxDrillingDepthIN: [0],
      numberOfAxles: [''],
      tyreType: [''],
      sleeps: [0],
      annualInspectionMiles: [],
    });
  }
  GetBranch() {
    this.branchService.GetBranchDropdown().subscribe(
      (res) => {
        if (res) {
          this.branch = res;
          this.branchData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.branch.dropdown);
      }
    );
  }
  GetVehicleType() {
    this.dropdownservice.GetLookupList('VehicleType').subscribe(
      (res) => {
        if (res) {
          this.VehicleTypeData = res;
          this.VehicleTypeFilterData = res;
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
          this.assignTo = res.result;
          this.assignToFilterData = res.result;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.employee.get_list);
      }
    );
  }
  vehicleTypeFilter(value) {
    this.VehicleTypeData = this.VehicleTypeFilterData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  branchFilter(value) {
    this.branch = this.branchData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  assignedToFilter(value) {
    this.assignTo = this.assignToFilterData.filter(
      (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  type0102: boolean = false;
  type06: boolean = false;
  type07: boolean = false;
  type04: boolean = false;
  type03: boolean = false;
  type05: boolean = false;
  type08: boolean = false;
  type09: boolean = false;

  moretype01: boolean = false;
  moretype02: boolean = false;
  moretype03: boolean = false;
  moretype04: boolean = false;
  moretype05: boolean = false;
  moretype0601: boolean = false;
  moretype0602: boolean = false;
  moretype0603: boolean = false;
  moretype0604: boolean = false;
  moretype07: boolean = false;
  moretype08: boolean = false;
  moretype09: boolean = false;
  moretype10: boolean = false;

  vehicleTypeChange($event) {
    this.type0102 = false;
    this.type06 = false;
    this.type07 = false;
    this.type04 = false;
    this.type03 = false;
    this.type05 = false;
    this.type08 = false;
    this.type09 = false;

    this.moretype01 = false;
    this.moretype02 = false;
    this.moretype03 = false;
    this.moretype04 = false;
    this.moretype05 = false;
    this.moretype0601 = false;
    this.moretype0602 = false;
    this.moretype0603 = false;
    this.moretype0604 = false;
    this.moretype07 = false;
    this.moretype08 = false;
    this.moretype09 = false;
    this.moretype10 = false;
    if ($event && this.id == 0) {
      this.form.reset();
      this.service.GetVehicleNo($event).subscribe(
        (res) => {
          this.id = 0;
          this.form.get('vehicleNumber').setValue(res.result);
          this.form.get('vehicleType').setValue($event);
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.get_vehicle_no);
        }
      );
    }
    if (
      $event == 'Boom truck - Knuckle' ||
      $event == 'Boom Truck - Knuckle' ||
      $event == 'Boom Truck - Stick'
    ) {
      this.type0102 = true;
      this.moretype01 = true;
      /// mockup -01,02
    } else if (
      $event == 'Semi Truck - Flat Bed' ||
      $event == 'Semi Truck - Fifth Wheel' ||
      $event == 'Semi Truck - Roll Off'
    ) {
      this.type0102 = true;
      this.moretype02 = true;
      /// mockup -01,02
    } else if ($event == 'Utility - ATV') {
      /// mockup -06
      this.type06 = true;
      this.moretype0601 = true;
    } else if ($event == 'Utility - Construction') {
      /// mockup -06
      this.type06 = true;
      this.moretype0602 = true;
    } else if ($event == 'Utility - Travel Trailer') {
      /// mockup -06
      this.type06 = true;
      this.moretype0604 = true;
    } else if ($event == 'Utility - Mobile Office') {
      /// mockup -06
      this.type06 = true;
      this.moretype0603 = true;
    } else if ($event == 'Fork Truck - Rough Terrain') {
      /// mockup -07
      this.type07 = true;
      this.moretype07 = true;
    } else if ($event == 'Fork Truck - Fork Lift') {
      /// mockup -07
      this.type07 = true;
      this.moretype08 = true;
    } else if ($event == 'Trencher') {
      /// mockup -04
      this.type04 = true;
      this.moretype04 = true;
    } else if (
      $event == 'Trailer - Bumper Pull' ||
      $event == 'Trailer - Enclosed' ||
      $event == 'Trailer - Fusion' ||
      $event == 'Trailer - Goose Neck' ||
      $event == 'Trailer - Jet' ||
      $event == 'Trailer - Semi - Low Boy' ||
      $event == 'Trailer - Semi - Step Deck' ||
      $event == 'Trailer - Semi - Flat Bed' ||
      $event == 'Trailer - Sock Tile Trailer'
    ) {
      /// mockup -03
      this.type03 = true;
      this.moretype03 = true;
    } else if (
      $event == 'Trucks - Account Manager' ||
      $event == 'Trucks - Drill Support' ||
      $event == 'Trucks - Flat Bed' ||
      $event == 'Trucks - Mechanics' ||
      $event == 'Trucks - Service' ||
      $event == 'Trucks - Trencher Service' ||
      $event == 'Trucks - Well Point Support' ||
      $event == 'Trucks - SSG'
    ) {
      /// mockup -05
      this.type05 = true;
      this.moretype05 = true;
    } else if ($event == 'Drill Rig - Track Mounted') {
      /// mockup -08
      this.type08 = true;
      this.moretype09 = true;
    } else if (
      $event == 'Drill Rig - Wheel Mounted' ||
      $event == 'Drill Rig - Auger'
    ) {
      /// mockup -09
      this.type09 = true;
      this.moretype10 = true;
    }
  }
  onEdit(res) {
    this.editClick(res);
    //this.vendorMoreInfo.onEdit(res);
  }
  editClick(data: any) {
    this.form.disable();
    this.isDisabled = true;
    this.isDisableExp = true;
    this.id = data.id;

    if (data.id > 0) {
      this.setValue(data);
    } else {
      this.form.reset();
    }
  }
  setValue(data: any) {
    this.form.setValue({
      userName: '',
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      description: data.description,
      serialNumber: data.serialNumber,
      license: data.license,
      licenseExpiration:
        data.licenseExpiration == null
          ? null
          : new Date(data.licenseExpiration),
      branchId: data.branchId,
      assignEmployeeId: data.assignEmployeeId,
      miles: data.miles,
      hours: data.hours,
      rental: data.rental,
      inactive: data.inactive,
      assignedDate:
        data.assignedDate == null ? null : new Date(data.assignedDate),
      serviceFrequency: data.moreInfo.serviceFrequency,
      annualInspectionDate:
        data.moreInfo.annualInspectionDate == null
          ? null
          : new Date(data.moreInfo.annualInspectionDate),
      dailyRate: data.moreInfo.dailyRate,
      purchasedFrom: data.moreInfo.purchasedFrom,
      purchasePrice: data.moreInfo.purchasePrice,
      purchaseDate:
        data.moreInfo.purchaseDate == null
          ? null
          : new Date(data.moreInfo.purchaseDate),
      expensed: data.moreInfo.expensed,
      length: data.moreInfo.length, //).split(".")[0] ?? 0,
      //lengthIN: data.moreInfo.length,//).split(".")[1] ?? 0,
      height: data.moreInfo.height, //).split(".")[0] ?? 0,
      // heightIN: data.moreInfo.height,//).split(".")[1] ?? 0,
      width: data.moreInfo.width, //).split(".")[0] ?? 0,
      //widthIN: data.moreInfo.width,//).split(".")[1] ?? 0,
      dot: data.moreInfo.dot,
      sold: data.moreInfo.sold,
      abs: data.moreInfo.abs,
      cdl: data.moreInfo.cdl,
      milesAtPurchased: data.moreInfo.milesAtPurchased,
      hoursAtPurchased: data.moreInfo.hoursAtPurchased,

      engineMake: data.moreInfo.engineMake,
      engineModel: data.moreInfo.engineModel,
      engineSerialNumber: data.moreInfo.engineSerialNumber,
      engineHP: data.moreInfo.engineHP,
      displacement: data.moreInfo.displacement,
      transmissionModel: data.moreInfo.transmissionModel,
      unitBuildDate: !data.moreInfo.unitBuildDate
        ? null
        : new Date(data.moreInfo.unitBuildDate),
      maxLiftingHeight:
        data.moreInfo.maxLiftingHeight == null
          ? null
          : data.moreInfo.maxLiftingHeight,
      //maxLiftingHeightIN: data.moreInfo.maxLiftingHeight,//).split(".")[1] ?? 0,
      liftingCapacity: data.moreInfo.liftingCapacity,
      telescopicReachLength:
        data.moreInfo.telescopicReachLength == null
          ? null
          : data.moreInfo.telescopicReachLength,
      // telescopicReachLengthIN: data.moreInfo.telescopicReachLength,//).split(".")[0] ?? 0,

      frontAxelRatio: data.moreInfo.frontAxelRatio,
      rearAxelRatio: data.moreInfo.rearAxelRatio,
      frontGAWR: data.moreInfo.frontGAWR,
      rearGAWR: data.moreInfo.rearGAWR,
      tireSize: data.moreInfo.tireSize,
      numberOfAxels: data.moreInfo.numberOfAxels,
      curbWeight: data.moreInfo.curbWeight,
      gvwr: data.moreInfo.gvwr,
      psiCold: data.moreInfo.psiCold,
      wheelMaterial: data.moreInfo.wheelMaterial,
      cabType: data.moreInfo.cabType,

      fifthWheel: data.moreInfo.fifthWheel,
      trailerHitch: data.moreInfo.trailerHitch,
      axleSpacing1:
        data.moreInfo.axleSpacing1 == null ? null : data.moreInfo.axleSpacing1,
      //axleSpacing1IN: String(data.moreInfo.axleSpacing1).split(".")[1] ?? 0,
      axleSpacing2:
        data.moreInfo.axleSpacing2 == null ? null : data.moreInfo.axleSpacing2,
      // axleSpacing2IN: String(data.moreInfo.axleSpacing2).split(".")[1] ?? 0,
      weight: data.moreInfo.weight,
      wheel: data.moreInfo.wheel,
      dryWeight: data.moreInfo.dryWeight,
      operatingWeight: data.moreInfo.operatingWeight,
      maxDrillingDepth:
        data.moreInfo.maxDrillingDepth == null
          ? null
          : data.moreInfo.maxDrillingDepth,
      //maxDrillingDepthIN: String(data.moreInfo.maxDrillingDepth).split(".")[1] ?? 0,
      numberOfAxles: data.moreInfo.numberOfAxles,
      tyreType: data.moreInfo.tyreType,
      sleeps: data.moreInfo.sleeps,
      annualInspectionMiles: null,
      lastServiceDate:
        data.lastServiceDate == '' ? null : new Date(data.lastServiceDate),
    });
    this.setAssignedDate = !data.assignedDate
      ? null
      : new Date(this.datepipe.transform(data.assignedDate, 'yyyy-MM-dd'));
    this.setannualInspectionDate = !data.moreInfo.annualInspectionDate
      ? null
      : new Date(
        this.datepipe.transform(
          data.moreInfo.annualInspectionDate,
          'yyyy-MM-dd'
        )
      );
    this.setpurchaseDate = !data.moreInfo.purchaseDate
      ? null
      : new Date(
        this.datepipe.transform(data.moreInfo.purchaseDate, 'yyyy-MM-dd')
      );

    this.setunitBuildDate = !data.moreInfo.unitBuildDate
      ? null
      : new Date(
        this.datepipe.transform(data.moreInfo.unitBuildDate, 'yyyy-MM-dd')
      );

    this.wheelMaterial = data.moreInfo.wheelMaterial;

    //this.annualInspectionDate = new Date(data.moreInfo.annualInspectionDate);
    //var veh =this.VehicleTypeData.find(c=> c.value==data.vehicleType).id;
    if (data.nonExpiringPlate) {
      this.nonExpiringPlate = true;
    } else {
      this.nonExpiringPlate = false;
    }
    setTimeout(() => {
      this.form.get('vehicleType').setValue(data.vehicleType);
      this.vehicleTypeChange(data.vehicleType);
    }, 500);
  }

  btnAdd() {
    this.isExpanded = false;
    this.id = 0;
    this.form.reset();
    this.form.enable();
    this.isDisabled = false;
    this.vehicleTypeChange('');
    this.form.get('vehicleType').setValue('');
    if (this.form.get('TrailerHitch') != null) {
      this.form.get('TrailerHitch').setValue('None');
    }
    this.form.controls.vehicleType.setValidators([Validators.required]);
    this.form.controls.vehicleNumber.setValidators([Validators.required]);
    //this.vendorMoreInfo.btnAdd();
  }

  btnEdit() {
    this.isExpanded = true;
    this.form.enable();
    this.isDisabled = false;
    this.form.controls['vehicleNumber'].disable();
    this.form.controls['vehicleType'].disable();
    if (this.isVINRight == false) {
      this.form.controls['serialNumber'].disable();
    }
  }

  btnCancel() {
    this.isExpanded = false;
    this.form.reset();
    this.form.disable();
  }
  onSave(isActive) {
    const data = new VehicleInfoModel();
    this.form.controls['vehicleType'].enable();
    this.form.controls['vehicleNumber'].enable();
    data.vehicleType = this.form.controls['vehicleType'].value;//value.vehicleType;
    data.vehicleNumber = this.form.controls['vehicleNumber'].value;//.value.vehicleNumber;
    // this.form.controls['vehicleType'].enable;
    // this.form.controls['vehicleNumber'].enable;
    this.form.controls['vehicleType'].setValue(data.vehicleType);
    this.form.controls['vehicleNumber'].setValue(data.vehicleNumber);
    if (this.form.invalid || (!data.vehicleType && !data.vehicleNumber)) {
      this.form.markAllAsTouched();
      return false;
    }
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;

    data.description = this.form.value.description;
    data.serialNumber = this.form.controls['serialNumber'].value;// this.form.value.serialNumber;
    data.license = this.form.value.license;
    if (this.form.value.licenseExpiration != 'Invalid Date') {
      data.licenseExpiration = this.datepipe.transform(this.form.value.licenseExpiration, 'MM/dd/yyyy');
    } else {
      data.licenseExpiration = '';
    }
    data.branchId = this.form.value.branchId;
    if (this.form.value.assignEmployeeId) { data.assignedEmployeeName = this.assignTo.find(c => c.id == this.form.value.assignEmployeeId).value; }
    else {
      data.assignedEmployeeName = '';
    }// this.form.value.assignedEmployeeName;
    data.assignEmployeeId = this.form.value.assignEmployeeId;

    data.assignedDate = this.setAssignedDate; //this.form.value.assignedDate;
    data.miles = this.form.value.miles;
    data.hours = this.form.value.hours;
    data.rental =
      this.form.value.rental == null ? null : this.form.value.rental;
    data.active = isActive; // this.form.value.inactive == null ? false : this.form.value.inactive;
    data.moreInfo = new moreInfoModel();
    data.moreInfo.serviceFrequency = this.form.value.serviceFrequency;
    data.moreInfo.annualInspectionDate = this.setannualInspectionDate; //this.form.value.annualInspectionDate;
    data.moreInfo.dailyRate = this.form.value.dailyRate;
    data.moreInfo.purchasedFrom = this.form.value.purchasedFrom;
    data.moreInfo.purchasePrice = this.form.value.purchasePrice;
    data.moreInfo.purchaseDate = this.setpurchaseDate; //this.form.value.purchaseDate;
    data.moreInfo.expensed =
      this.form.value.expensed == null ? false : this.form.value.expensed;
    data.moreInfo.length = this.form.value.length; // parseFloat(this.form.value.length + "." + this.form.value.lengthIN);
    data.moreInfo.height = this.form.value.height; //parseFloat(this.form.value.height + "." + this.form.value.heightIN);
    data.moreInfo.width = this.form.value.width; // parseFloat(this.form.value.width + "." + this.form.value.widthIN);
    data.moreInfo.dot =
      this.form.value.dot == null ? null : this.form.value.dot;
    data.moreInfo.sold =
      this.form.value.sold == null ? null : this.form.value.sold;
    data.moreInfo.abs =
      this.form.value.abs == null ? null : this.form.value.abs;
    data.moreInfo.cdl =
      this.form.value.cdl == null ? null : this.form.value.cdl;
    data.moreInfo.milesAtPurchased = this.form.value.milesAtPurchased;
    data.moreInfo.hoursAtPurchased = this.form.value.hoursAtPurchased;
    data.moreInfo.engineMake = this.form.value.engineMake;
    data.moreInfo.engineModel = this.form.value.engineModel;
    data.moreInfo.engineSerialNumber = this.form.value.engineSerialNumber;
    data.moreInfo.engineHP = this.form.value.engineHP;
    data.moreInfo.displacement = this.form.value.displacement;
    data.moreInfo.transmissionModel = this.form.value.transmissionModel;
    data.moreInfo.unitBuildDate = this.setunitBuildDate; //this.form.value.unitBuildDate;
    data.moreInfo.maxLiftingHeight = this.form.value.maxLiftingHeight; // parseFloat(this.form.value.maxLiftingHeight + "." + this.form.value.maxLiftingHeightIN);
    data.moreInfo.liftingCapacity = this.form.value.liftingCapacity;
    data.moreInfo.telescopicReachLength = this.form.value.telescopicReachLength; // parseFloat(this.form.value.telescopicReachLength + "." + this.form.value.telescopicReachLengthIN);
    data.moreInfo.frontAxelRatio = this.form.value.frontAxelRatio;
    data.moreInfo.rearAxelRatio = this.form.value.rearAxelRatio;
    data.moreInfo.frontGAWR = this.form.value.frontGAWR;
    data.moreInfo.rearGAWR = this.form.value.rearGAWR;
    data.moreInfo.tireSize = this.form.value.tireSize;
    data.moreInfo.numberOfAxels = this.form.value.numberOfAxels;
    data.moreInfo.curbWeight = this.form.value.curbWeight;
    data.moreInfo.gvwr = this.form.value.gvwr;
    data.moreInfo.psiCold = this.form.value.psiCold;
    data.moreInfo.wheelMaterial = this.form.value.wheelMaterial;
    this.wheelMaterial = this.form.value.wheelMaterial;
    data.moreInfo.cabType = this.form.value.cabType;
    data.moreInfo.fifthWheel =
      this.form.value.fifthWheel == null ? null : this.form.value.fifthWheel;
    data.moreInfo.trailerHitch = this.form.value.trailerHitch;
    data.moreInfo.axleSpacing1 = this.form.value.axleSpacing1; //parseFloat(this.form.value.axleSpacing1 + "." + this.form.value.axleSpacing1IN);
    data.moreInfo.axleSpacing2 = this.form.value.axleSpacing2; // parseFloat(this.form.value.axleSpacing2 + "." + this.form.value.axleSpacing2IN);
    data.moreInfo.weight = this.form.value.weight;
    data.moreInfo.wheel =
      this.form.value.wheel == null ? null : this.form.value.wheel;
    data.moreInfo.dryWeight = this.form.value.dryWeight;
    data.moreInfo.operatingWeight = this.form.value.operatingWeight;
    data.moreInfo.maxDrillingDepth = this.form.value.maxDrillingDepth; // parseFloat(this.form.value.maxDrillingDepth + "." + this.form.value.maxDrillingDepthIN);
    data.moreInfo.numberOfAxles = this.form.value.numberOfAxles;
    data.moreInfo.tyreType = this.form.value.tyreType;
    data.moreInfo.sleeps = this.form.value.sleeps;

    if (!data.rental) {
      data.rental = false;
    }

    if (this.id <= 0) {
      data.id = 0;
      this.service.AddData(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
          } else this.utils.toast.error(res['message']);
          this.form.disable();
          this.isDisabled = true;
          this.isExpanded = false;
          this.id = 0;
        },
        (error) => {
          debugger;
          this.onError(error, ErrorMessages.vehicle.add_data);
        }
      );
    } else {
      data.id = this.id;
      // if (!data.active) {
      //   data.active = false;
      // }
      this.service.UpdateData(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
          } else this.utils.toast.error(res['message']);
          this.form.disable();
          this.isDisabled = true;
          this.isExpanded = false;
          this.id = 0;
        },
        (error) => {
          this.onError(error, ErrorMessages.vehicle.update_data);
        }
      );
    }
  }
  ExpiringPlateActive(val) {
    if (val) {
      this.nonExpiringPlate = true;
    } else {
      this.nonExpiringPlate = false;
    }
    this.service.NonExpiringVehicleId(this.id, val).subscribe(
      (res) => {
        //this.utils.toast.success(res["message"]);
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.non_expiring_vehicle_id);
      }
    );
  }
  checkSerialNo(sNo) {
    this.service.checkVIN(sNo).subscribe(
      (res) => {
        if (res.status == 0) {
          this.form.get('serialNumber').setValue('');
          this.utils.toast.error(res['message']);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.vehicle.check_VIN);
      }
    );
  }

  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(
      error,
      ModuleNames.vehicle_info,
      customMessage
    );
  }
}
