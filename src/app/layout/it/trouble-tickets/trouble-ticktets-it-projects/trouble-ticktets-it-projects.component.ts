import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { usersData } from 'src/data/call-logs-data';

@Component({
  selector: 'app-trouble-ticktets-it-projects',
  templateUrl: './trouble-ticktets-it-projects.component.html',
  styleUrls: ['./trouble-ticktets-it-projects.component.scss'],
})
export class TroubleTicktetsItProjectsComponent implements OnInit {
  projects: any = [];
  projectColumns: any = [
    {
      Name: 'project',
      isCheck: true,
      Text: 'IT Project',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'requestedBy',
      isCheck: true,
      Text: 'Requested By',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'requestedDate',
      isCheck: true,
      Text: '',
      isDisable: false,
      index: 0,
      width: 100,
    },
    {
      Name: 'assignedTo',
      isCheck: true,
      Text: 'Assigned To',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  assignedColumns: any = [
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  selectedProject: any = {};
  sort: SortDescriptor[] = [
    {
      field: 'project',
      dir: 'asc',
    },
    {
      field: 'requestedBy',
      dir: 'asc',
    },
    {
      field: 'requestedDate',
      dir: 'asc',
    },
    {
      field: 'assignedTo',
      dir: 'asc',
    },
  ];
  selections: any = [0];
  employeeSelections: number[] = [0];
  skip: number = 0;
  multiple: boolean = false;
  isDisable: boolean = true;
  isEditable: boolean = false;
  projectForm: FormGroup;
  isEmployeeVisible: boolean = false;
  employeesColumns: any = [
    {
      Name: 'employeeId',
      isCheck: true,
      Text: 'EE#',
      isDisable: false,
      index: 0,
      width: 50,
    },
    {
      Name: 'name',
      isCheck: true,
      Text: 'Name',
      isDisable: false,
      index: 0,
      width: 100,
    },
  ];
  employees: any = [];
  isAssignedVisible: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.projects = [
      {
        userRequest: 'Test',
        project: '8',
        requestedBy: 'Shannie',
        requestedDate: '01/26/2021',
        assignedTo: 'Andrew Root',
        supervisor: 'Jeff Nettleman',
        supervisorApproved: 'Yes',
        supervisorApprovedDate: '3/4/2021 3:43:38 PM',
        ginoApproved: 'No',
        ginoApprovedDate: '',
        notes: 'Test',
        priority: 'medium',
        assignedDate: '3/4/2021 3:43:38 PM',
        close: 'No',
      },
      {
        userRequest: 'Test',
        project: '4',
        requestedBy: 'Gino Mersino',
        requestedDate: '03/04/2021',
        assignedTo: 'Andy',
        supervisor: 'Jeff Nettleman',
        supervisorApproved: 'Yes',
        supervisorApprovedDate: '3/4/2021 3:43:38 PM',
        ginoApproved: 'No',
        ginoApprovedDate: '',
        notes: 'Test',
        priority: 'medium',
        assignedDate: '3/4/2021 3:43:38 PM',
        close: 'No',
      },
      {
        userRequest: 'Test',
        project: '5',
        requestedBy: 'Michael',
        requestedDate: '03/16/2021',
        assignedTo: 'Paul',
        supervisor: 'Jeff Nettleman',
        supervisorApproved: 'Yes',
        supervisorApprovedDate: '3/4/2021 3:43:38 PM',
        ginoApproved: 'No',
        ginoApprovedDate: '',
        notes: 'Test',
        priority: 'medium',
        assignedDate: '3/4/2021 3:43:38 PM',
        close: 'No',
      },
    ];
    this.employees = usersData;
  }

  ngOnInit(): void {
    this.onInitForm(this.projects[0]);
  }

  onResizeColumn(event) {}

  onSelectionChange(event, type) {
    switch (type) {
      case 'project':
        this.selectedProject = event.selectedRows[0].dataItem;
        this.onInitForm(event.selectedRows[0].dataItem);
        break;
      case 'employees':
        this.projectForm.setValue({
          ...this.projectForm.value,
          requestedBy: event.selectedRows[0].dataItem.name,
        });
        this.isEmployeeVisible = false;
        break;
      case 'assigned_to':
        this.projectForm.setValue({
          ...this.projectForm.value,
          assignedTo: event.selectedRows[0].dataItem.name,
        });
        this.isAssignedVisible = false;
        break;
      default:
        break;
    }
  }

  onSortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.projects = orderBy(this.projects, sort);
  }

  onReOrderColumns(event) {}

  onDataStateChange(event) {}

  onInitForm(value) {
    this.projectForm = this.formBuilder.group({
      userRequest: value?.userRequest || '',
      requestedBy: value?.requestedBy || '',
      requestedDate: value?.requestedDate || '',
      supervisor: value?.supervisor || '',
      supervisorApproved: value?.supervisorApproved || '',
      supervisorApprovedDate: value?.supervisorApprovedDate || '',
      ginoApproved: value?.ginoApproved || '',
      ginoApprovedDate: value?.ginoApprovedDate || '',
      notes: value?.notes || '',
      priority: value?.priority || '',
      assignedTo: value?.assignedTo || '',
      assignedDate: value?.assignedDate || '',
      close: value?.close || '',
    });
  }

  onHandleOperation(type, event = null) {
    switch (type) {
      case 'new':
        this.onInitForm({});
        this.isDisable = false;
        this.isEditable = true;
        break;
      case 'edit':
        this.isDisable = false;
        this.isEditable = true;
        break;
      case 'cancel':
        this.isEditable = false;
        this.isDisable = true;
        break;
      case 'save':
        this.isEditable = false;
        this.isDisable = true;
        break;
      case 'employees':
        this.isEmployeeVisible = !this.isEmployeeVisible;
        break;
      case 'request_date':
        this.projectForm.setValue({
          ...this.projectForm.value,
          requestedDate: event,
        });
        break;
      case 'supervisor_approved':
        let supervisor_approved_value =
          this.projectForm.get('supervisorApproved').value;
        this.projectForm.setValue({
          ...this.projectForm.value,
          supervisorApproved:
            supervisor_approved_value === 'Yes' ? 'No' : 'Yes',
          supervisorApprovedDate:
            supervisor_approved_value === 'Yes' ? '' : new Date().toISOString(),
        });
        break;
      case 'supervisor_approved_date':
        this.projectForm.setValue({
          ...this.projectForm.value,
          supervisorApprovedDate: event,
        });
        break;
      case 'gino_approved':
        let gino_approved_value = this.projectForm.get('ginoApproved').value;
        this.projectForm.setValue({
          ...this.projectForm.value,
          ginoApproved: gino_approved_value === 'Yes' ? 'No' : 'Yes',
          ginoApprovedDate:
            gino_approved_value === 'Yes' ? '' : new Date().toISOString(),
        });
        break;
      case 'gino_approved_date':
        this.projectForm.setValue({
          ...this.projectForm.value,
          ginoApprovedDate: event,
        });
        break;
      case 'priority':
        let priority_value = this.projectForm.get('priority').value;
        this.projectForm.setValue({
          ...this.projectForm.value,
          priority:
            String(priority_value).toLowerCase() === 'low'
              ? 'Medium'
              : String(priority_value).toLowerCase() === 'medium'
              ? 'High'
              : 'Low',
        });
        break;
      case 'assigned_to':
        this.isAssignedVisible = !this.isAssignedVisible;
        break;
      case 'assigned_date':
        this.projectForm.setValue({
          ...this.projectForm.value,
          assignedDate: event,
        });
        break;
      case 'close':
        let close_value = this.projectForm.get('close').value;
        this.projectForm.setValue({
          ...this.projectForm.value,
          close: close_value === 'Yes' ? 'No' : 'Yes',
        });
        break;
      default:
        break;
    }
  }
}
