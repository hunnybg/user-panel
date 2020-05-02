import { Component, NgZone, OnInit ,ElementRef, ViewChild} from '@angular/core';
import { Data } from './data';
import { Router, ActivatedRoute} from '@angular/router';
import { price_validation } from './constant';
import {Router_id} from './routing_hidden_id';
import {Cart} from './cart';
import {ERROR_CODE_CONSTANT, ADMIN_DATA_ID , DELIVERY_TYPE , ORDER_STATE , TIMEOUT , ORDER_STATUS_ID, PAYMENT_GATEWAY, WEEK_DAY, CONSTANT} from './constant';
import {title, button, heading_title , status , message , menu_title} from './user_panel_string';
import {ERROR_CODE} from './user_panel_error_message ';
import {MESSAGE_CODE} from './user_panel_success_message';
import {validation_message} from './user_panel_validation_message';
import {GET_METHOD , POST_METHOD} from './user_http_methods';
import {Response, Http} from '@angular/http';
import { map } from "rxjs/operators";
// import {TranslateService} from 'ng2-translate';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export interface CartProductItems{
    item_id: Object,
    unique_id: Number,
    item_name: string,
    quantity: Number,
    image_url: any,
    details: string,
    specifications: any[],
    item_price: Number,
    total_specification_price: Number,
    total_item_and_specification_price: Number,
    note_for_item: string
}

export interface cartProducts{
    items: any[],
    product_id: Object,
    product_name: string,
    unique_id: number,
    total_item_price: number
}

export interface cartSpecificationGroups{
    list: any[],
    name: string,
    price: number,
    type: number,
    unique_id: number,
    range: number,
    max_range: number
}


@Component({
    selector: 'helper'
})

export class Helper implements OnInit {

    ///// for constant ////////////
    public error_code : any = ERROR_CODE_CONSTANT;
    public PAYMENT_GATEWAY_CONSTANT :any = PAYMENT_GATEWAY
    public ORDER_STATE : any = ORDER_STATE;
    public TIMEOUT : any = TIMEOUT;
    public ORDER_STATUS_ID:any = ORDER_STATUS_ID;
    public title: any = title;
    public button: any = button;
    public heading_title: any = heading_title;
    public ERROR_CODE: any = ERROR_CODE;
    public MESSAGE_CODE: any = MESSAGE_CODE;
    public status: any = status;
    public WEEK_DAY: any = WEEK_DAY;
    public messages:any = message;
    public menu_title:any = menu_title;
    public validation_message:any = validation_message;
    public ADMIN_DATA_ID: any = ADMIN_DATA_ID;

    public GET_METHOD: any = GET_METHOD;
    public POST_METHOD: any = POST_METHOD;
    public myLoading:boolean = false;
    loading: boolean = false;
    public CONSTANT:any =  CONSTANT;
    private log_boolean: Boolean = false;
    declined:Boolean = false;
    interval:any;
    public cart_unique_token: string = localStorage.getItem('cart_unique_token');
    public user_id: string = '';
    private user_type: number;
    public server_token: string = '';

    private cartProductItems : CartProductItems;
    private cartProducts : cartProducts;
    private cartSpecificationGroups : cartSpecificationGroups;
    public user_name: string = '';
    public DELIVERY_TYPE: any = DELIVERY_TYPE;

    constructor(public http: Http , public toastr: ToastrService  , public trans: TranslateService, public ngZone:NgZone, public route: ActivatedRoute , public user_cart: Cart, public  router_id: Router_id, public router: Router,  public elementRef: ElementRef, public data: Data) {

    }

    ngOnInit() {

    }
    message() {
        // this.data.storage = {
        //     "code": '',
        //     "message": '',
        //     "class": ''
        // }
        // this.toastr.success('Hello world!', 'Toastr fun!');
        // this.toastr.dispose();
            if(this.data.storage.message !== '')
            {
                if(this.data.storage.class == "alert-info")
                {
                    var a = this.data.storage.message;
                    this.toastr.success(this.data.storage.message, null, {timeOut: TIMEOUT.TOASTER_NOTIFICATION})
                   // this.toastr.custom('<span>' + this.data.storage.message + '</span>', null, {enableHTML: true, toastLife: TIMEOUT.TOASTER_NOTIFICATION});
                    
                }
                else if(this.data.storage.class == "alert-danger")
                {

                    if(this.data.storage.code == this.error_code.TOKEN_EXPIRED || this.data.storage.code == this.error_code.STORE_DATA_NOT_FOUND)
                    {
                        this.router.navigate(['store/logout']);
                    }
                    // this.toastr.custom('<span>' + this.data.storage.message + '</span>', null, {enableHTML: true, toastLife: TIMEOUT.TOASTER_NOTIFICATION});
                    this.toastr.error(this.data.storage.message, null, {timeOut: TIMEOUT.TOASTER_NOTIFICATION})

                }
                this.data.storage = {
                    "code": '',
                    "message": '',
                    "class": ''
                }
            }
    }

