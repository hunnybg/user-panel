import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links, placeholder, label, button, description, price, menu_title, orderTable} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
declare var google;
declare var jquery:any;
declare var $ :any;

export interface AddAddress {
    latitude: number,
    longitude: number,
    address: string,
    comment: string,
    address_name: string,
    floor: string,
    entry_code: string,
    country: string,
    country_code: string
}

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})
export class AddressesComponent implements OnInit {

    public title:any = title;
    public links:any = links;
    public placeholder:any = placeholder;
    public label:any = label;
    public button:any = button;
    public description:any = description;
    public price:any = price;
    public menu_title:any = menu_title;
    public orderTable:any = orderTable;

    model;
    model2;

    private user_id: string = '';
    private server_token: string = '';
    private favourite_addresses: any[] = [];
    address_ids : any[] =[];
    is_edit: boolean = false;
    add_address: AddAddress;
    is_add: boolean = false;

    constructor(  public bln: BooleanService, public user_helper: Helper  ) { }

    ngOnInit() {

        this.bln.showLogin = false;
        this.bln.showhedmid = true;
        this.bln.showcart = true;
        this.bln.isSticky = false;
        this.bln.showLink = false;
        this.bln.isHome = true;
        this.bln.cart = true;
        this.bln.showSignup = true;
        this.bln.isAdd_product = true;
        this.bln.isShop = true;
        this.bln.isInner_page = true;
        this.bln.isGreen = true;
        this.bln.isBod_btm_h = false;
        this.bln.isOrd_b = true;

        this.add_address = {
            address: '',
            address_name: '',
            comment: '',
            country: '',
            country_code: '',
            floor: '',
            entry_code: '',
            latitude: null,
            longitude: null
        }

        $(document).ready(function(){
            $(".edit").click(function(){
                $(this).parent().siblings().addClass("edit_data");
                $(".save, .change").show();
                $(this).hide();
            })
        })

        let autocompleteElm = <HTMLInputElement>document.getElementById('fav_address');
        let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), {});

        autocomplete.addListener('place_changed', () => {
            this.user_helper.myLoading = true;
            var place = autocomplete.getPlace();
            this.add_address.latitude = place.geometry.location.lat()
            this.add_address.longitude = place.geometry.location.lng();
            this.add_address.address = place.formatted_address;
            for (var i = 0; i < place.address_components.length; i++) {
                if (place.address_components[i].types[0] == "country") {
                    this.add_address.country = place.address_components[i].long_name;
                    this.add_address.country_code = place.address_components[i].short_name;
                }
            }
        });

        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_FAVOUTIRE_ADDRESSES, {user_id: this.user_id, server_token: this.server_token}, (res_data) => {
            if(res_data.success){
                this.favourite_addresses = res_data.favourite_addresses;
            }
        });


    }

    check_address(address_id){
        var index = this.address_ids.indexOf(address_id);
        if(index == -1){
            this.address_ids.push(address_id);
        } else {
            this.address_ids.splice(index, 1);
        }
    }

    delete_address(){
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.DELETE_FAVOURITE_ADDRESS, {address_ids: this.address_ids, user_id: this.user_id, server_token: this.server_token}, (res_data) => {
            this.favourite_addresses = res_data.favourite_addresses;
            this.address_ids = [];
            this.is_edit = false;
        });
    }

    add_address_data(data){
        data.user_id = this.user_id;
        data.server_token = this.server_token;

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.ADD_FAVOURITE_ADDRESS, data, (res_data) => {
            this.favourite_addresses = res_data.favourite_addresses;
            this.is_add = false;
            this.add_address = {
                address: '',
                address_name: '',
                comment: '',
                country: '',
                country_code: '',
                floor: '',
                entry_code: '',
                latitude: null,
                longitude: null
            }
        });
    }
}
