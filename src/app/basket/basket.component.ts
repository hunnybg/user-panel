import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {button, language, menu_title, label, title, placeholder, price, ordList, orderTable, links} from '../helper';
import {Helper} from "../user_helper";
declare var $:any;
declare var google;
import { UUID } from 'angular2-uuid';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { HeaderComponent } from '../header/header.component';
import {Location} from '@angular/common';
import * as moment from 'moment-timezone';
import {Response, Http} from '@angular/http';
import { map } from "rxjs/operators";

export interface OrderPayment {
    _id: Object
    promo_payment: number,
    service_tax : number,
    total_admin_tax_price: number,
    total_cart_price: number,
    total_service_price: number,
    total_store_tax_price: number,
    total_item_count: number,
    total_item_price: number,
    item_tax: number,
    total_order_price: number,
    total: number,
    is_distance_unit_mile: Boolean,
    price_per_unit_time: number,
    price_per_unit_distance: number,
    delivery_price: number,
    is_promo_for_delivery_service: boolean
}

export interface UserLogin {
    email: string,
    social_id: string,
    login_by: any,
    cart_unique_token: string,
    password: string
}

export interface UserRegister{
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    social_unique_id: String,
    login_by:String,
    confirm_password: String,
    country_id: Object,
    city: Object,
    address: String,
    country_phone_code: String,
    phone: Number,
    image_url: String,
    referral_code:String,
    is_email_verified:Boolean,
    is_phone_number_verified:Boolean
}

export interface UserForgotPassword{
    email: String
}

export interface StoreData{
    name: string,
    image_url: string,
    delivery_time: number,
    close: Boolean,
    nextopentime: string,
    store_time: any[],
    item_tax: number,
    is_taking_schedule_order: boolean,
    schedule_order_create_after_minute: 0
}

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
    providers: [Helper, HeaderComponent]
})
export class BasketComponent implements OnInit {

  minus_img:any = "../assets/images/minus_c.png";
  plus_img:any = "../assets/images/plus_c.png";

  public button:any = button;
  public language:any = language;
  public menu_title:any = menu_title;
  public label:any = label;
  public title:any = title;
  public placeholder:any = placeholder;
  public price:any = price;
  private ordList:any = ordList;
  private orderTable:any = orderTable;
  private links:any = links;
    closeResult: string;
    moment = moment();
    email_placeholder:Number = 1;
    email_or_phone_error: Boolean = false;

    private cart_unique_token: string = '';
    private user_id: string = '';
    private server_token: string = '';
    public user_profile: string = '';
    private cart_data : any = {};
    private store_location : any[];
    private delivery_location : any[];
    private delivery_address : string = '';
    delivery_user_phone: string = '';
    delivery_user_name: string = '';
    public delivery_currency : string = '';
    public store_detail: StoreData;
    delivery_note: string = '';
    promocode: string = '';
    promo_applied: Boolean = false;
    google_distance: any;
    google_time: any;
    bool: Boolean = true;
    edit_address: Boolean = true;
    mimimum_amount: number = 0;
    disable_place_holder_button: boolean = true;
    minimum_phone_number_length:number = 8;
    maximum_phone_number_length:number = 15;

    city_id: string = '';
    private payment_gateway : any[] = [];
    private selected_payment_gateway: string = '';
    private card_list : any[] = [];
    private is_cash_payment_mode: Boolean = false;

    public order_payment : OrderPayment;

    is_schedule_order: Boolean = false;
    schedule_date: any = '';
    schedule_time: string = '';
    schedule_time_error: Boolean = false;
    store_open_day: string = '';
    ipickup_delivery: Boolean = false;
    service_tax: number = 0;
    floor: any = '';
    entry_code: any = '';
    wallet: number = 0;
    wallet_currency_code: string = '';
    is_use_wallet: boolean = true;

    selected_item_index: number = 0;
    selected_product_index: number = 0;
    note_for_item: string = '';
    current_item: any = {image_url:[]};
    current_main_item: any = {};
    required_count: number = 0;
    private total: number = 0;
    required_temp_count: number = 0;
    qty: number = 1;

    public user_login: UserLogin;
    error_message: string = '';

    fname: string;
   sname:string;
   password: string;
   email: string;
   mobile: number;
   setting_data: any = {};
    private user_register: UserRegister;
    country_list: any[] = [];
    private user_forgot_password: UserForgotPassword;
    use_an_address: boolean = false;
    favourite_addresses: any[] = [];
    selected_address_id: string = '';

    clicked_date: any = null;
    server_date: any = null;
    date_array: any[] = [];
    time_array: any[] = [];

  constructor( public bln: BooleanService, public location: Location, public user_helper: Helper, private modalService: NgbModal, public HeaderComponent: HeaderComponent) { }

  ngOnInit() {
    this.fname = "";
   this.sname = "";
   this.password = "";
   this.email = "";
   this.mobile = null;
    this.user_login = {
          cart_unique_token: localStorage.getItem('cart_unique_token'),
          email: '',
          password: '',
          login_by: this.title.manual,
          social_id: ''
      }
      this.user_forgot_password={
            email: "",
        }

        this.user_register ={

            first_name: "",
            last_name: "",
            email: "",
            password: "",
            social_unique_id: "",
            login_by: this.title.manual,
            confirm_password: "",
            country_id: "",
            city: "",
            address: "",
            country_phone_code: "",
            phone: null,
            image_url: "./default.png",
            referral_code: "",
            is_phone_number_verified: false,
            is_email_verified : false

        }

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_SETTING_DETAIL, {}, (res_data) => {

            this.user_helper.myLoading=false;
            this.setting_data=res_data.setting

            if(this.setting_data.is_user_login_by_phone == true && this.setting_data.is_user_login_by_email == true)
            {
                this.email_placeholder = 1
            }
            else if(this.setting_data.is_user_login_by_phone == true)
            {
                this.email_placeholder = 2
            }
            else if(this.setting_data.is_user_login_by_email == true)
            {
                this.email_placeholder = 3
            }

        });

