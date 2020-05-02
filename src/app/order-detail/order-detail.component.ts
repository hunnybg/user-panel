import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links, placeholder, label, button, description, price, menu_title, orderTable} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
declare var jquery:any;
declare var $ :any;
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

export interface OrderDetail{
    _id: Object,
    currency: string,
    request_id: string,
    request_status: number,
    store_detail: Object,
    unique_id: number,
    order_status: number,
    order_status_id: number,
    total_time: string,
    confirmation_code_for_complete_delivery: string,
    destination_addresses: any[],
    pickup_addresses: any[],
    store_id: any,
}

export interface StoreDetail{
    image_url: string,
    name: string
}

export interface ProviderDetail{
    _id: Object,
    first_name: string,
    image_url: string,
    last_name: string,
    location: any[]
}

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
    providers: [Helper]
})
export class OrderDetailComponent implements OnInit {

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

    OrderDetail: OrderDetail;
    StoreDetail: StoreDetail;
    ProviderDetail: ProviderDetail;
    destination_address: any = {};
    order_payment: any = {};

    private user_id: string = '';
    private server_token: string = '';
    private order_id: string = '';
    private total_item : number = 0;
    private order_total : number = 0;
    is_confirmation_code_required_at_complete_delivery: boolean = false;

    selected_screen: number = 1;

    old_lat_lng: any[];
    new_lat_lng: any[];

    ORDER_STATE:any;
    ORDER_STATE_ID: any;
    status:any;
    order_detail: any[] = [];
    map: any;
    interval: any;
    order_interval: any;
    delivery_currency: string = '';
    numDeltas: number = 100;
    delay: number = 100;
    i: number = 0;
    map_loaded:Boolean = false;

    show_code: Boolean = false;
    is_user_pick_up_order: Boolean = false;
    cancel_reason: string = '';
    user_type: number = 0;

     total_cart_price: number = 0;
    total_item_tax: number = 0;

    constructor(  public bln: BooleanService, private modalService: NgbModal , public helper: Helper ) { }
    ngOnDestroy(){
        clearInterval(this.interval);
        clearInterval(this.order_interval);
    }

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

        this.status=this.helper.status;
        this.ORDER_STATE=this.helper.ORDER_STATE;
        this.ORDER_STATE_ID = this.helper.ORDER_STATUS_ID;

        this.OrderDetail = {
            _id: null,
            request_id: null,
            request_status: 0,
            currency: '',
            store_detail: {},
            unique_id: 0,
            order_status: 0,
            order_status_id: 0,
            total_time: '',
            confirmation_code_for_complete_delivery: '',
            destination_addresses: [],
            pickup_addresses: [],
            store_id: ''
        }

        this.ProviderDetail = {
            _id: null,
            first_name: '',
            image_url: '',
            last_name: '',
            location: []
        }

        this.StoreDetail = {
            name: '',
            image_url: ''
        }

