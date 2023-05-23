import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ReadyToRentService} from '../ready-to-rent/ready-to-rent.service';
import { saveAs } from 'file-saver';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';

@Component({
  selector: 'app-ready-to-rent',
  templateUrl: './ready-to-rent.component.html',
  styleUrls: ['./ready-to-rent.component.scss'],
})
export class ReadyToRentComponent implements OnInit {
  readytorentForm: FormGroup;
  isSubmitVisible: boolean = false;
  isErrorDialogVisible: boolean = false;
  error_title: string = '';
  error_msg: string = '';
  visible:boolean = false;

  constructor(private formBuilder: FormBuilder,public menuService: MenuService, private utility: UtilityService,
    private service:ReadyToRentService) {
      if (localStorage.getItem('isAdmin') == 'true') {
     
      } else {
        let acc = this.menuService.checkUserSubMenuViewRights('Ready to rent');
          if (acc) {
            //this.utils.toast.error("User does not have rights to access " + name + " module.");Z
          } else {
            this.utility.toast.error(
              'You do not have permissions to access this part of the system. Please contact your supervisor so they can request them from IT.'
            );
            setTimeout(() => {
              var url = '/dashboard';
              location.href = url;
            }, 1000);
          }
        
      }
    }

  ngOnInit(): void {
    this.onInitReadyTorentForm();
  }

  onInitReadyTorentForm() {
    this.readytorentForm = this.formBuilder.group({
      greentag: true,
      redtag: true,
      onjoboffrent: true,
      majorrepairs: false,
    });
  }

  onSubmitReadyToRent() {
    let values = this.readytorentForm.value;
    if (
      !values.greentag &&
      !values.redtag &&
      !values.onjoboffrent &&
      !values.majorrepairs
    ) {
      this.error_title = 'INVALID SELECTION';
      this.error_msg = 'You must select at least one option.';
      this.isErrorDialogVisible = true;
    } else {
      this.visible = false;
      this.visible =true;
      var request = {greenTag: values.greentag, redTag:values.redtag , onRent:values.onjoboffrent , majorRepair: values.majorrepairs}
      this.service.ExportReadytoReport(request).subscribe((res) => {
        if(res.size > 0) {
          saveAs(res, "ReadyToRentReport.xlsx");
          this.visible=true;
          this.visible=false;
          }
          else
          {
            this.visible = true;
            this.visible = false;
          }
      },(error) => {
        this.visible = true;
            this.visible = false;
      })
    }
  }

  onHandleDialog(value) {
    switch (value) {
      case 'submit':
        this.isSubmitVisible = !this.isSubmitVisible;
        break;
      case 'error':
        this.isErrorDialogVisible = !this.isErrorDialogVisible;
        break;
      default:
        break;
    }
  }
}