    check_detail(){
      let user = JSON.parse(localStorage.getItem('user'));

        this.ngZone.run(() => {
          if(user && user._id){
              this.user_cart.user_id = user._id;
              this.user_cart.server_token = user.server_token;
          } else {
              this.user_cart.user_id = '';
              this.user_cart.server_token = '';
          }
        });
      this.cart_unique_token = localStorage.getItem('cart_unique_token');
      if(this.user_cart.user_id !== '') {
          this.get_user_detail()
      }
      this.get_cart();

      clearInterval(this.interval);
      if(this.user_cart.user_id !== '') {
          this.interval = setInterval(() => {
              this.get_user_detail()
          }, 5000);
      }
  }

    get_user_detail(){
        this.http_post_method_requester(this.POST_METHOD.GET_DETAIL,{user_id: this.user_cart.user_id, server_token: this.user_cart.server_token}, (res_data) => {

            // this.http.post(this.POST_METHOD.GET_DETAIL, {user_id: this.user_cart.user_id, server_token: this.user_cart.server_token}).map((res_data: Response) => res_data.json()) .subscribe(res_data => {
            if(res_data.success){
                this.user_cart.minimum_phone_number_length = res_data.minimum_phone_number_length;
                this.user_cart.maximum_phone_number_length = res_data.maximum_phone_number_length;


                this.data.storage = {
                    "message":  "",
                    "class": "alert-danger"
                }
                if(res_data.user.is_approved == false && this.declined == false)
                {
                    this.declined = true;
                    // this.modal.open();
                }
                else if(res_data.user.is_approved == true && this.declined == true)
                {
                    this.declined = false;
                    // this.modal.close();
                }

            } else {
                this.logout();
            }
        });
    }

    logout(){
        var user = JSON.parse(localStorage.getItem('user'));
        if(user!==null)
        {
            this.http_post_method_requester(this.POST_METHOD.LOGOUT, {store_id:user._id}, (res_data) => {
                this.myLoading=false;
                localStorage.removeItem('user');
                this.check_detail();
            });
        }
        else
        {
            this.myLoading=false;
            localStorage.removeItem('user');
            this.check_detail();
        }
        this.router.navigate(['']);
    }

    http_post_method_requester(api_name, parameter, response) {

        if(api_name !== 'api/user/get_detail' && api_name !== 'api/user/get_order_detail'){
            this.user_cart.myLoading = true;
        }
        this.http.post(api_name, parameter).pipe(map((res)=>res.json())).subscribe((res_data) => {
            if(api_name !== 'api/user/get_detail'){
                // console.log(res_data)
                this.user_cart.myLoading = false;
            }
            if (res_data.success) {
                response(res_data);
            } else {
                // if (res_data.error_code === 999) {
                //     localStorage.removeItem('admin_detail');
                //     this.router.navigate(['admin/login']);
                // } else {
                response(res_data);
                // }
            }
        }, (error) => {
            console.log(error)
        });
    }


    increase_qty(product_index, item_index){
        // if(this.user_cart.cart_data.cart[product_index].items[item_index].quantity < this.user_cart.cart_data.max_item_quantity_add_by_user) {
        this.myLoading = true;

        this.user_cart.cart_data.cart[product_index].items[item_index].quantity++;
        let qty = this.user_cart.cart_data.cart[product_index].items[item_index].quantity;
        let item_price = this.user_cart.cart_data.cart[product_index].items[item_index].item_price;
        let total_specification_price = this.user_cart.cart_data.cart[product_index].items[item_index].total_specification_price;

        this.user_cart.cart_data.cart[product_index].items[item_index].total_item_and_specification_price = ((item_price + total_specification_price) * qty);

        this.calculateTotalAmount()
        // return true;
        // }
    }

    decrease_qty(product_index, item_index){

        if(this.user_cart.cart_data.cart[product_index].items[item_index].quantity > 1){
            this.myLoading = true;
            this.user_cart.cart_data.cart[product_index].items[item_index].quantity--;

            let qty = this.user_cart.cart_data.cart[product_index].items[item_index].quantity;
            let item_price = this.user_cart.cart_data.cart[product_index].items[item_index].item_price;
            let total_specification_price = this.user_cart.cart_data.cart[product_index].items[item_index].total_specification_price;

            this.user_cart.cart_data.cart[product_index].items[item_index].total_item_and_specification_price = ((item_price + total_specification_price) * qty);
            this.calculateTotalAmount();


        }

    }

