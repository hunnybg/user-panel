import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links, placeholder, label, button, description, price, menu_title, orderTable} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-favourite-stores',
  templateUrl: './favourite-stores.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})
export class FavouriteStoresComponent implements OnInit {

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
    private favourite_stores: any[] = [];
    filtered_store_list: any[] = [];
    delete_favourite_store_array : any[] =[];
    is_edit: boolean = false;

    constructor(  public bln: BooleanService, public user_helper: Helper ) { }

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


        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
            this.favourite_stores = user.favourite_stores;
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_FAVOURITE_STORE_LIST, {user_id: this.user_id, server_token: this.server_token}, (res_data) => {
            if(res_data.success){
                this.filtered_store_list = res_data.favourite_stores;
            }
        });
    }

    check_store(store_id){
        var index = this.delete_favourite_store_array.indexOf(store_id);
        if(index == -1){
            this.delete_favourite_store_array.push(store_id);
        } else {
            this.delete_favourite_store_array.splice(index, 1);
        }
    }

    get_item_list(store){
        this.user_helper.router_id.user_current_store = store;
        this.user_helper.router_id.user.store_id = store._id;
        let store_name = store.name.replace(/ /g, "-");
        store_name = store_name.toLowerCase();

        this.user_helper.router.navigate(["city_name" + '/' + "delivery_name" + '/' + store_name + '/' + store._id]);
    }

    delete_store(){
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.REMOVE_FAVOURITE_STORE, {store_id: this.delete_favourite_store_array, user_id: this.user_id, server_token: this.server_token}, (res_data) => {
            this.favourite_stores = res_data.favourite_stores;
            let user = JSON.parse(localStorage.getItem('user'));
            user.favourite_stores = res_data.favourite_stores;
            localStorage.setItem('user', JSON.stringify(user));
            this.delete_favourite_store_array = [];
            this.is_edit = false;
            this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_FAVOURITE_STORE_LIST, {user_id: this.user_id, server_token: this.server_token}, (res_data) => {
                if(res_data.success){
                    this.filtered_store_list = res_data.favourite_stores;
                } else {
                    this.filtered_store_list = [];
                }
            });
        });
    }
}
