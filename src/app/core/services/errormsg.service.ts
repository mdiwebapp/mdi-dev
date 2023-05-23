import { Injectable } from "@angular/core";
import { UtilityService } from "./utility.service";
@Injectable({
  providedIn: "root"
})
export class ErrorMessageService {
  constructor(public utils: UtilityService) {}

  displayError(msg) {
    if (msg.error.errors === undefined) {
      this.utils.toast.error(msg.message);
    } else {
      const test = Object.keys(msg.error.errors).map(key => ({ type: key, value: msg.error.errors[key] }));
      var filteredData = [];
      test.forEach(element => {
        filteredData.push(element.value[0]);
      });
      return "<li>" + filteredData.map(x => x).join("</li><li>") + "</li>";
    }
  }
}