    checkout(){
        
        if(this.user_cart.cart_data.selectedStoreId){
            this.router.navigate(['city_name/delivery_name/store_name/' + this.user_cart.cart_data.selectedStoreId]);
        }
    }

    basket(){
        if(this.user_cart.cart_data.selectedStoreId){
            this.router.navigate(['basket']);
        }
    }

    calculateTotalAmount(){

        let total = 0.;
        this.user_cart.cart_data.cart.forEach((product) => {
            product.items.forEach((item) => {
                total = total + item.total_item_and_specification_price;
            })
        });
        this.user_cart.total_cart_amount = total;

        if(this.user_cart.cart_data.total_item == 0){
            this.clear_cart();
        } else {
            this.add_to_cart();
        }

    }

    remove_from_cart(product_index, item_index){
        this.myLoading = true;
        this.user_cart.cart_data.cart[product_index].items.splice(item_index, 1);
        if(this.user_cart.cart_data.cart[product_index].items.length <= 0){
            this.user_cart.cart_data.cart.splice(product_index, 1);
        }
        this.user_cart.cart_data.total_item--;
        this.calculateTotalAmount();
    }

    add_to_cart(){
        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.user_type = user.user_type;
            this.server_token = user.server_token;
        }
        if(this.user_cart.cart_data.destination_addresses.length == 0){
            if(user && user._id){
                this.user_cart.destination_address.user_type = user.user_type;
                this.user_cart.destination_address.user_details = {
                    "name": user.first_name + ' ' + user.last_name,
                    "country_phone_code": user.country_phone_code,
                    "phone": user.phone,
                    "email": user.email
                };
            }
            this.user_cart.cart_data.destination_addresses.push(this.user_cart.destination_address);
        }
        let json ={
            user_id: this.user_id,
            server_token: this.server_token,
            user_type: this.user_type,
            cart_id: this.user_cart.cart_data.cart_id,
            store_id: this.user_cart.cart_data.selectedStoreId,
            cart_unique_token: this.cart_unique_token,
            order_details: this.user_cart.cart_data.cart,
            destination_addresses: this.user_cart.cart_data.destination_addresses,
            pickup_addresses: this.user_cart.cart_data.pickup_addresses,
            total_cart_price: this.user_cart.total_cart_amount,
            total_item_tax: this.user_cart.total_item_tax
        }
        this.http_post_method_requester(this.POST_METHOD.ADD_ITEM_IN_CART, json, (res_data) => {

            if(res_data.success){

                this.router_id.user.currency = this.router_id.user.delivery_currency;
                this.user_cart.cart_data.cart_id = res_data.cart_id;
                this.user_cart.cart_data.city_id = res_data.city_id;
                this.data.storage = {
                    "message": this.MESSAGE_CODE[res_data.message],
                    "class": "alert-info"
                }
            } else {
                this.data.storage = {
                    "message": this.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.get_cart()
            }

            this.message();
            this.myLoading = false;

        });
    }

