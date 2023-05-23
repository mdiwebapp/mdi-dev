import { Injectable } from '@angular/core';
import { RightsVM } from './RightsVM';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  Rights: RightsVM[] = [];
  isViewRight: boolean = true;
  isAddRight: boolean = true;
  isEditRight: boolean = true;
  isDeleteRight: boolean = true;

  isMoreViewRight: boolean = true;
  isMoreAddRight: boolean = true;
  isMoreEditRight: boolean = true;
  isMoreDeleteRight: boolean = true;
  isSSGRight: boolean = true;
  isVINRight: boolean = true;
  isSSNRight: boolean = true;
  isLicenseRight: boolean = true;
  isOpenTechCheck: boolean = true;
  isEditClosedOrder: boolean = true;
  isDwQuoteTool: boolean = true;
  isWPQuoteTool: boolean = true;
  isBPQuoteTool: boolean = true;
  isSellToJob: boolean = true;
  isUpdateSN:boolean = true;
  isOverride:boolean = true;
  constructor() {}

  checkUserRights(moduleName) {
    try {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (localStorage.getItem('isAdmin') != 'true') {
        if (rights) {
          var pageModuleRights = rights.find(
            (x) => x.moduleName.toLowerCase() == moduleName
          );
          if (pageModuleRights) {
            if (pageModuleRights.tabName.toLowerCase() == 'add') {
              //let obj = pageModuleRights.find(x => x.tabName == 'Add');
              //if (obj) {
              this.isAddRight = true;
              //}else{
              //}
            } else {
              this.isAddRight = false;
            }
            if (
              pageModuleRights.tabName.toLowerCase() == 'edit' ||
              pageModuleRights.tabName.toLowerCase() == 'update'
            ) {
              // let obj = pageModuleRights.find(x => x.tabName == 'Edit');
              // if (obj) {
              this.isEditRight = true;
              //}
            } else {
              this.isEditRight = false;
            }
            if (pageModuleRights.tabName.toLowerCase() == 'delete') {
              // let obj = pageModuleRights.find(x => x.tabName == 'Delete');
              // if (obj) {
              this.isDeleteRight = true;
              //}
            } else {
              this.isDeleteRight = false;
            }
            if (pageModuleRights.tabName.toLowerCase() == 'view') {
              // let obj = pageModuleRights.find(x => x);
              // if (obj) {
              this.isViewRight = true;
              //}
            } else {
              this.isViewRight = false;
            }
          }
          this.isViewRight = false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  checkUserBySubmoduleRights(moduleName) {
    try {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (localStorage.getItem('isAdmin') != 'true') {
        if (rights) {
          var pageModuleRights = rights.filter(
            (x) => x.subModuleName == moduleName
          );
          if (pageModuleRights.length > 0) {
            let obj = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'add'
            );
            if (obj) {
              this.isAddRight = true;
            } else {
              this.isAddRight = false;
            }
            let objz = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'vehicle identification number'
            );
            if (objz) {
              this.isVINRight = true;
            } else {
              this.isVINRight = false;
            }
            let obju = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'edit' || x.tabName == 'update'
            );
            if (obju) {
              this.isEditRight = true;
            } else {
              this.isEditRight = false;
            }
            let objV = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'view'
            );
            if (objV) {
              this.isViewRight = true;
            }
            let objw = pageModuleRights.find(
              (x) => (x.tabName.toLowerCase() == 'update SN' || x.tabName.toLowerCase() == ' update sn')
            );
            if (objw) {
              this.isUpdateSN = true;
            } else {
              this.isUpdateSN = false;
            }
            let objp = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'open tech check'
            );
            if (objp) {
              this.isOpenTechCheck = true;
            } else {
              this.isOpenTechCheck = false;
            }
            let objr = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'edit closed order'
            );
            if (objr) {
              this.isEditClosedOrder = true;
            } else {
              this.isEditClosedOrder = false;
            }
            let objs = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'dw quote tool'
            );
            if (objs) {
              this.isDwQuoteTool = true;
            } else {
              this.isDwQuoteTool = false;
            }
            let objk = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'wp quote tool'
            );
            if (objk) {
              this.isWPQuoteTool = true;
            } else {
              this.isWPQuoteTool = false;
            }
            let objh = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'bp quote tool'
            );
            if (objh) {
              this.isBPQuoteTool = true;
            } else {
              this.isBPQuoteTool = false;
            }
            let objl = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'sell to job'
            );
            if (objl) {
              this.isSellToJob = true;
            } else {
              this.isSellToJob = false;
            }
            let objOvr = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'override'
            );
            if (objOvr) {
              this.isOverride = true;
            } else {
              this.isOverride = false;
            }
            let objEmp = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'ss number'
            );
            if (objEmp) {
              this.isSSNRight = true;
            } else {
              this.isSSNRight = false;
            }
            let objEmpLic = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'license number'
            );
            if (objEmpLic) {
              this.isLicenseRight = true;
            } else {
              this.isLicenseRight = false;
            }
          } else {
            this.isAddRight = false;
            this.isEditRight = false;
            this.isViewRight = false;
            this.isUpdateSN = false;
            this.isOpenTechCheck = false;
            this.isEditClosedOrder = false;
            this.isDwQuoteTool = false;
            this.isWPQuoteTool = false;
            this.isBPQuoteTool = false;
            this.isOverride=false;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  checkUserViewRights(moduleName) {
    try {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (localStorage.getItem('isAdmin') != 'true') {
        if (rights) {
          var pageModuleRights = rights.find(
            (x) => x.moduleName.toLowerCase() == moduleName.toLowerCase()
          );
          if (pageModuleRights) {
            if (pageModuleRights.tabName.toLowerCase() == 'view' || pageModuleRights.tabName.toLowerCase() == 'add') {
              return true;
            } else {
              return false;
            }
          }
          return false;
        }
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  checkVendorMoreRights(moduleName) {
    try {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (localStorage.getItem('isAdmin') != 'true') {
        if (rights) {
          var pageModuleRights = rights.filter(
            (x) => x.moduleName == 'Vendor' && x.subModuleName == moduleName
          );
          if (pageModuleRights.length > 0) {
            // let obj = pageModuleRights.find(x => x.tabName.toLowerCase() == 'add');
            // if (obj) {
            //   this.isMoreAddRight = true;
            // } else {
            //   this.isMoreAddRight = false;
            // }

            let obju = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'edit' || x.tabName == 'update'
            );
            if (obju) {
              this.isMoreEditRight = true;
            } else {
              this.isMoreEditRight = false;
            }
            let objV = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'view'
            );
            if (objV) {
              this.isMoreViewRight = true;
            }
            let objSSG = pageModuleRights.find(
              (x) => x.tabName.toLowerCase() == 'ssg'
            );
            if (objSSG) {
              this.isSSGRight = true;
            } else {
              this.isSSGRight = false;
            }
          } else {
            this.isMoreAddRight = false;
            this.isMoreEditRight = false;
            this.isMoreViewRight = false;
            this.isSSGRight = false;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  checkUserSubMenuViewRights(moduleName) {
    try {
      const rights = JSON.parse(localStorage.getItem('Rights'));
      if (localStorage.getItem('isAdmin') != 'true') {
        if (rights) {
          var pageModuleRights = rights.find(
            (x) => x.subModuleName.toLowerCase() == moduleName.toLowerCase()
          );
          if (pageModuleRights) {
            if (pageModuleRights.tabName.toLowerCase() == 'view' || pageModuleRights.tabName.toLowerCase() == 'add') {
              return true;
            } else {
              return false;
            }
          }
          return false;
        }
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
