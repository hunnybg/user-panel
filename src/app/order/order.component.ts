import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {placeholder, option, title} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from '../user_helper';
import {Location} from "@angular/common";
declare var $:any;

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})

export class OrderComponent implements OnInit {

    public placeholder:any = placeholder;
    public option:any = option;
    public current_location: any;
    public selected_tag: any[] =[];
    deliveries_in_city: any[] = [];
    delivery_type_id: any = '';
    public city_id : Object;
    public current_delivery_type : any;
    public store_list : any[] = [];
    public filtered_store_list : any[] = [];
    public city_name: string = '';
    public filter_store_name: string = '';
    public delivery_currency :string = '';
    public cart_unique_token: string = '';
    public user_id: string = '';
    public server_token: string = '';
    public favourite_stores: any[] = [];
    public user_profile: string = '';
    public cart_data : any = {};
    is_show: boolean = false;
    public title:any = title;

    constructor( public bln: BooleanService, public user_helper: Helper) { }

    ngOnInit() {

        this.bln.showLogin = true;
        this.bln.showhedmid = true;
        this.bln.showcart = false;
        this.bln.isSticky = false;
        this.bln.showLink = false;
        this.bln.isHome = true;
        this.bln.cart = true;
        this.bln.showSignup = false;
        this.bln.isAdd_product = true;
        this.bln.isShop = true;
        this.bln.isInner_page = true;
        this.bln.isGreen = true;
        this.bln.isBod_btm_h = false;
        this.bln.address = true;

        this.deliveries_in_city = this.user_helper.router_id.deliveries_in_city;
        this.delivery_type_id = this.user_helper.router_id.user.delivery_type_id;
        this.current_delivery_type = this.user_helper.router_id.user_current_delivery_type;

        

        this.selected_tag = this.user_helper.router_id.user.selected_tag;

        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
            this.user_profile = user.image_url;
            this.favourite_stores = user.favourite_stores;
        }

        this.city_id = this.user_helper.router_id.user.city_id;
        let user_location = this.user_helper.router_id.user_current_location;
        this.current_location = JSON.parse(JSON.stringify(user_location));
        this.city_name = user_location.city1;
        this.delivery_currency = this.user_helper.router_id.user.delivery_currency;

        this.cart_unique_token = localStorage.getItem('cart_unique_token');
        this.cart_data = this.user_helper.user_cart.cart_data;

        if(this.delivery_type_id == ''){
            this.user_helper.router.navigate(['']);
        } else {
            this.get_store_list()
        }

