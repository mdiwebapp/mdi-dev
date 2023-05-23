import { AddressComponent } from "./address-component";
export class Address {
    address_components: AddressComponent[];
    adr_address: string;
    formatted_address: string;
    formatted_phone_number: string;
    geometry: any;
    html_attributions: string[];
    icon: string;
    id: string;
    international_phone_number: string;
    name: string;
    opening_hours: any;
    permanently_closed: boolean;
    photos: any[];
    place_id: string;
    price_level: number;
    rating: number;
    reviews: any[];
    types: string[];
    url: string;
    utc_offset: number;
    vicinity: string;
    website: string;
}

export class CustomAddress
{
    address1 : string;
    address2: string;
    city : string;
    state : string;
    country : string;
    postalcode : string;
    flag : boolean;
}