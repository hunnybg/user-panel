import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links, placeholder, label, button, description, price, menu_title, orderTable} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
declare var jquery:any;
declare var $ :any;

export interface AddCard{
    card_holder_name: string,
    card_number: string,
    last_four: number,
    expiry_month: number,
    expiry_year: number,
    cvv: number,
    card_type: string,
    payment_token: string
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})
export class PaymentsComponent implements OnInit {

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

    public add_card_data: AddCard
    private user_id: string = '';
    private server_token: string = '';
    user_profile: string = '';
    private current_location : Object = {};
    private is_cash_payment_mode: Boolean = false;
    private is_use_wallet: Boolean = false;
    private wallet: number = 0;
    private wallet_currency_code: string = '';
    private payment_gateway : any[] = [];
    private selected_payment_gateway: string = '';
    private card_list : any[] = [];
    private new_wallet_amount: number = null;
    private card_error : string = '';
    private wallet_error : string = '';

    is_edit: boolean = false;
    show_add_card:boolean = false;
    show_add_wallet: boolean = false;

    constructor(  public bln: BooleanService, public helper: Helper ) { }

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
        this.bln.address = true;

        $(document).ready(function(){
            $(".edit").click(function(){
                $(this).parent().siblings().addClass("edit_data");
                $(".save, .change").show();
                $(this).hide();
            })
        })

