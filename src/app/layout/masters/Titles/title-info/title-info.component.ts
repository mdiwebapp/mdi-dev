import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TitlesService } from '../titles.service';

@Component({
  selector: 'app-title-info',
  templateUrl: './title-info.component.html',
  styleUrls: ['./title-info.component.scss'],
})
export class TitleInfoComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() employeeList: any = [];
  @Input() activeTitles = [];
  @Input() allTitles = [];
  @Input() titleData = [];
  @Input() allTitlesData = [];
  constructor(private service: TitlesService) {}

  ngOnInit(): void {
   
  }

  ngOnChanges(changes: SimpleChanges): void {}

  reporthandleFilter(value) {
    
    this.activeTitles = this.titleData.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  timeApproverHandleFilter(value)
  {
    this.allTitles = this.allTitlesData.filter(
     (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
  }
}
