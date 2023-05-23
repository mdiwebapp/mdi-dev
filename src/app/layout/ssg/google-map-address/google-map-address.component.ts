import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Address, CustomAddress } from './address.model';
import { ModuleNames, ErrorMessages } from 'src/app/core/constant';
import { ErrorHandlerService } from 'src/app/core/services';

@Component({
  selector: 'app-google-map-address',
  templateUrl: './google-map-address.component.html',
  styleUrls: ['./google-map-address.component.scss'],
})
export class GoogleMapAddressComponent implements OnInit {
  // @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  options: any;
  data: any;
  @Input() isDisabled: boolean;
  @Input() text: any;
  @Input() fullAddress: any;
  customAddress: CustomAddress;
  @Output() dialogOpened: boolean = false;
  @Output() errorMsg: any;
  constructor(
    private utils: UtilityService,
    public errorHandler: ErrorHandlerService
  ) {}
  @Output() getAddress = new EventEmitter<CustomAddress>();
  public handleAddressChange(address: Address) {
    this.customAddress = new CustomAddress();
    if (
      address.address_components != undefined ||
      address.address_components != null
    ) {
      try {
        this.customAddress.flag = true;
        if (
          address.address_components.find((x) =>
            x.types.find((x) => x == 'street_number')
          ) != undefined
        )
          this.customAddress.address1 = address.address_components.find((x) =>
            x.types.find((x) => x == 'street_number')
          ).long_name;

        if (
          address.address_components.find((x) =>
            x.types.find((x) => x == 'route')
          ) != undefined
        )
          this.customAddress.address2 = address.address_components.find((x) =>
            x.types.find((x) => x == 'route')
          ).long_name;

        if (
          address.address_components.find((x) =>
            x.types.find(
              (x) =>
                x == 'sublocality_level_1' ||
                x == 'sublocality' ||
                x == 'political' ||
                x == 'neighborhood'
            )
          ) != undefined
        )
          this.customAddress.city = address.address_components.find((x) =>
            x.types.find((x) => x == 'locality' || x == 'neighborhood')
          ).long_name;
        else this.customAddress.city = '';
        if (
          address.address_components.find((x) =>
            x.types.find((x) => x == 'administrative_area_level_1')
          ) != undefined
        )
          this.customAddress.state = address.address_components.find((x) =>
            x.types.find((x) => x == 'administrative_area_level_1')
          ).short_name;
        else this.customAddress.state = '';
        if (
          address.address_components.find((x) =>
            x.types.find((x) => x == 'country')
          ) != undefined
        )
          this.customAddress.country = address.address_components.find((x) =>
            x.types.find((x) => x == 'country')
          ).long_name;
        else this.customAddress.country = '';
        if (
          address.address_components.find((x) =>
            x.types.find((x) => x == 'postal_code')
          ) != undefined
        )
          this.customAddress.postalcode = address.address_components.find((x) =>
            x.types.find((x) => x == 'postal_code')
          ).long_name;
        else this.customAddress.postalcode = '';
        address.formatted_address = this.customAddress.address1;

        let sss = [
          this.customAddress.address1,
          this.customAddress.address2,
          this.customAddress.city,
          this.customAddress.state,
          this.customAddress.country,
        ];
        this.fullAddress = sss.join(',') + '-' + this.customAddress.postalcode;
        this.getAddress.emit(this.customAddress);
      } catch (error) {
        this.errorHandler.handleError(
          error,
          ModuleNames.google_map_address,
          ErrorMessages.google_map_address.error
        );
      }
    } else {
      this.customAddress.flag = false;
      this.customAddress.address1 = this.text;
      this.fullAddress = this.customAddress.address1;
      this.getAddress.emit(this.customAddress);
    }
  }
  ngOnInit(): void {}

  onBlur() {
    this.customAddress = new CustomAddress();
    this.customAddress.flag = false;
    this.customAddress.address1 = this.text;
    // this.fullAddress = this.customAddress.address1;
    this.getAddress.emit(this.customAddress);
  }
}
