import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links, placeholder, label, button, description, price, menu_title, orderTable, status} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
declare var jquery:any;
declare var $ :any;
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})
export class OrdersComponent implements OnInit {

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

    current_order_list: any[] = [];
    order_history: any[] = [];
    curren_selected_tab: number = 1;
    private user_id: string = '';
    private server_token: string = '';
    ORDER_STATE:any;
    ORDER_STATUS_ID: any;
    status:any;
    is_filter: boolean = false;
    start_date: any = '';
    end_date: any = '';

    date_error: number = 0;

    cancel_reason: string = '';
    private order_id: string = '';
    order_status: number = 0;
    closeResult: string;

    constructor(  public bln: BooleanService, private modalService: NgbModal , public user_helper: Helper ) { }

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
        this.ORDER_STATE=this.user_helper.ORDER_STATE;
        this.ORDER_STATUS_ID = this.user_helper.ORDER_STATUS_ID;
        this.status=status
        this.bln.address = true;

        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
        } else {
            this.user_helper.router.navigate(['']);
        }

        this.get_current_order_list();
        this.history();

    }

    get_current_order_list(){
        this.user_helper.user_cart.myLoading = true;
        this.curren_selected_tab = 1;
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_ORDERS, {user_id: this.user_id, server_token: this.server_token}, (res_data) => {
            this.user_helper.user_cart.myLoading = false;
            
            if(res_data.success){
                this.current_order_list = res_data.order_list;
                this.current_order_list.sort(this.sortOrder);
            } else {
                this.current_order_list = [];
            }
        });
    }

    sortOrder(a, b) {
        if (a.unique_id < b.unique_id)
            return 1;
        if (a.unique_id > b.unique_id)
            return -1;
    }

    history_filter(){
        if(this.start_date == '' || this.start_date == undefined){
            this.date_error = 1;
        } else if(this.end_date == '' || this.end_date == undefined){
            this.date_error = 2;
        } else {
            this.date_error = 0;
            this.history();
        }
    }

    history(){
        this.user_helper.user_cart.myLoading = true;
        this.curren_selected_tab = 2;
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.ORDER_HISTORY, {user_id: this.user_id, server_token: this.server_token, start_date:this.start_date, end_date: this.end_date}, (res_data) => {

            this.user_helper.user_cart.myLoading = false;
            if(res_data.success){
                this.order_history = res_data.order_list;
                this.order_history.sort(this.sortOrder);
            } else {
                this.order_history = [];
            }
        });
    }

    get_order_detail(order_id, order_status){
        this.user_helper.router_id.user.order_id = order_id;
        this.user_helper.router.navigate(['delivery-coming']);
        // if(order_status == this.ORDER_STATE.ORDER_COMPLETED){
        //     this.user_helper.router.navigate(['order/invoice']);
        // } else {
        //     this.user_helper.router.navigate(['order_detail']);
        // }
    }

    get_history_detail(order_id, order_status_id){
        // if(order_status_id === this.ORDER_STATUS_ID.COMPLETED){
        this.user_helper.router_id.user.order_id = order_id;
        this.user_helper.router.navigate(['order_detail']);
        // }
    }

    cancel_order(order_id, order_status, cancel_order_modal){
        this.order_status = order_status;
        this.order_id = order_id;
        this.cancel_reason = '';
        this.open(cancel_order_modal);
    }

    change_cancelation_reason(id){
        var value = $('#'+id).val();
        if(value == 'other'){
            $('#text_box').show();
            this.cancel_reason = '';
        } else {
            $('#text_box').hide();
            this.cancel_reason =value;
        }
    }

    open(content) {
        this.modalService.open(content, {size: 'sm'}).result.then((result) => {
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

    set_cancel_reason(event){
        this.cancel_reason = event.target.value;
    }

    cancel_order_service(){
        if(this.cancel_reason !== '') {

            let json = {
                user_id: this.user_id,
                server_token: this.server_token,
                order_id: this.order_id,
                order_status: this.order_status,
                cancel_reason: this.cancel_reason
            }
            this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.USER_CANCEL_ORDER, json, (res_data) => {
                this.user_helper.myLoading = false;
                if (res_data.success) {
                    this.user_helper.data.storage = {
                        "message": this.user_helper.MESSAGE_CODE[res_data.message],
                        "class": "alert-info"
                    }
                    $('#cancel_modal_close').click();
                    this.user_helper.router.navigate(['orders']);
                } else {
                    this.user_helper.data.storage = {
                        "message": this.user_helper.ERROR_CODE[res_data.error_code],
                        "class": "alert-danger"
                    }
                    $('#cancel_modal_close').click();
                    this.user_helper.router.navigate(['orders']);
                }
                this.get_current_order_list();
                this.history();
            });
        }
    }

}