        this.helper.message();
        this.helper.myLoading = true;


        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
            this.user_type = user.user_type;
        } else {
            this.helper.router.navigate(['deliveries']);
        }
        this.order_id = this.helper.router_id.user.order_id;

        this.get_order_detail(1);
        this.order_interval=setInterval(()=>{
            this.get_order_detail(2);
        },5000)
    }

    cancel_order(){
        this.helper.ngZone.run(() => {
            $('.iradio').iCheck({
                handle: 'radio',
                radioClass: 'iradio_square-green'
            });
            $('#default_reason').iCheck('check');
            this.cancel_reason = $('#default_reason').val();
            $('.iradio').on('ifChecked', (event) => {

                if(event.target.value == 1){
                    $('#text_box').show();
                    this.cancel_reason = '';
                } else {
                    $('#text_box').hide();
                    this.cancel_reason = event.target.value;
                }
            });
        });
        // this.cancel_order_modal.open();
    }

    set_cancel_reason(event){
        this.cancel_reason = event.target.value;
    }

    cancel_order_service(){

        if(this.cancel_reason !== '') {

            let json = {
                user_id: this.user_id,
                server_token: this.server_token,
                order_id: this.order_id,
                order_status: this.OrderDetail.order_status,
                cancel_reason: this.cancel_reason
            }

            this.helper.http_post_method_requester(this.helper.POST_METHOD.USER_CANCEL_ORDER, json, (res_data) => {

                    this.helper.myLoading = false;
                if (res_data.success) {
                    this.helper.data.storage = {
                        "message": this.helper.MESSAGE_CODE[res_data.message],
                        "class": "alert-info"
                    }
                    this.helper.router.navigate(['orders']);
                } else {
                    this.helper.data.storage = {
                        "message": this.helper.ERROR_CODE[res_data.error_code],
                        "class": "alert-danger"
                    }
                    this.helper.router.navigate(['orders']);
                }
            });
        }
    }



    get_order_detail(n){

        let json = {
            user_id: this.user_id,
            server_token: this.server_token,
            order_id: this.order_id
        }
        this.helper.http_post_method_requester(this.helper.POST_METHOD.GET_ORDER_DETAIL, json, (res_data) => {
            this.helper.myLoading = false;
            console.log(res_data)
            if (res_data.success) {
                this.order_detail = res_data.order.cart_detail.order_details;
                this.destination_address = res_data.order.cart_detail.destination_addresses[0];
                this.OrderDetail = res_data.order;
                this.OrderDetail.currency = res_data.order.country_detail.currency_sign;
                this.delivery_currency = res_data.order.country_detail.currency_sign;
                this.order_payment = res_data.order.order_payment_detail;
                if(res_data.order.request_id !== null && res_data.order.request_detail){
                    this.OrderDetail.request_status = res_data.order.request_detail.delivery_status
                } else {
                    this.OrderDetail.request_status = 0;
                }
                this.OrderDetail.destination_addresses = res_data.order.cart_detail.destination_addresses
                this.OrderDetail.pickup_addresses = res_data.order.cart_detail.pickup_addresses
                this.total_item_tax = res_data.order.cart_detail.total_item_tax;
                this.total_cart_price = res_data.order.cart_detail.total_cart_price;
                this.StoreDetail = res_data.order.store_detail;
                this.is_user_pick_up_order = res_data.order.order_payment_detail.is_user_pick_up_order;
                this.is_confirmation_code_required_at_complete_delivery = res_data.is_confirmation_code_required_at_complete_delivery;

                // if(this.OrderDetail.order_status_id == this.helper.ORDER_STATUS_ID.CANCELLED || this.OrderDetail.order_status_id == this.helper.ORDER_STATUS_ID.REJECTED){
                //     this.helper.router.navigate(['orders']);
                // } else {

                    let time = res_data.order.order_payment_detail.total_time * 60;
                    let hours = Math.floor(time / 3600)
                    let minute = Math.floor((time % 3600) / 60);

                    this.OrderDetail.total_time = hours + ' hr ' + ': ' + minute + ' min';

                    if (n == 1) {
                        this.order_detail.forEach((product) => {
                            product.items.forEach((item) => {
                                this.total_item = this.total_item + 1;
                                this.order_total = this.order_total + item.total_item_price;
                            })
                        });
                    }

                    // if (this.OrderDetail.request_status == this.ORDER_STATE.ORDER_COMPLETED) {
                    //     this.helper.router.navigate(['order/invoice']);
                    // }
                // }

            } else {
                this.helper.data.storage = {
                    "message": this.helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.helper.router.navigate(['orders']);
            }
        });

    }

    get_item_data(){
        this.selected_screen = 1;
    }
    get_deliveryman_data(){

        if(this.OrderDetail.request_status >= this.ORDER_STATE.DELIVERY_MAN_STARTED_DELIVERY && this.OrderDetail.request_status < this.ORDER_STATE.ORDER_COMPLETED){
            this.selected_screen = 2;
        }
    }

    clear_old_cart(clear_cart_modal){
        this.helper.user_cart.cart_data.cart = [];
        $('#clear_cart_modal_close').click();
        this.reorder(clear_cart_modal);
    }

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass:'product_pop with_img'}).result.then((result) => {
         
        }, (reason) => {
        });
      }

    reorder(clear_cart_modal){
        if(this.helper.user_cart.cart_data.cart.length > 0){
            $('#clear_cart_modal').click();
            this.open(clear_cart_modal);
        } else {
            let json ={
                user_id: this.user_id,
                server_token: this.server_token,
                user_type: this.user_type,
                store_id: this.OrderDetail.store_id,
                cart_unique_token: this.helper.cart_unique_token,
                order_details: this.order_detail,
                destination_addresses: this.OrderDetail.destination_addresses,
                pickup_addresses: this.OrderDetail.pickup_addresses,
                total_item_tax: this.total_item_tax,
                total_cart_price: this.total_cart_price
            }
            console.log(json)
            this.helper.http_post_method_requester(this.helper.POST_METHOD.ADD_ITEM_IN_CART, json, (res_data) => {
        
                if(res_data.success){

                    this.helper.router_id.user.currency = this.helper.router_id.user.delivery_currency;
                    this.helper.user_cart.cart_data.cart_id = res_data.cart_id;
                    this.helper.user_cart.cart_data.city_id = res_data.city_id;
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
                this.helper.router.navigate(['']);
                this.helper.get_cart();

                this.helper.message();
                this.helper.myLoading = false;
           
            });

        }
    }

}