    get_cart(){

        this.cartProductItems = {
            item_id: null,
            unique_id: 0,
            item_name: '',
            quantity: 0,
            image_url: [],
            details: '',
            specifications: [],
            item_price: 0,
            total_specification_price: 0,
            total_item_and_specification_price: 0,
            note_for_item: ''
        }
        this.cartProducts = {
            items: [],
            product_id: null,
            product_name: '',
            unique_id: 0,
            total_item_price: 0
        }

        this.cartSpecificationGroups = {
            list: [],
            name: '',
            price: 0,
            type: 0,
            unique_id: 0,
            range: 0,
            max_range: 0
        }
        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
        } else {
            this.user_id = '';
            this.server_token = '';
        }
        let json = {
            user_id: this.user_id,
            server_token: this.server_token,
            cart_unique_token: this.cart_unique_token
        }
        this.http_post_method_requester(this.POST_METHOD.GET_CART, json, (res_data) => {
            this.user_cart.cart_data.cart = [];
            this.user_cart.cart_data.total_item = 0;
            this.user_cart.total_cart_amount = 0;
            this.user_cart.cart_main_item = [];
            if(res_data.success){
                this.router_id.user.currency = res_data.currency;
                this.user_cart.cart_data.cart_id = res_data.cart_id;
                this.user_cart.cart_data.city_id = res_data.city_id;

                this.user_cart.store_location = res_data.location;
                // this.user_cart.cart_data.deliveryAddress = res_data.destination_address;
                // this.user_cart.cart_data.deliveryLatLng = res_data.destination_location;
                this.user_cart.cart_data.destination_addresses = res_data.destination_addresses;
                this.user_cart.cart_data.pickup_addresses = res_data.pickup_addresses;
                this.user_cart.cart_data.selectedStoreId = res_data.store_id;
                let cart_data_res = res_data.cart.order_details;

                cart_data_res.forEach((cart_product) => {
                    this.cartProducts = JSON.parse(JSON.stringify(this.cartProducts));

                    // this.cartProducts.items = cart_product.items;
                    this.cartProducts.product_id = cart_product.product_detail._id;
                    this.cartProducts.product_name = cart_product.product_detail.name;
                    this.cartProducts.unique_id = cart_product.product_detail.unique_id;

                    let item_array = [];
                    let itemPriceTotal = 0;
                    cart_product.items.forEach((cart_item) => {

                        this.user_cart.cart_main_item.push(cart_item.item_details);

                        this.cartProductItems = JSON.parse(JSON.stringify(this.cartProductItems));

                        this.cartProductItems.item_id = cart_item.item_details._id;
                        this.cartProductItems.unique_id = cart_item.item_details.unique_id;
                        this.cartProductItems.item_name = cart_item.item_details.name;
                        this.cartProductItems.quantity = cart_item.quantity;
                        this.cartProductItems.image_url = cart_item.item_details.image_url;
                        this.cartProductItems.details = cart_item.item_details.details;
                        // this.cartProductItems.specifications = specificationList;
                        this.cartProductItems.item_price = cart_item.item_details.price;
                        // this.cartProductItems.total_specification_price = specificationPriceTotal;
                        // this.cartProductItems.total_item_and_specification_price = this.total;
                        this.cartProductItems.note_for_item = cart_item.note_for_item;
                        let specificationPriceTotal =0;
                        let specification_group_array = [];
                        cart_item.specifications.forEach((specification_group) => {

                            this.cartSpecificationGroups = JSON.parse(JSON.stringify(this.cartSpecificationGroups));

                            this.cartSpecificationGroups.name = specification_group.name;
                            this.cartSpecificationGroups.type = specification_group.type;
                            this.cartSpecificationGroups.unique_id = specification_group.unique_id;
                            this.cartSpecificationGroups.range = specification_group.range;
                            this.cartSpecificationGroups.max_range = specification_group.max_range;
                            // this.cartSpecificationGroups.price = specification_group.price;
                            // this.cartSpecificationGroups.list = specification_group.list;
                            let specification_array = [];
                            let specification_price = 0;
                            specification_group.list.forEach((specification) => {
                                cart_item.item_details.specifications.forEach((new_specification_group) => {
                                    if(specification_group.unique_id == new_specification_group.unique_id){
                                        new_specification_group.list.forEach((new_specification) => {
                                            if(specification.unique_id == new_specification.unique_id){
                                                specification.price = new_specification.price;
                                                specification_price = specification_price + new_specification.price;
                                                specification_array.push(specification);
                                                specificationPriceTotal = specificationPriceTotal + new_specification.price;
                                            }
                                        })
                                    }
                                })

                            });
                            this.cartSpecificationGroups.price = specification_price;
                            this.cartSpecificationGroups.list = specification_array;
                            specification_group_array.push(this.cartSpecificationGroups);
                        });
                        this.cartProductItems.specifications = specification_group_array;
                        this.cartProductItems.total_specification_price = specificationPriceTotal;
                        this.cartProductItems.total_item_and_specification_price = (specificationPriceTotal + cart_item.item_details.price)* cart_item.quantity;

                        item_array.push(this.cartProductItems)
                        itemPriceTotal = itemPriceTotal + (specificationPriceTotal + cart_item.item_details.price) * cart_item.quantity;
                        this.user_cart.cart_data.total_item++;
                    });
                    this.cartProducts.items = item_array;
                    this.cartProducts.total_item_price = itemPriceTotal;
                    this.user_cart.cart_data.cart.push(this.cartProducts);
                    this.user_cart.total_cart_amount = this.user_cart.total_cart_amount + itemPriceTotal;

                });

            }
        });


    }

    clear_cart(){
        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
        }
        let json = {
            user_id: this.user_id,
            server_token: this.server_token,
            cart_id: this.user_cart.cart_data.cart_id,
            cart_unique_token: this.cart_unique_token,
        }
        this.http_post_method_requester(this.POST_METHOD.CLEAR_CART, json, (res_data) => {
            this.myLoading = false;
            if(res_data.success){
                this.user_cart.cart_data = {
                    cart_id: null,
                    city_id: null,
                    destination_addresses: [],
                    pickup_addresses: [],
                    cart: [],
                    selectedStoreId: null,
                    total_item: 0
                }
                this.user_cart.total_cart_amount = 0;
                this.user_cart.order_payment_id = null;
            } else {
                this.data.storage = {
                    "message": this.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.get_cart()
            }
            this.message();
        });
    }

    go_to_deliveries(){
        this.router.navigate(['']);
    }

    signin(){
        this.user_cart.after_login = "deliveries"
        this.router.navigate(['user/login']);
    }

    register(){
        this.user_cart.after_login = "deliveries"
        this.router.navigate(['user/register']);
    }

    signout(){
        this.router.navigate(['profile']);
    }

    string_log(key , value){
        if(this.log_boolean){
            console.log(key + ': ' + value);
        }
    }

    json_log(json){
        if(this.log_boolean){
            console.log(json);
        }
    }


    http_status(error)
    {
        if (error.status === 500) {
            console.log("Internal Server Error")
        }
        else if (error.status === 502) {
            console.log("Bad Gateway")
        }
        else if (error.status === 404) {
            console.log("Url Not Found")
        }
        else if (error.status === 503) {
            console.log("Service Unavailable")
        }
        else if (error.status === 504) {
            console.log("Gateway Timeout")
        }
        else if (error.status === 408) {
            console.log("Request Timeout")
        }
        else if (error.status === 413) {
            console.log("Request Entity To Large")
        }
    }


    ////

    number_validation(evt)
    {
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
        {
            if( charCode == 46)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        return true;
    }

    price_validation(evt, price)
    {
        var charCode = (evt.which) ? evt.which : evt.keyCode
        price = price.toString();
        price = price.split(".");
        if(price[0] <= price_validation.MAX_PRICE)
        {
            if(price[1] == undefined)
            {
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                {
                    if( charCode == 46 && price[0] > 1)
                    {
                        return true;
                    }
                    return false;
                }
                return true;
            }
            else
            {
                if(price[1] <= price_validation.MAX_PRICE_AFTER_POINT)
                {
                    if (charCode > 31 && (charCode < 48 || charCode > 57))
                    {
                        return false;
                    }
                    return true;
                }
                else
                {
                    if(charCode == 8)
                    {
                        return true;
                    }
                    return false;
                }
            }
        }
        else
        {
            if(price[1] != undefined)
            {
                if(price[1] <= price_validation.MAX_PRICE_AFTER_POINT)
                {
                    if (charCode > 31 && (charCode < 48 || charCode > 57))
                    {
                        return false;
                    }
                    return true;
                }
                else
                {
                    if(charCode == 8)
                    {
                        return true;
                    }
                    return false;
                }
            }
            else
            {
                if(charCode == 46 || charCode == 8)
                {
                    return true;
                }
                return false;
            }

        }
    }

    getIDFromEmailToken(email_token) {

        var server_token = "", id = "", milli = "";
        var milli_seconds = 0;
        var length = 30;

        var milli_token = email_token.substr(0, length);
        var id_token = email_token.substr(length);

        for (var i = 0; i < length; i++) {
            if (i % 2 == 0) {
                milli = milli + milli_token.charAt(i);
            } else {
                server_token = server_token + milli_token.charAt(i);
            }
        }

        milli = milli.split("").reverse().join("");
        milli_seconds = parseInt(milli);

        length = id_token.length;
        for (var i = 0; i < length; i++) {
            if (i % 2 == 0) {
                id = id + id_token.charAt(i);
            } else {
                server_token = server_token + id_token.charAt(i);
            }
        }
        return {id:id , server_token:server_token , milli_seconds : milli_seconds};

    }

    GetCardType(number)
    {
        // visa
        var re = new RegExp("^4");
        if (number.match(re) != null)
            return "Visa";

        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
            return "Mastercard";

        // AMEX
        re = new RegExp("^3[47]");
        if (number.match(re) != null)
            return "AMEX";

        // Discover
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if (number.match(re) != null)
            return "Discover";

        // Diners
        re = new RegExp("^36");
        if (number.match(re) != null)
            return "Diners";

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (number.match(re) != null)
            return "Diners - Carte Blanche";

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (number.match(re) != null)
            return "JCB";

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (number.match(re) != null)
            return "Visa Electron";

        return "";
    }
}
