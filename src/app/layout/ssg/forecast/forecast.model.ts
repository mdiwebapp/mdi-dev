import { NumberFormatOptions } from "@progress/kendo-angular-intl";

export class ForecastViewFilterModel
{
    Branch:string;
    AM:number;
    Year:string

}
export class ForecastExistRequestModel
{
    AM:number;
    Branch:string;
    YearNumber:string;
    MonthNumber:string;
}
export class ForecastAddUpdateRequestModel{
    AM:number;
    Branch:string;
    YearNumber:number;
    MonthNumber:number;
    YearlyGoal:number;
    MonthGoal:number;
    Note:string;
    IsOverWrite:boolean;
}
export class ForecastDeleteRequestModel{
    Id:number;
    AM:number;
    Branch:string;
    YearNumber:number;
    MonthNumber:number;
}
export class ForeCastTotalFilterModel{
    Branch:string;
    AM:number;
    Year:string
}