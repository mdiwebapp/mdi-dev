import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import {FieldNotesModel} from '../field-notes/field-notes.model';
import {FieldNotesService} from '../../../../app/layout/service/field-notes/field-notes.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MenuService } from 'src/app/core/helper/menu.service';
@Component({
  selector: 'app-field-notes',
  templateUrl: './field-notes.component.html',
  styleUrls: ['./field-notes.component.scss']
})
export class FieldNotesComponent implements OnInit {
  public virtual: any = {
    itemHeight: 28,
  };
  fieldNotesForm: FormGroup;
  inventorynumbers: [];
  visible:boolean;
  // inventorynumbers: any = [
  //   {
  //     label: 'All',
  //     value: '',
  //   },
  //   {
  //     label: '0036065 - ENGINE',
  //     value: '0036065 - ENGINE',
  //   },
  //   {
  //     label: '0036376 - ENGINE',
  //     value: '0036376 - ENGINE',
  //   },
  //   {
  //     label: '0042540 - ENGINE',
  //     value: '0042540 - ENGINE',
  //   },
  //   {
  //     label: '00431993 - ENGINE',
  //     value: '00431993 - ENGINE',
  //   },
  //   {
  //     label: '0049306 - ENGINE',
  //     value: '0049306 - ENGINE',
  //   },
  //   {
  //     label: '0049306 - CHASSIS',
  //     value: '0049306 - CHASSIS',
  //   },
  //   {
  //     label: '0049607 - CHASSIS',
  //     value: '0049607 - CHASSIS',
  //   },
  //   {
  //     label: '0049908 - CHASSIS',
  //     value: '0049908 - CHASSIS',
  //   },
  //   {
  //     label: '0051211 - CHASSIS',
  //     value: '0051211 - CHASSIS',
  //   },
  // ];
  
  constructor(
    private formBuilder: FormBuilder,
    private service:FieldNotesService,
    private utility: UtilityService,public menuService: MenuService,
    ) {
      if (localStorage.getItem('isAdmin') == 'true') {
     
      } else {
        let acc = this.menuService.checkUserViewRights('Field Notes');
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
        this.menuService.checkUserBySubmoduleRights('Field Notes');
      }
     }

  ngOnInit(): void {
    this.initForm();
    this.getInventoryNumbers();
    
  }
  initForm(): void {
    this.fieldNotesForm = this.formBuilder.group({
      
      note: ['', [Validators.required]],
      inventoryNumber:['', [Validators.required]],
      reportedBy:['', [Validators.required]]
    });
  }

  getInventoryNumbers() {
    this.visible = false;
    this.visible = true;
    this.service.GetInventoryNumbers().subscribe((res) => {  
      //this.inventorynumbers = res.map((res) => res.inventoryNumber);
      this.inventorynumbers = res.map(res => {
        return {
          label: res.inventoryNumber,
          value: res.invnum
        };
      });
        this.visible = true;
        this.visible = false;
    });
  }

  onSubmit() {
    
    if (this.fieldNotesForm.invalid) {
      this.fieldNotesForm.markAllAsTouched();
      return false;
    }

    this.visible = false;
    this.visible = true;
    const field_notes  = new FieldNotesModel();
    field_notes.id = 0;
    field_notes.userName = JSON.parse(localStorage.getItem('currentUser')).userName;
    field_notes.user_PK = 0;
    field_notes.serviceHeaderId = 0;
    field_notes.subject = null,
    field_notes.note = this.fieldNotesForm.value.note;
    field_notes.inventoryNumber = this.fieldNotesForm.value.inventoryNumber;
    field_notes.reportedBy = this.fieldNotesForm.value.reportedBy;
    field_notes.createdBy = JSON.parse(localStorage.getItem('currentUser')).userName
    
      this.service.AddFieldNotes(field_notes).subscribe(
        (res) => {
          if (res['status'] == 200) {
            this.visible = true;
          this.visible = false;
            this.utility.toast.success(res['message']);
            this.fieldNotesForm.reset();
          } else { 
            this.visible = true;
            this.visible = false;
            this.utility.toast.error(res['message']);}
        },
      );
  }
}