        $(document).ready(function(){

        /* select */
        //  $(".search_l select").change(function(){
        //     $(this).find("option:selected").each(function(){
        //         var optionValue = $(this).attr("value");
        //         if(optionValue){
        //             $(".box").not("." + optionValue).hide();
        //             $("." + optionValue).show();
        //         } else{
        //             $(".box").hide();
        //         }
        //     });
        // }).change();


        /* toggle */

        $('.food_list .btn').click(function(e){
          e.preventDefault();
          var x = $(this).text();
          $('.con_name').empty().append(x);

        })
            $('.sort').click();

      })

    }

    hide_filter(){
        $('.food_list').slideToggle();
        this.is_show = !this.is_show;
    }

    range(number){
        let a = [];
        for(let i = 0; i < number; ++i)
        {
            a.push(i+1)
        }
        return a;
    }

    select_famous_tag(tag){
        var index = this.selected_tag.indexOf(tag);
        if(index == -1){
            this.selected_tag.push(tag)
        } else {
            this.selected_tag.splice(index, 1);
        }
        this.filter_store();
    }

    clear_all(){
        this.selected_tag = [];
        this.filter_store();
    }

    get_delivery_type_name(){
        let index = this.deliveries_in_city.findIndex((x)=>x._id == this.delivery_type_id);
        if(index != -1){
            return this.deliveries_in_city[index].delivery_name;
        } else {
            return 'Select Category'
        }
    }

    toggle_dropdown(){
        $('.user_dt1').toggle();
    }

    change_delivery_type(delivery_type_id){
        this.delivery_type_id = delivery_type_id;
        let index = this.deliveries_in_city.findIndex((x)=>x._id == this.delivery_type_id);
        this.current_delivery_type = this.deliveries_in_city[index];
        this.selected_tag = [];
        this.get_store_list();
        this.user_helper.router_id.user.delivery_type_id = this.deliveries_in_city[index]._id;
    }

    get_store_list(){

        let json = {
            city_id: this.city_id ,
            store_delivery_id: this.delivery_type_id,
            user_id: this.user_id,
            server_token: this.server_token,
            cart_unique_token: this.cart_unique_token,
            latitude: this.current_location.latitude,
            longitude: this.current_location.longitude
        }

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_STORE_LIST, json, (res_data) => {
            this.user_helper.myLoading = false;
            if(res_data.success){
                this.store_list = res_data.stores;
                this.filtered_store_list = res_data.stores;
                this.city_name = res_data.city_name;
                this.check_open(res_data.server_time, this.user_helper.user_cart.timezone);
                this.filter_store();
            } else {
                this.store_list = [];
                this.filtered_store_list = [];
                this.user_helper.data.storage = {
                    "code": res_data.error_code,
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.message();
            }
        });
    }

    check_open(server_date, timezone){
        let date:any = server_date;
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        if(isIEOrEdge){
            date = new Date(date);
        } else {
            date = new Date(date).toLocaleString("en-US", {timeZone: timezone})
        }
        date = new Date(date);
        let weekday = date.getDay();
        let current_time = date.getTime();

        this.filtered_store_list.forEach((store) =>{
            var index = this.favourite_stores.findIndex((x)=> x == store._id);
            if(index == -1){
                store.favourite = false;
            } else {
                store.favourite = true;
            }
            // store.distance = this.get_distance_two_location(store.location);
            store.close = true;
            store.nextopentime = '';
            let week_index = store.store_time.findIndex((x) => x.day == weekday)
            let day_time = store.store_time[week_index].day_time;
            console.log("week_index: "+ week_index)
            if(store.store_time[week_index].is_store_open_full_time){
                store.close = false;
            }

            else {
                if(store.store_time[week_index].is_store_open){
                    if(day_time.length == 0){
                        store.close = true;
                        this.check_next_open_time(server_date, timezone, store, week_index);
                    } else {
                        day_time.forEach((store_time , index) =>{
                            let open_time = store_time.store_open_time;
                            open_time = open_time.split(':')
                            let open_date_time = date.setHours(open_time[0] , open_time[1], 0 ,0)
                            open_date_time = new Date(open_date_time);
                            open_date_time = open_date_time.getTime();

                            let close_time = store_time.store_close_time;
                            close_time = close_time.split(':')
                            let close_date_time = date.setHours(close_time[0] , close_time[1], 0 ,0)
                            close_date_time = new Date(close_date_time);
                            close_date_time = close_date_time.getTime();

                            if(current_time > open_date_time && current_time < close_date_time){
                                store.close = false;
                            }

                            if(current_time < open_date_time && store.nextopentime == ''){
                                console.log('check_open: '+ store.name + ' ' + store_time.store_open_time)
                                store.nextopentime = store_time.store_open_time;
                            }
                        });

                        if(!store.nextopentime){
                            this.check_next_open_time(server_date, timezone, store, week_index);
                        }
                    }
                } else {
                    store.close = true;
                    store.nextopentime = '';
                    this.check_next_open_time(server_date, timezone, store, week_index)
                }
            }
        });
    }

    check_next_open_time(server_date, timezone, store, week_index){

        let date:any = server_date;
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        
        if(isIEOrEdge){
            date = new Date(date);
        } else {
            date = new Date(date).toLocaleString("en-US", {timeZone: timezone})
        }
        date = new Date(date);
        let weekday = date.getDay();
        let current_time = date.getTime();

        var days = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
        var date_time = JSON.parse(JSON.stringify(server_date));
        date_time = new Date(date_time);
        if(week_index == 6){
            week_index = 0;
            date_time = date_time.setDate(date_time.getDate() - 6);
            date_time = new Date(date_time);
        } else {
            week_index++;
            date_time = date_time.setDate(date_time.getDate() + 1);
            date_time = new Date(date_time);
        }

        if(weekday != week_index){
            let day_time = store.store_time[week_index].day_time;

            if(store.store_time[week_index].is_store_open_full_time){
                store.nextopentime = days[week_index];
            }
            else {
                if(store.store_time[week_index].is_store_open){
                    if(day_time.length == 0){
                        this.check_next_open_time(server_date, timezone, store, week_index);
                    } else {
                        day_time.forEach((store_time , index) =>{
                            let open_time = store_time.store_open_time;
                            open_time = open_time.split(':')
                            let open_date_time = date_time.setHours(open_time[0] , open_time[1], 0 ,0)
                            open_date_time = new Date(open_date_time);
                            open_date_time = open_date_time.getTime();

                            let close_time = store_time.store_close_time;
                            close_time = close_time.split(':')
                            let close_date_time = date_time.setHours(close_time[0] , close_time[1], 0 ,0)
                            close_date_time = new Date(close_date_time);
                            close_date_time = close_date_time.getTime();

                            if(current_time < open_date_time && store.nextopentime == ''){
                                store.nextopentime = days[week_index] + ' ' + store_time.store_open_time;
                            }
                        });

                        if(!store.nextopentime){
                            this.check_next_open_time(server_date, timezone, store, week_index);
                        }
                    }
                } else {
                    this.check_next_open_time(server_date, timezone, store, week_index)
                }
            }
        }
    }

    get_item_list(store){
        this.user_helper.router_id.user_current_store = store;
        this.user_helper.router_id.user.store_id = store._id;
        let delivery_name = this.current_delivery_type.delivery_name.replace(/ /g, "-");
        delivery_name = delivery_name.toLowerCase();
        let city_name = this.city_name.replace(/ /g, "-");
        city_name = city_name.toLowerCase();
        let store_name = store.name.replace(/ /g, "-");
        store_name = store_name.toLowerCase();
        this.user_helper.router.navigate([city_name + '/' + delivery_name + '/' + store_name + '/' + store._id]);
    }

    filter_store()
    {
        let filtered_store_tag_wise = [];
        if(this.selected_tag && this.selected_tag.length > 0){
            filtered_store_tag_wise = this.store_list.filter((store) => {
                var bool = false;
                this.selected_tag.forEach((tag) => {
                    var index = store.famous_products_tags.indexOf(tag);
                    if(index !== -1){
                        bool = true;
                    }
                })
                if(bool){
                    return store
                }
            });
        } else {
            filtered_store_tag_wise = this.store_list;
        }
        
        
        let data: any = this.filter_store_name.replace(/^\s+|\s+$/g, '');
        data = data.replace(/ +(?= )/g, '');
        data = new RegExp(data,"gi");

        this.filtered_store_list = filtered_store_tag_wise.filter((store) => {
            var a = store.name.match(data);
            return a !== null
        });
        this.filtered_store_list.sort(this.sortItem);
    }

    sortItem(a,b) {
        return (a.close === b.close)? 0 : a.close? 1 : -1;;
    }

}

