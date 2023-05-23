import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NetworkDirectoryService } from './networkdirectory.service';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { NodeClickEvent } from '@progress/kendo-angular-treeview';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const is = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);
@Component({
  selector: 'app-networkdirectry',
  templateUrl: './networkdirectory.component.html',
  styleUrls: ['./networkdirectory.component.scss'],
})
export class NetworkDirectoryComponent implements OnInit {
  public data: any[];
  public subDirData: any[];
  displayFileDetails: any;
  public files: any[];
  public previewImg: number;
  vehicleNumber: string;
  valuesFile = {
    directoryPath: '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\S215',
    userName: 'MERSINO\\jagdip.joshi',
    password: 'oPDe8GP!SW83HNJS',
  } as any;
  imagUrl: any;
  displayImage: boolean = false;
  show: boolean = false;
  showUserCredentials: boolean = false;

  viewer = 'google';
  DemoDoc = 'http://www.africau.edu/images/default/sample.pdf';
  public expandedNames: any[];
  regexImage = '[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$';
  networkform: FormGroup;
  constructor(
    private networkService: NetworkDirectoryService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private utility: UtilityService
  ) { }

  ngOnInit() {
    this.vehicleNumber = '';
    this.subDirData = [];

    this.networkform = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      drivePath: ['', Validators.required],
    });
  }

  loadNetworkFolders() {
    var directoryPath = this.networkform.get('drivePath').value;
    this.valuesFile.directoryPath = '';
    this.valuesFile.userName = '';
    this.valuesFile.directoryPath = directoryPath.replace(/\\\\/g, '\\');
    this.valuesFile.userName = this.networkform
      .get('username')
      .value.replace(/\\\\/g, '\\');
    this.valuesFile.password = this.networkform.get('password').value;
    this.loadNetworkFiles(this.valuesFile);
    this.showUserCredentials = false;
  }

  loadNetworkFiles(valuesFile,jobNumber=0) {
    this.networkService.GetDirectoryDetails(valuesFile).subscribe(
      (res) => {
        res.forEach((element) => {
          if (element.name == null) {
            element.name =jobNumber==0? 'Logistics':jobNumber;
            this.expandedNames = [jobNumber==0? 'Logistics':jobNumber];
            if (element.path != null) {
              if (!element.path.toString().match(this.regexImage)) {
                element.displayImage = false;
              } else {
                element.displayImage = true;
              }
            } else {
              element.displayImage = false;
            }
          }
          this.subdirectory(element);
        });
        this.data = res;
        this.filesubDirectory(res[0]);
        this.subdirectory(res[0]);
        this.files = res[0].files;
        this.selectedFiles(res[0]);
      },
      (failed) => {
        this.utility.toast.error(
          "You don't have permission to access " + valuesFile.directoryPath
        );
      }
    );
  }

  subdirectory(res) {
    res.subDirectories.forEach((element) => {
      this.changeElementDisplayName(element);
      this.filesubDirectory(element);
      this.subdirectory(element);
    });
  }

  filesubDirectory(res) {
    res.files.forEach((element) => {
      this.changeElementDisplayName(element);
    });
  }

  changeElementDisplayName(element) {
    if (element.name.startsWith('\\')) {
      element.name = element.name.substring(1);
    }
    if (element.path != null) {
      if (!element.path.toString().match(this.regexImage)) {
        element.displayImage = false;
      } else {
        element.displayImage = true;
      }
    } else {
      element.displayImage = false;
    }
  }

  selectedFiles(e) {
    e.files.forEach((element) => {
      this.changeElementDisplayName(element);
    });
    this.files = e.files;
    if (e.subDirectories.length > 0) {
      this.subDirData = e.subDirectories;
    } else {
      this.subDirData = [];
    }
  }

  previewImage(dataItem) {
    //let thefile = {};
    let unsafeImageUrl;
    let ext = dataItem.path.split('.').pop();
    this.networkService.DownloadFile(encodeURI(dataItem.path)).subscribe(
      (data) => {
        let thefile = new Blob([data], { type: data.type });
        unsafeImageUrl = URL.createObjectURL(thefile);
        this.imagUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        this.displayImage = true;
        this.show = true; // !this.show;
        if (ext != 'JPEG' && ext != 'jpeg' && ext != 'jpg' && ext != 'JPG' && ext != 'png' && ext != 'PNG') {
          this.displayImage = false;
        }
      },
      (error) => {
        console.log('Something went wrong');
      }
    );
  }

  closePopup() {
    this.show = false; // !this.show;
  }

  downloadFile(dataItem) {
    this.networkService.DownloadFile(encodeURI(dataItem.path)).subscribe(
      (data) => {
        saveAs(data, dataItem.name);
      },
      (error) => {
        console.log('Something went wrong');
      }
    );
  }

  public iconClass({ name, items }: any): any {
    if (name.split('.').length > 1) {
      return {
        'k-i-file-pdf': is(name, 'pdf'),
        'k-i-file-txt': is(name, 'txt'),
        'k-i-file-xls': is(name, 'xlsx|xls'),
        'k-i-file-doc': is(name, 'docx|doc'),
        'k-i-image': is(name, 'jpg|png|jpeg|JPG|PNG|JPEG'),
        //"k-i-html": is(name, "html"),
        'k-icon': true,
      };
    } else {
      return { 'k-i-folder': items.length !== undefined, 'k-icon': true };
    }
  }

  public selectedKeys: any[] = ['0'];
  public next() {
    if (parseInt(this.selectedKeys[0]) < this.files.length) {
      this.previewImg = parseInt(this.selectedKeys[0]) + 1;
      this.selectedKeys = [this.previewImg];
      this.previewImage(this.files[this.previewImg]);
    }
  }

  public previous() {
    if (parseInt(this.selectedKeys[0]) > 0) {
      this.previewImg = parseInt(this.selectedKeys[0]) - 1;
      this.selectedKeys = [this.previewImg];
      this.previewImage(this.files[this.previewImg]);
    }
  }

  loadFolderByVehicleNo(vehicleNumber) {
    this.vehicleNumber = vehicleNumber;
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' + vehicleNumber;
    this.loadNetworkFiles(this.valuesFile);
  }
  loadFolderByPhysicalInv() {
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\Scrapped Inventory\\';
    this.loadNetworkFiles(this.valuesFile);
  }
  loadFolderByComponent(serialNumber) {
    //this.vehicleNumber = serialNumber;
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' + serialNumber;
    this.loadNetworkFiles(this.valuesFile);
  }
  loadFolderByServiceOrder(serialNumber) {
    //this.vehicleNumber = serialNumber;
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' + serialNumber;
    this.loadNetworkFiles(this.valuesFile);
  }
  loadFolderByFleetNo(InvNumber) { 
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\FLEET BOOKS\\' + InvNumber;
    this.loadNetworkFiles(this.valuesFile);
  }
  public onNodeDblClick(event: NodeClickEvent): void {
    let ext = event.item.dataItem.path.split('.').pop();
    if (ext != 'jpg') {
      this.downloadFile(event.item.dataItem);
    } else {
      this.previewImage(this.files[parseInt(this.selectedKeys[0])]);
    }
  }
  loadFolderByProject(jobNumber) {
    //this.vehicleNumber = serialNumber;
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\02  Operations\\JOB BOOKS\\' + jobNumber;
    this.loadNetworkFiles(this.valuesFile,jobNumber);
  }
  loadFolderByInventoryTransfer(transferNo) {
    //this.vehicleNumber = serialNumber;
    this.valuesFile.directoryPath =
      '\\\\192.168.0.2\\Mersino\\03  Logistics\\Branch Inventory Transfers\\' + transferNo;
    this.loadNetworkFiles(this.valuesFile);
  }
}
