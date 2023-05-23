import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ServiceOrderService } from '../../service-order/service-order.service';

@Component({
  selector: 'app-tech-check-model',
  templateUrl: './tech-check-model.component.html',
  styleUrls: ['./tech-check-model.component.scss'],
})
export class TechCheckModelComponent implements OnInit {
  @Output() closeChecklist: EventEmitter<any> = new EventEmitter<any>();

  techCheckType: string = 'frmTechnicianChecklist';

  constructor(public service: ServiceOrderService) {
    this.techCheckType =this.service.techcheckType;
  }

  ngOnInit(): void {}
  btnCancelTech($event){
    this.closeChecklist.emit(true);
  }
}