        this.user_helper.http.get(this.user_helper.GET_METHOD.GET_COUNTRY_LIST).pipe(map((res)=>res.json())).subscribe((res_data) => {
            this.country_list = res_data.countries;
        });


  this.bln.showLogin = false;
  this.bln.showhedmid = true;
  this.bln.showcart = false;
  this.bln.isSticky = false;
  this.bln.showLink = false;
  this.bln.isHome = true;
  this.bln.cart = true;
  this.bln.showSignup = true;
  this.bln.isAdd_product = false;
  this.bln.isShop = true;
  this.bln.isInner_page = true;
  this.bln.isBod_btm_h = true;
      this.bln.address = true;

      this.city_id = this.user_helper.user_cart.cart_data.city_id;

  if(this.user_helper.user_cart.cart_data.total_item<=0){
    this.user_helper.router.navigate(['']);
  }

  /* counter */

  $(document).ready(function(){

 var counter = 0;
    $(".plus").click(function()
    {      
        counter++;
       $(this).siblings('.value span').html(counter);
    });
    $(".minus").click(function()
    {
      if(counter > 0){
        counter--;
        }
       $(this).siblings('.value span').html(counter);
    });

     /* remove */

    $('.remove').click (function(e){
      e.preventDefault();
      $(this).closest('.ord_in').hide()
    });
  });

        $('.asap a').click(function(e){
          e.preventDefault() ;
          $('.drop_form').hide().parent().removeClass('open2');
        });

        $('.schedule').click( function(e){
            e.preventDefault();
            $('.drop_form').show().parent().addClass('open2');
        });

        $(".dropdown2 dt a").click(function(e) {
            e.preventDefault();
            //$(".dropdown2 dd ul").toggle().closest(".select_div").toggleClass("ar_rot");
            $(this).parents().siblings().children(".dropdown2 dd ul").toggle().closest(".select_div").toggleClass("ar_rot");
        });

        $(".dropdown2 dd ul li a").click(function(e) {
            e.preventDefault();
            var text = $(this).html();
            //$(".dropdown2 dt a span").html(text);
            $(this).closest("dd").siblings().children().children(".dropdown2 dt a span").html(text);
            $(".dropdown2 dd ul").hide().closest(".select_div").removeClass("ar_rot");

        });


      this.delivery_note = this.user_helper.user_cart.delivery_note;
      this.cart_unique_token = localStorage.getItem('cart_unique_token');
      this.cart_data = this.user_helper.user_cart.cart_data;

      let user = JSON.parse(localStorage.getItem('user'));
      if(user && user._id){
          this.user_id = user._id;
          this.is_use_wallet = user.is_use_wallet
          this.server_token = user.server_token;
          this.user_profile = user.image_url;
          this.delivery_user_name = user.first_name + user.last_name;
          this.delivery_user_phone = user.phone;
      }

      this.order_payment = {
          _id: null,
          promo_payment: 0,
          total_cart_price: 0,
          service_tax : 0,
          total_admin_tax_price: 0,
          total_service_price: 0,
          total_store_tax_price: 0,
          total_item_count: 0,
          total_item_price: 0,
          item_tax: 0,
          total_order_price: 0,
          total: 0,
          is_distance_unit_mile: false,
          price_per_unit_distance: 0,
          price_per_unit_time: 0,
          delivery_price: 0,
          is_promo_for_delivery_service: false
      };

      this.store_detail = {
          name: '',
          delivery_time: 0,
          image_url: '',
          close: true,
          nextopentime: '',
          store_time: [],
          item_tax: 0,
          is_taking_schedule_order: false,
          schedule_order_create_after_minute: 0
      }

      // if(this.user_helper.user_cart.cart_data.destination_addresses.length>0 && this.user_helper.user_cart.cart_data.destination_addresses[0].address)
      // {

      // } else {
      //   this.user_helper.router.navigate(['']);
      // }

