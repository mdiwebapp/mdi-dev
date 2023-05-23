import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessages, ModuleNames } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';
import { DropdownService } from 'src/app/core/services/dropdown.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DevicesService } from '../devices/devices.service';
import {
  computerDeviceModel,
  mobileDeviceModel,
  hostpotDeviceModel,
  DeviceInfoModel,
} from './device-info.model';
@Component({
  selector: 'app-devices-info',
  templateUrl: './devices-info.component.html',
  styleUrls: ['./devices-info.component.scss'],
})
export class DevicesInfoComponent implements OnInit {
  form: FormGroup;
  deviceList = ['Desktop', 'Laptop', 'Phone', 'Tablet', 'HotSpot'];
  statusList = [
    'Assigned',
    'Locked',
    'NeedsRepair',
    'Pending Assignment',
    'Pending Return',
    'Spare',
  ];
  employeeList: any;
  UserFilterData: any;
  locationList: any;
  LocationFilterData: any;
  isExpand: boolean = false;
  id: number;
  setpurchaseDate: Date;
  setissueDate: Date;
  oldBranchValue:string = '';
  oldAutoImport:any
  isLocationChanged:boolean = false;
  newDeviceId:number;
  newDevicePrefix:string = '';
  generatedDeviceId:string = '';
  DeviceType:string = '';
  isAdd: boolean = false;
  isShown:boolean = false;
  isNewDevicePrefix:boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    public service: DevicesService,
    public datepipe: DatePipe,
    public dropdownservice: DropdownService,
    public errorHandler: ErrorHandlerService,
    private utils: UtilityService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.GetUser();
    this.GetLocation();
  }
  initForm(): void {
    this.form = this.formBuilder.group({
      id: [0],
      user_PK: [0],
      employeeId: [0],
      type: ['Desktop', Validators.required],      
      status: [0],
      userName: [''],
      brand: [''],
      location: [''],
      //issuedUser: [''],
      issuedDate: [null],
      model: [''],
      deviceId:[0 , Validators.pattern('^[0-9]*$')],
      partNumber: [''],
      serialNumber: [''],
      macAddress: [''],
      inactivatedReason: [null],
      autoImport: [null],
      CD_hdd: [''],
      CD_processor: [''],
      CD_speed: [''],
      CD_os: [''],
      CD_licenceKEY: [''],
      CD_ram: [''],
      CD_mac: [''],
      CD_purchaseDate: [null],
      CD_belarc: [false],

      MD_gSuite: [false],
      MD_vmdm: [false],
      imei: [''],
      sim: [''],
      phoneNumber: [''],
      MD_phoneSerial: [''],
      devicePrefix:[null]
    });
  }
  onEdit(data) {
    this.form.disable();
    if (data != null) {
      this.id = data.id;
      if (data.id > 0) {
        this.setValue(data);
      } else {
        this.form.reset();
      }
    } else {
      this.form.reset();
    }
  }
 GetUser() {
    this.dropdownservice.GetAllEmployeesList().subscribe(
      (res) => {
        if (res) {
          this.employeeList = res.result;
          this.employeeList.unshift({ "id": 0, "value": "Unassigned" });
          this.employeeList.unshift({ "id": 1, "value": "Non-Employee" });
          this.UserFilterData = this.employeeList;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.devices.get_error);
      }
    );
  }
  GetLocation() {
    this.dropdownservice.GetBranchList().subscribe(
      (res) => {
        if (res) {
          this.locationList = res;
          this.LocationFilterData = res;
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.devices.get_error);
      }
    );
  }
  setExpand(val) {    
    if (val) this.isExpand = true;
    else this.isExpand = false;    
    if(this.isAdd){
      this.isShown = true;
      
      if(val!=null || val!= undefined){
        if(val=="Laptop"){
          this.DeviceType = "Laptop"
        val = 1;
        }
        else if (val == "Phone"){
          this.DeviceType = "Phone"
          val = 2;
        }
        else if (val == "Desktop"){
          this.DeviceType = "Desktop"
          val = 3;
        }
        else if (val == "HotSpot"){
          this.DeviceType = "HotSpot"
          val = 4;
        }
        else if (val == "Tablet"){
          this.DeviceType = "Tablet"
          val = 5;
        }
        this.service.GenerateDeviceId(val).subscribe(
          (res)=>{
            console.log('res', res)
            this.newDeviceId = parseInt(res.deviceID);
            this.newDevicePrefix=res.prefix + '-';
            this.generatedDeviceId = this.newDevicePrefix + this.newDeviceId;
            this.form.controls['deviceId'].setValue(this.newDeviceId);  
            this.form.controls['devicePrefix'].setValue(this.newDevicePrefix);
            this.isNewDevicePrefix=true
            if(this.DeviceType == "Desktop" || this.DeviceType == "Laptop"){
              this.form.controls['deviceId'].setValue(this.newDeviceId);     
              this.form.controls['devicePrefix'].setValue(this.newDevicePrefix);
              this.isNewDevicePrefix=false
            }
            else
            {
              this.isNewDevicePrefix=true;

            }
              
          }
        )
      }
    }
   
  }

  btnAdd() {
    this.id = 0;
    this.form.reset();
    this.form.enable();  
    this.setpurchaseDate = null;
    this.setissueDate = null;
    this.isAdd = true;
  }
  btnEdit() {
    this.form.enable();
  }
  btnCancel() {
    this.isShown=false;
    this.isNewDevicePrefix=false;
  }
  setValue(data: any) {   
    this.form.setValue({
      employeeId: data.employeeId,
      type: data.type,
      status: data.status,
      brand: data.brand,
      location: data?.location,
      //issuedUser: data.issuedUser,
      issuedDate: null,
      model: data.model,
      partNumber: data.partNumber,
      serialNumber: data.serialNumber,
      macAddress: data.macAddress,
      inactivatedReason: data.inactivatedReason,
      autoImport: null,
      CD_hdd: data.computerDevice.hdd,
      CD_processor: data.computerDevice.processor,
      CD_speed: data.computerDevice.speed,
      CD_os: data.computerDevice.os,
      CD_licenceKEY: data.computerDevice.licenceKEY,
      CD_ram: data.computerDevice.ram,
      CD_purchaseDate: null,
      CD_belarc: data.computerDevice.belarc,
      CD_mac: '',
      MD_gSuite: data.mobileDevice.gSuite,
      MD_vmdm: data.mobileDevice.vmdm,
      deviceId:0,
      devicePrefix:null,
      imei:
        data.mobileDevice.imei == null
          ? data.hostpotDevice.imei == null
            ? ''
            : data.hostpotDevice.imei
          : data.mobileDevice.imei,
      sim:
        data.mobileDevice.sim == null
          ? data.hostpotDevice.sim == null
            ? ''
            : data.hostpotDevice.sim
          : data.mobileDevice.sim,
      phoneNumber:
        data.mobileDevice.phoneNumber == null
          ? data.hostpotDevice.phoneNumber == null
            ? ''
            : data.hostpotDevice.phoneNumber
          : data.mobileDevice.phoneNumber,
      MD_phoneSerial: data.mobileDevice.phoneSerial,

      id: data.id,
      userName: data.userName,
      user_PK: data.user_PK,
    });
    this.oldBranchValue = data.location;
    this.oldAutoImport = data.autoImport;
    this.setpurchaseDate = !data.computerDevice.purchaseDate
      ? null
      : new Date(
          this.datepipe.transform(
            data.computerDevice.purchaseDate,
            'yyyy-MM-dd'
          )
        );

    this.setissueDate = !data.issuedDate
      ? null
      : new Date(this.datepipe.transform(data.issuedDate, 'yyyy-MM-dd'));
      let branch = this.locationList.find(
        (i) => i.code == data.location
      );
      if(branch != null || branch != undefined) {
        this.form.controls['location'].setValue(branch.value);
      }    
      // if(data.issuedUser != null || data.issuedUser != undefined) {
      //   this.form.controls['employeeId'].setValue('');
      // }
      
  }
  onSave(active) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return true;
    }
    this.isShown=false;
    this.isNewDevicePrefix=false;
    const data = new DeviceInfoModel();
    data.computerDevice = new computerDeviceModel();
    data.mobileDevice = new mobileDeviceModel();
    data.hostpotDevice = new hostpotDeviceModel();
    data.id = this.id;
    data.active = active;
    data.autoImport = this.form.value.autoImport == null ? null : this.form.value.autoImport;
    data.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    data.user_PK = JSON.parse(localStorage.getItem('currentUser')).id;
    data.employeeId = this.form.value.employeeId == null ? 0 : this.form.value.employeeId;
    data.type = this.form.value.type;
    data.issuedDate = this.setissueDate;
    data.status =
      this.form.value.status == 'Needs Repair' ? 'NeedsRepair'
        : this.form.value.status == 'Pending Assignment'
        ? 'PendingAssignment'
        : this.form.value.status == 'Pending Return'
        ? 'PendingReturn'
        : this.form.value.status;
    data.brand = this.form.value.brand;
    data.location = this.form.value.location == null ? '' : this.form.value.location;
    //data.issuedUser = this.form.value.issuedUser;
    data.model = this.form.value.model;
    data.partNumber = this.form.value.partNumber;
    data.serialNumber = this.form.value.serialNumber;
    data.macAddress = this.form.value.macAddress;
   // data.inactivatedReason = this.form.value.inactivatedReason;
    data.computerDevice.hdd = this.form.value.CD_hdd;
    data.computerDevice.belarc = this.form.value.CD_belarc;
    data.computerDevice.processor = this.form.value.CD_processor;
    data.computerDevice.speed = this.form.value.CD_speed;
    data.computerDevice.purchaseDate = this.setpurchaseDate;
    data.computerDevice.os = this.form.value.CD_os;
    data.computerDevice.licenceKEY = this.form.value.CD_licenceKEY;
    data.computerDevice.ram = this.form.value.CD_ram;
    data.mobileDevice.gSuite = this.form.value.MD_gSuite;
    data.mobileDevice.vmdm = this.form.value.MD_vmdm;
    data.mobileDevice.imei = this.form.value.imei;
    data.mobileDevice.sim = this.form.value.sim;
    data.mobileDevice.phoneNumber = this.form.value.phoneNumber;
    data.mobileDevice.phoneSerial = this.form.value.MD_phoneSerial;
    data.hostpotDevice.imei = this.form.value.imei;
    data.hostpotDevice.sim = this.form.value.sim;
    data.hostpotDevice.phoneNumber = this.form.value.phoneNumber;
    // if(this.DeviceType == "Desktop" || this.DeviceType == "Laptop")
    // {
    //   data.deviceId = this.form.value.deviceId;

    // }
    // else
    // {
      data.deviceId =this.newDevicePrefix +  this.form.value.deviceId;

    // }
    if(data.status == null || data.status === undefined || data.status == 0)
    {
      data.status = 7;
    }
    if(this.isLocationChanged)
    {
      this.isLocationChanged = false;
      data.location = this.form.value.location == null ? '' : this.form.value.location;
    }
    else
    {
      data.location = this.oldBranchValue;    
    }
    if(this.oldAutoImport != data.autoImport)
    {
        data.autoImport = this.oldAutoImport;
    }
  
    if(data.issuedDate != null)
    {
      data.issuedDate = new Date(
        this.datepipe.transform(
          data.issuedDate,
          'yyyy-MM-dd'
        )
      );
    }
    if (this.id > 0) {
      //data.active = active;
      this.service.UpdateDevice(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.utils.toast.success(res['message']);
            // this.SaveEditClick.emit(res);
          } else this.utils.toast.error(res['message']);

          this.form.disable();

          this.id = 0;
        },
        (error) => {
          
          this.onError(error, ErrorMessages.devices.get_error);
        }
      );
    } else {
      this.service.SaveDevice(data).subscribe(
        (res) => {
          if (res['status'] == 200) {
            if(res.message == "Device Id already Exists" && res.result == null)
            {
              this.utils.toast.error(res['message']);
            }          
            // this.SaveEditClick.emit(res);
          } else  this.utils.toast.success(res['message']);

          this.form.disable();
          this.id = 0;
        },
        (error) => {
          this.onError(error, ErrorMessages.devices.get_error);
        }
      );
    }
     this.isAdd = false;

  }

  checkSerialNo(sNo) {
    this.service.checkMacaddress(sNo).subscribe(
      (res) => {
        if (res.status == 0) {
          this.form.get('CD_mac').setValue('');
          this.utils.toast.error(res['message']);
        }
      },
      (error) => {
        this.onError(error, ErrorMessages.devices.get_error);
      }
    );
  }
  private onError(error: any, customMessage?: string) {
    this.errorHandler.handleError(error, ModuleNames.devices, customMessage);
  }
  onLocationChange(data){
    this.isLocationChanged = true;
  
    if(this.DeviceType == "Desktop" || this.DeviceType == "Laptop")
    {
       if(data == "Global Pump Mfg" || data == "Global Pump Rental")
      {
        this.newDevicePrefix = "GPC" + '-';
        this.form.controls['deviceId'].setValue(this.newDeviceId);  
        this.form.controls['devicePrefix'].setValue(this.newDevicePrefix);   
          
      }
      else
      {
        this.newDevicePrefix = "MDI" + '-';
        this.form.controls['deviceId'].setValue( this.newDeviceId);    
        this.form.controls['devicePrefix'].setValue(this.newDevicePrefix);  
      }
      this.generatedDeviceId = this.newDevicePrefix + this.newDeviceId;
    }
    
  }
  onDeviceIdChange(event){
    this.newDeviceId = event;
    this.generatedDeviceId = this.newDevicePrefix + this.newDeviceId; 
  }
}
