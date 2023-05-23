import { HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class Contants {
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
   

  public vendorId = 120;
 
}