      if(this.cart_data.cart.length > 0){
          this.user_helper.myLoading = true;
          this.store_location = this.user_helper.user_cart.store_location;
          this.delivery_location = this.user_helper.user_cart.cart_data.destination_addresses[0].location;
          this.delivery_address = this.user_helper.user_cart.cart_data.destination_addresses[0].address;
          this.delivery_currency = this.user_helper.router_id.user.currency;
          this.floor = this.user_helper.user_cart.cart_data.destination_addresses[0].floor;
          this.entry_code = this.user_helper.user_cart.cart_data.destination_addresses[0].entry_code;

          if(this.delivery_address == ''){
            this.user_helper.router.navigate(['']);
          }

          let autocompleteElm = <HTMLInputElement>document.getElementById('basket_address');
          let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), {});

          autocomplete.addListener('place_changed', () => {
              this.user_helper.myLoading = true;
              var place = autocomplete.getPlace();
              this.delivery_location = [place.geometry.location.lat(), place.geometry.location.lng()];
              this.delivery_address = place.formatted_address;
              this.update_address();
          });
          this.get_distnce_time();
          this.get_payment_gateway(this.user_helper.router_id.user_current_location);
      }
      else {
          // this.user_helper.router.navigate(['']);
      }

  }

  select_country(){
        var index = this.country_list.findIndex((x)=>x.country_phone_code == this.user_register.country_phone_code);
        this.user_register.country_id = this.country_list[index]._id;
    }

  pad2(number) {
       return (number < 10 ? '0' : '') + number
    }

  asap(){
        $('.date_time').siblings('.dropdown_div').toggle();
        this.is_schedule_order = this.user_helper.user_cart.is_schedule_order;

        let server_date:any = new Date(this.user_helper.user_cart.server_date);
        server_date = new Date(server_date).toLocaleString("en-US", {timeZone: this.user_helper.user_cart.timezone})
        server_date = new Date(server_date);
        this.server_date = server_date;
        var days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        let time_date = new Date(server_date);
        time_date.setHours(0,0,0,0);
        for(var i=0; i<48; i++){
            this.time_array[i] = {time_format: this.pad2(time_date.getHours()) + ':' + this.pad2(time_date.getMinutes()), time: time_date.getHours() + ':' + time_date.getMinutes()}
            time_date.setMinutes(time_date.getMinutes()+30);
        }

        for(var i=0; i<7; i++){
            let date = new Date(server_date);
            date.setDate(date.getDate()+i);
            date = new Date(date);
            var day = days[ date.getDay()];
            var month = months[ date.getMonth() ];
            var date_format = day + ', ' + month + ' ' + date.getDate();
            this.date_array[i] = {date_format: date_format, date: date.getFullYear() + '-' +  (date.getMonth()+1) + '-' +  date.getDate()};
        }

        // this.user_helper.scheduleDatePickerOptions.disableUntil.year = server_date.getFullYear();
        // this.user_helper.scheduleDatePickerOptions.disableUntil.month = server_date.getMonth()+1;
        // this.user_helper.scheduleDatePickerOptions.disableUntil.day = server_date.getDate()-1;
        //
        // this.user_helper.scheduleDatePickerOptions.disableSince.year = after_date.getFullYear();
        // this.user_helper.scheduleDatePickerOptions.disableSince.month = after_date.getMonth()+1;
        // this.user_helper.scheduleDatePickerOptions.disableSince.day = after_date.getDate();

        let date = this.user_helper.user_cart.schedule_date;
        if(this.user_helper.user_cart.schedule_date !== null && this.user_helper.user_cart.schedule_date !== ''){

            this.schedule_date = date.getFullYear() + '-' +  (date.getMonth()+1) + '-' +  date.getDate();

            var day = days[ date.getDay()];
            var month = months[ date.getMonth() ];
            this.clicked_date = day + ', ' + month + ' ' + date.getDate();
            this.schedule_time = date.getHours()+':'+date.getMinutes();
        } else {
            this.schedule_date = this.date_array[1].date;
            this.clicked_date = this.date_array[1].date_format;
            this.schedule_time = this.time_array[0].time_format;
        }
    }

    get_payment_gateway(current_location){

        current_location.user_id = this.user_id;
        current_location.city_id = this.city_id;
        current_location.server_token =  this.server_token;

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_PAYMENT_GATEWAY, current_location, (res_data) => {            if(res_data.success) {
              this.wallet = res_data.wallet;
              this.wallet_currency_code = res_data.wallet_currency_code;
                this.user_helper.myLoading = false;
                this.is_cash_payment_mode = res_data.is_cash_payment_mode;
                this.payment_gateway = res_data.payment_gateway;

                if (this.is_cash_payment_mode) {
                    this.selected_payment_gateway = 'cash';
                }

                if (!this.is_cash_payment_mode && this.payment_gateway.length > 0) {
                    this.selected_payment_gateway = this.payment_gateway[0]._id;
                }
                if (this.payment_gateway.length > 0) {
                    let index = this.payment_gateway.findIndex((x) => (x._id).toString() == this.user_helper.PAYMENT_GATEWAY_CONSTANT.STRIPE)

                    if (index !== -1) {
                        this.get_card()
                    }
                }
            } else {

            }
        });
    }

    get_card() {
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_CARD_LIST, {user_id: this.user_id, server_token: this.server_token}, (res_data) => {
          
            if(res_data.success){
                this.card_list = res_data.cards;
            } else {

            }
        });
    }

    select_card(card_id , card_index){
        if(!this.card_list[card_index].is_default){
            this.user_helper.myLoading = true;
            this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.SELECT_CARD, {user_id: this.user_id, server_token: this.server_token, card_id: card_id}, (res_data) => {
                 this.user_helper.myLoading = false;
                if(res_data.success){
                    let index = this.card_list.findIndex((x)=> x.is_default == true)
                    this.card_list[index].is_default = false;
                    this.card_list[card_index].is_default = true;
                } else {
                    this.user_helper.data.storage = {
                        "message": this.user_helper.ERROR_CODE[res_data.error_code],
                        "class": "alert-danger"
                    }
                }
            });
        }

    }

    get_distnce_time(){
        let google_distance = 0;
        let google_time = 0;
        let origin = {lat: parseFloat(this.user_helper.user_cart.cart_data.pickup_addresses[0].location[0]), lng: parseFloat(this.user_helper.user_cart.cart_data.pickup_addresses[0].location[1])};
        let destination = {lat: parseFloat(this.delivery_location[0]), lng: parseFloat(this.delivery_location[1])};

        let service = new google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
            travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
            if(status == google.maps.DistanceMatrixStatus.OK){
                this.google_distance = response.rows[0].elements[0].distance != undefined ? response.rows[0].elements[0].distance.value: 0;
                this.google_time = response.rows[0].elements[0].duration != undefined ? response.rows[0].elements[0].duration.value: 0;
                this.get_order_invoice(this.google_distance, this.google_time)
            } else {
                this.get_order_invoice(this.google_distance, this.google_time)
            }
        });
    }

    edit_address_field(){
        this.edit_address = true;
    }

    update_address() {
        this.edit_address = false;

        let json = {
            latitude: this.delivery_location[0],
            longitude: this.delivery_location[1],
            destination_address: this.delivery_address,
            destination_addresses: [{
                "delivery_status": 0,
                "address_type" : "destination",
                "address" : this.delivery_address,
                "entry_code": this.entry_code,
                "floor": this.floor,
                "city" : this.user_helper.user_cart.cart_data.destination_addresses[0].city,
                "location" : this.delivery_location,
                "note" : "",
                "user_type" :this.user_helper.user_cart.cart_data.destination_addresses[0].user_type,
                "user_details" : this.user_helper.user_cart.cart_data.destination_addresses[0].user_details
            }],
            cart_id: this.cart_data.cart_id
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.CHANGE_DELIVERY_ADDRESS, json, (res_data) => {
            if(res_data.success){
                this.user_helper.user_cart.cart_data.destination_addresses[0].address = this.delivery_address;
                this.user_helper.user_cart.cart_data.destination_addresses[0].location = this.delivery_location;
                this.get_distnce_time();
            } else {
                this.delivery_location = this.user_helper.user_cart.cart_data.destination_addresses[0].location;
                this.delivery_address = this.user_helper.user_cart.cart_data.destination_addresses[0].address;
                this.floor = '';
                this.entry_code = '';
                this.delivery_note = '';
                this.selected_address_id = '';
            }
        });
    }

    check_promo(){
        if(this.promocode !== '' && this.promo_applied==false) {
            this.user_helper.myLoading = true;
            let json = {
                user_id: this.user_id,
                server_token: this.server_token,
                promo_code_name: this.promocode,
                order_payment_id: this.order_payment._id
            }
            this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.APPLY_PROMO_CODE, json, (res_data) => {

                this.user_helper.myLoading = false;
                if(res_data.success)
                {
                    this.promo_applied = true;
                    this.user_helper.data.storage = {
                        "message": this.user_helper.MESSAGE_CODE[res_data.message],
                        "class": "alert-info"
                    }
                    this.order_payment = res_data.order_payment;
                } else {
                    this.promocode = '';
                    this.user_helper.data.storage = {
                        "message": this.user_helper.ERROR_CODE[res_data.error_code],
                        "class": "alert-danger"
                    }
                }
                this.user_helper.message();
            });
        }
    }

    get_order_invoice(google_distance, google_time){
        this.user_helper.myLoading = true;
        let totalItemsCount = 0;
        this.google_distance = google_distance;
        this.google_time = google_time;
        this.cart_data.cart.forEach((cart_product) => {
            cart_product.items.forEach((cart_item) =>{
               totalItemsCount += cart_item.quantity;
            });
        });
        let get_order_cart_invoice_json = {
            user_id: this.user_id,
            server_token: this.server_token,
            total_distance: google_distance,
            total_time: google_time,
            store_id: this.cart_data.selectedStoreId,
            order_type: 7,
            total_cart_price: this.user_helper.user_cart.total_cart_amount,
            total_item_count: totalItemsCount,
            is_user_pick_up_order: this.ipickup_delivery,
            cart_unique_token: this.cart_unique_token
        }

        // if (this.user_id === ''){
        //     get_order_cart_invoice_json.cart_unique_token = this.cart_unique_token;
        // }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_ORDER_CART_INVOICE, get_order_cart_invoice_json, (res_data) => {
                this.user_helper.myLoading = false;
                this.user_helper.ngZone.run(() => {
                  if(res_data.success){
                      this.user_helper.user_cart.server_date = res_data.server_time;
                      this.user_helper.user_cart.timezone = res_data.timezone;

                      this.order_payment = res_data.order_payment;
                      this.user_helper.user_cart.order_payment_id = res_data.order_payment._id;
                      this.store_detail = res_data.store;

                      if(this.user_helper.user_cart.is_schedule_order){
                          this.check_valid_time()
                      } else {
                          let date:any = res_data.server_time;
                          date = new Date(date).toLocaleString("en-US", {timeZone: res_data.timezone})
                          date = new Date(date);
                          this.check_open(date, true);
                      }
                      this.disable_place_holder_button = false;

                  } else {
                      if(res_data.error_code === 557){
                          this.mimimum_amount = res_data.min_order_price;
                          $('#order_amount_invalid').click();
                      } else {
                          this.user_helper.data.storage = {
                              "message": this.user_helper.ERROR_CODE[res_data.error_code],
                              "class": "alert-danger"
                          }
                          this.user_helper.message()
                          this.disable_place_holder_button = true;
                      }

                  }
                });

            });
    }

    check_valid_time(){

        this.is_schedule_order = this.user_helper.user_cart.is_schedule_order;

        let server_date:any = new Date(this.user_helper.user_cart.server_date);
        server_date = new Date(server_date).toLocaleString("en-US", {timeZone: this.user_helper.user_cart.timezone})
        server_date = new Date(server_date);

        let selected_date: any = this.user_helper.user_cart.schedule_date

        let day_diff = selected_date.getDay() - server_date.getDay();
        let timeDiff = Math.round(selected_date.getTime() - server_date.getTime());

        if(timeDiff/60000 >= 30){
            this.schedule_time_error = false;
            if(day_diff > 0){
                this.check_open(selected_date, false);
            } else {
                this.check_open(selected_date, true);
            }

        } else {
            this.schedule_time_error = true;
        }
    }

    set_date(date){
        this.clicked_date=date.date_format;
        this.schedule_date=date.date;
        $('#date').parents().siblings().children(".dropdown2 dd ul").toggle().closest(".select_div").toggleClass("ar_rot");
    }
    set_time(time){
        this.schedule_time=time.time_format;
        $('#time').parents().siblings().children(".dropdown2 dd ul").toggle().closest(".select_div").toggleClass("ar_rot");
        this.set_order_time(true);
    }

    set_order_time(boolean) {
        this.is_schedule_order = boolean;

        if(boolean){
            if(this.schedule_date !== '' && this.schedule_time !== ''){

                let server_date: any = new Date(this.user_helper.user_cart.server_date);
                server_date = new Date(server_date).toLocaleString("en-US", {timeZone: this.user_helper.user_cart.timezone})
                server_date = new Date(server_date);
               
                let date = JSON.parse(JSON.stringify(this.schedule_date.split('-')));
                let time = this.schedule_time.split(':')

                let selected_date: any = new Date(Date.now());
                selected_date = new Date(selected_date).toLocaleString("en-US", {timeZone: this.user_helper.user_cart.timezone})
                selected_date = new Date(selected_date);
                selected_date.setDate(date[2])
                selected_date.setMonth(date[1]-1)
                selected_date.setFullYear(date[0])
                selected_date.setHours(time[0], time[1], 0, 0);
                let timeDiff = Math.round(selected_date.getTime() - server_date.getTime());

                if(timeDiff/60000 >= 30){
                    this.schedule_time_error = false;
                    $('.date_time').siblings('.dropdown_div').toggle();
                    this.user_helper.user_cart.schedule_date = selected_date;
                    this.user_helper.user_cart.clicked_date = this.clicked_date + ' ' + this.schedule_time;
                    this.user_helper.user_cart.is_schedule_order = this.is_schedule_order;
                } else {
                    this.schedule_time_error = true;
                }
            } else {
                this.schedule_time_error = true;
            }

        } else {
            this.user_helper.user_cart.schedule_date = null;
            this.schedule_time_error = false;
            this.schedule_date = '';
            this.schedule_time = '';
            $('#schedule_time').val('');
            this.user_helper.user_cart.is_schedule_order = this.is_schedule_order;
            $('.date_time').siblings('.dropdown_div').toggle();
        }
    }

    redirect_to_checkout(){
        // this.order_amount_invalid.close();
        this.location.back();
        $('#order_amount_invalid_close').click();
    }

    check_open(selected_date, today){

        var date: any = JSON.parse(JSON.stringify(selected_date));
        date = new Date(date)
        let weekday = date.getDay();
        let current_time = date.getTime();
        this.store_detail.close = true;
        this.store_detail.nextopentime = '';

        if(today){
            this.store_open_day = this.title.today;
        } else {
            this.store_open_day = this.user_helper.WEEK_DAY[weekday];
        }

        let week_index = this.store_detail.store_time.findIndex((x) => x.day == weekday)
        let day_time = this.store_detail.store_time[week_index].day_time;

        if(this.store_detail.store_time[week_index].is_store_open_full_time){
            this.store_detail.close = false;
        }
        else {
            if(this.store_detail.store_time[week_index].is_store_open){
                if(day_time.length == 0){
                    this.store_detail.close = true;
                } else {
                    day_time.forEach((store_time , index) =>{
                        let open_time = store_time.store_open_time;
                        open_time = open_time.split(':')
                        let x = date.setHours(open_time[0] , open_time[1], 0 ,0)
                        let x1 = new Date(x);
                        let x2 = x1.getTime();

                        let close_time = store_time.store_close_time;
                        close_time = close_time.split(':')
                        let y = date.setHours(close_time[0] , close_time[1], 0 ,0)
                        let y1 = new Date(y);
                        let y2 = y1.getTime();

                        if(current_time > x2 && current_time < y2){
                            this.store_detail.close = false;
                        }

                        if(current_time < x2 && this.store_detail.nextopentime == ''){
                            this.store_detail.nextopentime = store_time.store_open_time
                        }
                    });
                    // if(this.store_detail.nextopentime == '' && this.store_detail.close)
                    // {
                    //     this.store_detail.nextopentime = day_time[0].store_open_time
                    // }
                }
            } else {
                this.store_detail.close = true;
            }
        }
    }
    set_current_location(){
      this.use_an_address = false;
      this.floor = '';
      this.entry_code = '';
      this.delivery_note = '';
        navigator.geolocation.getCurrentPosition((position) => {
            this.geocoder(position.coords.latitude, position.coords.longitude)
        });
    }
    go_to_order(){
      this.user_helper.router.navigate(['']);
    }

    geocoder(latitude, longitude){

        this.delivery_location = [latitude, longitude];
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        var geocoder = new google.maps.Geocoder();

        let request = {latLng: initialLocation};
        geocoder.geocode(request, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                this.user_helper.ngZone.run(() => {
                    this.delivery_address = results[0].formatted_address;
                    this.update_address();
                });
            }
        });
    }

    checK_schedule_order_available(content){
      if(this.user_helper.user_cart.is_schedule_order){
        if(this.store_detail.is_taking_schedule_order){

          let server_date: any = new Date(this.user_helper.user_cart.server_date);
                server_date = new Date(server_date).toLocaleString("en-US", {timeZone: this.user_helper.user_cart.timezone})
                server_date = new Date(server_date);

                let date = this.schedule_date.split('-')
                let time = this.schedule_time.split(':')

                let selected_date: any = this.user_helper.user_cart.schedule_date;
                // selected_date = new Date(selected_date).toLocaleString("en-US", {timeZone: this.user_helper.user_cart.timezone})
                // selected_date = new Date(selected_date);
                // selected_date.setDate(date[2])
                // selected_date.setMonth(date[1]-1)
                // selected_date.setFullYear(date[0])
                // selected_date.setHours(time[0], time[1], 0, 0);

                let timeDiff = Math.round(selected_date.getTime() - server_date.getTime());

                if(timeDiff/60000 >= this.store_detail.schedule_order_create_after_minute){
                    this.schedule_time_error = false;
                    this.open(content);
                } else {
                    this.schedule_time_error = true;
                }

        } else {
          this.open(content);
        }
      } else {
        this.open(content);
      }
    }

    create_order(){
        this.user_helper.user_cart.delivery_note = this.delivery_note;
        this.user_helper.user_cart.delivery_user_name = this.delivery_user_name;
        this.user_helper.user_cart.delivery_user_phone = this.delivery_user_phone;
        this.user_helper.user_cart.is_user_pick_up_order = this.ipickup_delivery;
        if(this.selected_payment_gateway == this.user_helper.PAYMENT_GATEWAY_CONSTANT.STRIPE) {
            let index = this.card_list.findIndex((x) => x.is_default == true)
            if (index !== -1) {
                this.pay_order_payment(false);
                $('.close_payment_modal').click();
            } else {

            }
        } else if(this.selected_payment_gateway == this.user_helper.PAYMENT_GATEWAY_CONSTANT.CASH){
            this.pay_order_payment(true);
            $('.close_payment_modal').click();
        }
    }

    pay_order_payment(payment_mode_cash){
        this.user_helper.myLoading = true;
        let json = {
            user_id: this.user_id,
            server_token: this.server_token,
            order_payment_id: this.user_helper.user_cart.order_payment_id,
            payment_id: this.selected_payment_gateway,
            is_payment_mode_cash: payment_mode_cash
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.PAY_ORDER_PAYMENT, json, (res_data) => {
            if(res_data.success){
                this.create_order_service();
            } else {
                this.user_helper.myLoading = false;
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.message();
            }
        });
    }

    increase_qty(product_index, item_index){
        this.user_helper.increase_qty(product_index, item_index);
        this.get_order_invoice(this.google_distance, this.google_time);
    }

    decrease_qty(product_index, item_index){
        this.user_helper.decrease_qty(product_index, item_index);
        this.get_order_invoice(this.google_distance, this.google_time);
    }

    remove_from_cart(product_index, item_index){
        this.user_helper.remove_from_cart(product_index, item_index);
        if(this.user_helper.user_cart.cart_data.total_item == 0){
            this.user_helper.router.navigate(['']);
        } else {
            this.get_order_invoice(this.google_distance, this.google_time);
        }

    }

    create_order_service() {
        let selected_date = this.user_helper.user_cart.schedule_date;
        let milisecond = 0;
        if(this.user_helper.user_cart.is_schedule_order){
            milisecond = (selected_date.getTime() - this.moment.tz(this.user_helper.user_cart.timezone).utcOffset()*60000);
        }

        let json = {
            user_id: this.user_id,
            server_token: this.server_token,
            cart_id: this.user_helper.user_cart.cart_data.cart_id,
            delivery_note: this.user_helper.user_cart.delivery_note,
            delivery_user_name: this.user_helper.user_cart.delivery_user_name,
            delivery_user_phone: this.user_helper.user_cart.delivery_user_phone,
            is_user_pick_up_order: this.user_helper.user_cart.is_user_pick_up_order,
            is_schedule_order: this.user_helper.user_cart.is_schedule_order,
            order_start_at: milisecond
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.CREATE_ORDER, json, (res_data) => {
            this.user_helper.myLoading = false;
            if(res_data.success){
                this.user_helper.router_id.user.order_id = res_data.order_id
                this.user_helper.user_cart.cart_data = {
                    cart_id: null,
                    city_id: null,
                    pickup_addresses: [],
                    destination_addresses: [],
                    cart: [],
                    selectedStoreId: null,
                    total_item: 0
                }
                this.user_helper.user_cart.total_cart_amount = 0;
                this.user_helper.user_cart.order_payment_id = null;

                this.user_helper.data.storage = {
                    "message": this.user_helper.MESSAGE_CODE[res_data.message],
                    "class": "alert-info"
                }
                let uuid = UUID.UUID();
                localStorage.setItem('cart_unique_token', uuid);
                this.user_helper.router.navigate(['thankyou']);
            } else {
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.message();
            }
        });
    }

    open(content) {
      this.user_login = {
          cart_unique_token: localStorage.getItem('cart_unique_token'),
          email: '',
          password: '',
          login_by: this.title.manual,
          social_id: ''
      }
      this.user_forgot_password={
            email: "",
        }
        this.error_message = '';
        this.user_register ={

            first_name: "",
            last_name: "",
            email: "",
            password: "",
            social_unique_id: "",
            login_by: this.title.manual,
            confirm_password: "",
            country_id: "",
            city: "",
            address: "",
            country_phone_code: "",
            phone: null,
            image_url: "./default.png",
            referral_code: "",
            is_phone_number_verified: false,
            is_email_verified : false

        }

        if(this.country_list.length>0){
          this.user_register.country_phone_code = this.country_list[0].country_phone_code
          this.user_register.country_id = this.country_list[0]._id
        }

        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , windowClass:'product_pop with_img'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    changeradio(event, specification_group_index, specification_index){

        var index = this.current_item.specifications[specification_group_index].list.findIndex(x => x.is_default_selected == true)
        if(index !== -1){
            this.current_item.specifications[specification_group_index].list[index].is_default_selected = false;
        }
        this.current_item.specifications[specification_group_index].list[specification_index].is_default_selected = true;
        this.calculateTotalAmount();
    }

    changecheckbox(event, specification_group_index, specification_index){

        this.current_item.specifications[specification_group_index].list[specification_index].is_default_selected = event.target.checked;
        this.calculateTotalAmount();

    }

    calculateTotalAmount(){
        this.total = this.current_item.price;
        this.required_temp_count = 0;
        this.current_item.specifications.forEach((specification_group , specification_group_index) => {
            let isAllowed = false;
            var default_selected_count = 0
            specification_group.list.forEach((specification , specification_index) => {

                if(specification.is_default_selected){
                    this.total = this.total + specification.price;
                    default_selected_count++;
                }
                specification_group.default_selected_count = default_selected_count;
            });

            if(specification_group.type ==1 && specification_group.is_required) {
                if(specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            } else if(specification_group.type == 2 && specification_group.is_required) {
                if (specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            }

        });

        this.total = this.total * this.qty;
    }

    open_edit_item_modal(content2, item, product, selected_item_index, selected_product_index){

        this.selected_item_index = selected_item_index;
        this.selected_product_index = selected_product_index;
        let item_index = this.user_helper.user_cart.cart_main_item.findIndex((x) => x._id == item.item_id);
        let current_specification =this.user_helper.user_cart.cart_main_item[item_index].specifications;
        let order_specification = item.specifications;
        let new_specification = [];

        current_specification.forEach((x) => {
            var index = order_specification.findIndex((order_sp) => order_sp.unique_id == x.unique_id)
            if(index == -1){
                new_specification.push(x);
            } else {
                var new_specification_list = [];
                x.list.forEach((y)=>{
                    var list_index = order_specification[index].list.findIndex((order_sp_list) => order_sp_list.unique_id == y.unique_id)
                    if(list_index == -1){
                        y.is_default_selected = false;
                        new_specification_list.push(y);
                    } else {
                        order_specification[index].list[list_index].price = y.price;
                        new_specification_list.push(order_specification[index].list[list_index]);
                    }
                });
                let json = {
                    list: new_specification_list,
                    "unique_id" : x.unique_id,
                    "name" : x.name,
                    "is_required": x.is_required,
                    "price" : x.price,
                    "type" : x.type,
                    "range": x.range,
                    "max_range": x.max_range
                }
                new_specification.push(json);
            }
        });

        this.qty = item.quantity;
        this.required_count = 0;
        this.current_item = JSON.parse(JSON.stringify(item));
        this.current_item.price = this.user_helper.user_cart.cart_main_item[item_index].price;
        this.current_item.specifications = new_specification;
        this.calculate_is_required();
        this.edit_item_calculateTotalAmount();

        setTimeout(()=>{
            this.open2(content2);
        },100);
    }

    calculate_is_required(){
        this.current_item.specifications.forEach((specification_group) => {
            if(specification_group.is_required){
                this.required_count++;
            }
        })
    }

    edit_item_calculateTotalAmount(){
        this.total = this.current_item.price;
        this.required_temp_count = 0;
        this.note_for_item = this.current_item.note_for_item;
        this.current_item.specifications.forEach((specification_group , specification_group_index) => {
            let isAllowed = false;
            var default_selected_count = 0
            specification_group.list.forEach((specification , specification_index) => {

                if(specification.is_default_selected){
                    this.total = this.total + specification.price;
                    default_selected_count++;
                }
                specification_group.default_selected_count = default_selected_count;
            });

            if(specification_group.type ==1 && specification_group.is_required) {
                if(specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            } else if(specification_group.type == 2 && specification_group.is_required) {
                if (specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            }

        });

        this.total = this.total * this.qty;
    }

    updateCart(){
        let specificationPriceTotal = 0;
        let specificationPrice = 0;
        let specificationList = [];
        this.current_item.specifications.forEach((specification_group , specification_group_index) => {

            let specificationItemCartList = [];
            specification_group.list.forEach((specification , specification_index) => {

                if(specification.is_default_selected){

                    specificationPrice = specificationPrice + specification.price;
                    specificationPriceTotal = specificationPriceTotal + specification.price;
                    specificationItemCartList.push(specification)
                }
            });

            if(specificationItemCartList.length > 0){
                let specificationsItem_json ={
                    list: specificationItemCartList,
                    unique_id: specification_group.unique_id,
                    name: specification_group.name,
                    price: specificationPrice,
                    type: specification_group.type,
                    range: specification_group.range,
                    max_range: specification_group.max_range
                }
                specificationList.push(specificationsItem_json);
            }
            specificationPrice = 0;

        });

        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].item_price = this.current_item.price;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].total_specification_price = specificationPriceTotal;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].total_item_and_specification_price = this.total;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].note_for_item = this.note_for_item;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].specifications = specificationList;

        var total_item_price = 0;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items.forEach((item) =>{
            total_item_price = total_item_price + item.total_item_and_specification_price;
        });
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].total_item_price = total_item_price;

        $('#close_item_model1').click();
        this.user_helper.calculateTotalAmount();
        this.get_order_invoice(this.google_distance, this.google_time);
    }

    userLogin(logindata)
    {
        this.user_login.social_id = '';
        this.user_login.login_by = this.title.manual

        this.user_login.email=this.user_login.email.trim();
        logindata.email=logindata.email.trim();
        if(this.email_placeholder == 1)
        {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(!isNaN(logindata.email) || reg.test(logindata.email))
            {
                this.email_or_phone_error=false;
                this.Login()
            }
            else
            {
                this.email_or_phone_error=true;
            }
        }
        else
        {
            this.email_or_phone_error=false;
            this.Login()
        }
    }

    Login(){
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.LOGIN,this.user_login, (res_data) => {
        
            if (res_data.success) {
                localStorage.setItem('user', JSON.stringify(res_data.user));
                this.user_helper.check_detail();
                $('#login_modal').click();
                this.ngOnInit();
                this.error_message = '';
            } else {
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.error_message = this.user_helper.ERROR_CODE[res_data.error_code];
                this.user_helper.message();
            }
        });
    }

    open2(content2) {
     // this.NgbdModalBasic.open_login_modal();
      this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title', windowClass:'product_pop with_img'}).result.then((result) => {
       this.closeResult = `Closed with: ${result}`;
     }, (reason) => {
       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
     });
    }

    userForgotPassword(forgotpassworddata)
    {
        this.user_helper.myLoading=true;
        // this.user_helper.http.post(this.user_helper.POST_METHOD.FORGOT_PASSWORD,{email:forgotpassworddata.email.trim(), type:7}).map((res:Response) => res.json()).subscribe(res_data=>{
        //          console.log(res_data)
        //         this.user_helper.myLoading=false;
        //         if(res_data.success == false)
        //         {
        //             this.user_helper.data.storage = {
        //                 "code": res_data.error_code,
        //                 "message": this.user_helper.ERROR_CODE[res_data.error_code],
        //                 "class": "alert-danger"
        //             }
        //             this.user_helper.message()
        //             this.error_message = this.user_helper.ERROR_CODE[res_data.error_code];
        //         }
        //         else
        //         {
        //             this.user_helper.data.storage = {
        //                 "message": this.user_helper.MESSAGE_CODE[res_data.message],
        //                 "class": "alert-info"
        //             }
        //             $('#success_modal').click();
        //             $('#forgot_modal').click();
        //             this.error_message = '';
        //         }
        //     },
        //     (error: any) => {
        //         this.user_helper.myLoading=false;
        //         this.user_helper.http_status(error)
        //     });
    }

    public formData = new FormData();
    userRegister(userdata)
    {
        this.user_helper.myLoading=true;
        this.formData.append('phone',userdata.phone.trim());
        this.formData.append('password',this.user_register.password.trim());
        this.formData.append('country_id',this.user_register.country_id.toString());
        this.formData.append('city','');
        this.formData.append('social_id', '');
        this.formData.append('login_by', this.user_helper.title.manual);
        this.formData.append('country_phone_code',this.user_register.country_phone_code.toString());
        this.formData.append('first_name',userdata.first_name.trim());
        this.formData.append('last_name',userdata.last_name.trim());
        this.formData.append('email',userdata.email.trim());
        this.formData.append('address','');
        this.formData.append('referral_code','');
        this.formData.append('cart_unique_token',localStorage.getItem('cart_unique_token'));

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.REGISTER, this.formData, (res_data) => {

            this.user_helper.myLoading=false;
            if(res_data.success == false)
            {
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.message();
                this.error_message = this.user_helper.ERROR_CODE[res_data.error_code];
                this.formData = new FormData();
                if(this.user_register.login_by == this.title.social){
                    this.user_register.password = '123456';
                    this.user_register.confirm_password='123456';
                }
            }
            else
            {
                this.error_message = '';
                this.user_helper.data.storage = {
                    "message": this.user_helper.MESSAGE_CODE[res_data.message],
                    "class": "alert-info"
                }
                localStorage.setItem('user', JSON.stringify(res_data.user));
                this.user_helper.router.navigate(['']);
                this.user_helper.check_detail();
                $('#register_modal').click();
                this.ngOnInit();
                this.error_message = '';
            }
        });
    }

    set_address(address){
      this.delivery_location = [address.latitude, address.longitude];
      this.delivery_address = address.address;
      this.update_address();
      this.floor = address.floor;
      this.entry_code = address.entry_code;
      this.delivery_note = address.comment;
      this.selected_address_id = address._id;
    }

    change_user_wallet_status(event){
        this.user_helper.user_cart.myLoading = true;
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.CHANGE_USER_WALLET_STATUS, {user_id: this.user_id, server_token: this.server_token, is_use_wallet: event}, (res_data) => {
            this.user_helper.user_cart.myLoading = false;
            if(res_data.success){
                this.is_use_wallet = event;
            } else {
                this.is_use_wallet = !event;
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
            }
        });
    }
}