        this.selected_payment_gateway = this.helper.PAYMENT_GATEWAY_CONSTANT.STRIPE;
        this.add_card_data = {
            card_holder_name: '',
            card_number: '',
            last_four: null,
            expiry_year: null,
            expiry_month: null,
            cvv: null,
            card_type: '',
            payment_token: ''
        }

        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
            this.user_profile = user.image_url;
        } else {
            this.helper.router.navigate(['']);
        }

        this.current_location = JSON.parse(localStorage.getItem('current_location'));
        this.get_payment_gateway(this.current_location);

    }

    get_payment_gateway(current_location){

        current_location.user_id = this.user_id;
        current_location.server_token =  this.server_token;
        current_location.city_id = this.helper.router_id.user.city_id
        this.helper.http_post_method_requester(this.helper.POST_METHOD.GET_PAYMENT_GATEWAY, current_location, (res_data) => {

            if(res_data.success) {
                this.helper.myLoading = false;
                this.is_cash_payment_mode = res_data.is_cash_payment_mode;
                this.is_use_wallet = res_data.is_use_wallet;
                this.wallet = res_data.wallet;
                this.wallet_currency_code = res_data.wallet_currency_code;
                this.payment_gateway = res_data.payment_gateway;

                // if (this.is_cash_payment_mode) {
                //     this.selected_payment_gateway = 'cash';
                // }

                // if (!this.is_cash_payment_mode && this.payment_gateway.length > 0) {
                //     this.selected_payment_gateway = this.payment_gateway[0]._id;
                // }
                if (this.payment_gateway.length > 0) {
                    let index = this.payment_gateway.findIndex((x) => (x._id).toString() == this.helper.PAYMENT_GATEWAY_CONSTANT.STRIPE)

                    if (index !== -1) {
                        this.get_card()
                    }
                }
            } else {

            }
        });
    }
    get_card() {
        this.helper.http_post_method_requester(this.helper.POST_METHOD.GET_CARD_LIST, {user_id: this.user_id, server_token: this.server_token}, (res_data) => {
            if(res_data.success){
                this.card_list = res_data.cards;
            } else {

            }
        });
    }


    add_new_card(){
        this.show_add_card = true;
        this.card_error = '';
        this.wallet_error = '';
    }
    card_number_validation(evt){
        var charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
        {
            return false;
        }

        document.getElementById('card_number').addEventListener('input',  (e:any) => {
            e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();

            if(e.target.value.length == 2){
                let card_type = this.helper.GetCardType(e.target.value);
                this.add_card_data.card_type = card_type;
            }
        });

        return true;
    }

    add_card(){
        this.helper.myLoading = true;
        (<any>window).Stripe.card.createToken({
            number: this.add_card_data.card_number,
            exp_month: this.add_card_data.expiry_month,
            exp_year: this.add_card_data.expiry_year,
            cvc: this.add_card_data.cvv
        }, (status: number, response: any) => {
            if (status === 200) {
                this.helper.ngZone.run(() => {
                    this.card_error = '';
                });
                this.add_card_data.last_four = response.card.last4;
                this.add_card_data.payment_token = response.id;
                this.add_card_service(this.add_card_data)
            } else {
                this.helper.ngZone.run(() => {
                    this.helper.myLoading = false;
                    this.card_error = response.error.message;
                });
            }
        });
    }

    add_card_service(card_data) {
        card_data.user_id = this.user_id;
        card_data.server_token = this.server_token;
        card_data.payment_id = this.selected_payment_gateway;
        card_data.type = 7;
        card_data.card_expiry_date = card_data.expiry_month+'/'+card_data.expiry_year;
        // delete card_data.card_number;

        this.helper.http_post_method_requester(this.helper.POST_METHOD.ADD_CARD, card_data, (res_data) => {
            this.helper.myLoading = false;
            if(res_data.success){
                this.show_add_card = false;
                this.helper.myLoading = false;
                this.card_list.push(res_data.card);
                this.helper.data.storage = {
                    "message": this.helper.MESSAGE_CODE[res_data.message],
                    "class": "alert-info"
                }
                this.add_card_data = {
                    card_holder_name: '',
                    card_number: '',
                    last_four: null,
                    expiry_year: null,
                    expiry_month: null,
                    cvv: null,
                    card_type: '',
                    payment_token: ''
                }
            } else {
                this.helper.data.storage = {
                    "message": this.helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
            }
            this.helper.message();
        });
    }

    delete_card(card_id , card_index){
        this.helper.myLoading = true;
        this.helper.http_post_method_requester(this.helper.POST_METHOD.DELETE_CARD, {user_id: this.user_id, server_token: this.server_token, card_id: card_id}, (res_data) => {

            this.helper.myLoading = false;
            if(res_data.success){
                if(this.card_list[card_index].is_default && this.card_list.length > 1){
                    this.card_list.splice(card_index, 1);
                    this.card_list[0].is_default = true;

                } else {
                    this.card_list.splice(card_index, 1)
                }
                this.helper.data.storage = {
                    "message": this.helper.MESSAGE_CODE[res_data.message],
                    "class": "alert-info"
                }

            } else {
                this.helper.data.storage = {
                    "message": this.helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
            }
            this.helper.message();
        });
    }

    select_card(card_id , card_index){
        if(!this.card_list[card_index].is_default){
            this.helper.myLoading = true;
            this.helper.http_post_method_requester(this.helper.POST_METHOD.SELECT_CARD, {user_id: this.user_id, server_token: this.server_token, card_id: card_id}, (res_data) => {

                this.helper.myLoading = false;
                if(res_data.success){
                    let index = this.card_list.findIndex((x)=> x.is_default == true)
                    this.card_list[index].is_default = false;
                    this.card_list[card_index].is_default = true;
                } else {
                    this.helper.data.storage = {
                        "message": this.helper.ERROR_CODE[res_data.error_code],
                        "class": "alert-danger"
                    }
                }
            });
        }

    }

    change_user_wallet_status(event){
        this.helper.myLoading = true;
        this.helper.http_post_method_requester(this.helper.POST_METHOD.CHANGE_USER_WALLET_STATUS, {user_id: this.user_id, server_token: this.server_token, is_use_wallet: event}, (res_data) => {

            this.helper.myLoading = false;
            if(res_data.success){
                this.is_use_wallet = event;
            } else {
                this.is_use_wallet = !event;
                this.helper.data.storage = {
                    "message": this.helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
            }
        });
    }
    add_wallet_modal(){
        this.show_add_wallet = true;
    }

    add_wallet_service(){

        if(this.new_wallet_amount > 0) {
            this.wallet_error = '';
            // if (this.selected_payment_gateway == this.helper.PAYMENT_GATEWAY_CONSTANT.STRIPE) {
                let index = this.card_list.findIndex((x) => x.is_default == true)
                if (index !== -1) {
                    let card_id = this.card_list[index]._id
                    this.helper.myLoading = true;
                    let json = {
                        user_id: this.user_id,
                        server_token: this.server_token,
                        wallet: Number(this.new_wallet_amount),
                        payment_id: this.selected_payment_gateway,
                        card_id: card_id,
                        type: this.helper.ADMIN_DATA_ID.USER
                    }
                    this.helper.http_post_method_requester(this.helper.POST_METHOD.ADD_WALLET_AMOUNT, json, (res_data) => {

                        this.helper.myLoading = false;
                        this.new_wallet_amount = null;
                        this.show_add_wallet = false;
                        if (res_data.success) {
                            this.helper.data.storage = {
                                "message": this.helper.MESSAGE_CODE[res_data.message],
                                "class": "alert-info"
                            }
                            this.wallet = res_data.wallet;

                        } else {
                            this.helper.data.storage = {
                                "message": this.helper.ERROR_CODE[res_data.error_code],
                                "class": "alert-danger"
                            }
                        }
                        this.helper.message();
                    });
                } else {
                    this.wallet_error = "Please Add Card First";
                }
            // }
        } else {
            this.wallet_error = "Enter Proper amount"
        }
    }
    movetoNext(event, nextfield){
        if (event.target.value.length >= event.target.maxLength) {
            $('#'+nextfield).focus();
        }
    }

}
