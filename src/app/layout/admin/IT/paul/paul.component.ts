import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ViewColumnsTimeApproval,
  ViewDataTimeApproval,
  ViewColumns,
  ViewData,
  ViewColumnsGrid,
  ViewDataGridData,
} from './../../../../../data/paul-data';

@Component({
  selector: 'app-paul',
  templateUrl: './paul.component.html',
  styleUrls: ['./paul.component.scss'],
})
export class PaulComponent implements OnInit {
  form: FormGroup;
  toggleTA: boolean = false;
  displayToggleTa: boolean = false;
  viewColumnsTimeApproval: any;
  viewDataTimeApproval: any;
  displayLoadTimeApprovalGrid: boolean = false;
  displayCols: boolean = false;
  viewCols: any;
  viewData: any;
  viewColumnsGrid: any;
  viewDataGridData: any;
  screenList: any = [];
  displayScreen: boolean = false;
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.initForm();
    this.viewColumnsTimeApproval = ViewColumnsTimeApproval;
    this.viewDataTimeApproval = ViewDataTimeApproval;
    this.viewCols = ViewColumns;
    this.viewData = ViewData;
    this.viewColumnsGrid = ViewColumnsGrid;
    this.viewDataGridData = ViewDataGridData;
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      content: [],
      toggleTA: [false],
      selectedDate: [],
      invType: [],
      invNumber: [],
      description: [],
      onHand: [],
      counted: [],
      screenData: [],
    });
  }

  toggleTAChange(status) {
    this.displayToggleTa = !this.displayToggleTa;
  }
  onLoadTimeApproval() {
    this.displayLoadTimeApprovalGrid = !this.displayLoadTimeApprovalGrid;
  }
  onAddCols() {
    this.displayCols = !this.displayCols;
  }
  onScreen() {
    this.displayScreen = !this.displayScreen;
  }
}
