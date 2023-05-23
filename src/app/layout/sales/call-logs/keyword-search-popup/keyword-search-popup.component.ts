import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ViewData,
  ViewColumns,
} from './../../../../../data/search-keyword-data';
@Component({
  selector: 'app-keyword-search-popup',
  templateUrl: './keyword-search-popup.component.html',
  styleUrls: ['./keyword-search-popup.component.scss'],
})
export class KeywordSearchPopupComponent implements OnInit {
  form: FormGroup;
  viewColumns: any;
  viewData: any;
  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.viewColumns = ViewColumns;
    this.viewData = ViewData;
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      // searchTerm1: [],
      // searchTerm2: [],
      searchTermAnd1: '',
      searchTermAnd2: '',
      searchTermOr1: '',
      searchTermOr2: '',
    });
  }
}
