import { StringMapWithRename } from "@angular/compiler/src/compiler_facade_interface";

export class BuildingRequestTicketsViewFilterModel 
{
    SearchText:string;
    Open:boolean;
    Status:number;
}
export class BuildingRequestTicketsUpdateRequestModel{
    ClosingEmail:string;
    Notes:string;
    IsClosed:boolean;
    IsSendEmail:boolean;
    Id:number;
  
}
