import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links} from '../helper';
import {Helper} from "../user_helper";
declare var google;

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
    confirmation_code_for_complete_delivery: string
}

export interface ProviderDetail{
    _id: Object,
    first_name: string,
    image_url: string,
    last_name: string,
    location: any[]
}

@Component({
  selector: 'app-delivery-coming',
  templateUrl: './delivery-coming.component.html',
    providers: [Helper]
})
export class DeliveryComingComponent implements OnInit {

	public title:any = title;
	public links:any = links;

	order_id: string = '';
    public user_id: string = '';
    public server_token: string = '';
    OrderDetail: OrderDetail;
    ProviderDetail: ProviderDetail;
    order_interval: any;
    ORDER_STATE: any;
    order_detail: any[] = [];
    destination_address: any = {};
    pickup_address: any = {};
    order_payment: any = {};
    selected_screen: number = 1;
    date_time: any[] = [];
    accepted_time: any = '';
    provider_accepted_time: any = '';
    picked_time: any = '';
    ready_time: any = '';
    deliveryman_on_the_way_time: any = '';
    is_get_code: boolean = false;
    is_get_pick_up_code: boolean = false;
    is_user_pick_up_order: boolean = false;

    numDeltas: number = 100;
    delay: number = 100;
    i: number = 0;
    map_loaded:Boolean = false;
    old_lat_lng: any[];
    new_lat_lng: any[];
    map: any;
    interval: any;
    public directionsDisplay = new google.maps.DirectionsRenderer;
    bounds: any;

  constructor( public bln: BooleanService, public user_helper: Helper) { }

    ngOnDestroy(){
        clearInterval(this.order_interval);
    }

  ngOnInit() {
 	
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
    this.bln.isGreen = false;
    this.bln.isBod_btm_h = false;
      this.bln.address = true;

    this.order_id = this.user_helper.router_id.user.order_id;
    let user = JSON.parse(localStorage.getItem('user'));
    if(user && user._id){
        this.user_id = user._id;
        this.server_token = user.server_token;
    }
    this.ORDER_STATE = this.user_helper.ORDER_STATE;
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
          confirmation_code_for_complete_delivery: ''
      }
      this.ProviderDetail = {
            _id: null,
            first_name: '',
            image_url: '',
            last_name: '',
            location: []
        }
      this.get_order_detail();
      this.order_interval=setInterval(()=>{
          this.get_order_detail();
      },3000)


  }

    get_order_detail(){

        let json = {
            user_id: this.user_id,
            server_token: this.server_token,
            order_id: this.order_id
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_ORDER_DETAIL, json, (res_data) => {
            this.user_helper.myLoading = false;
            if (res_data.success) {
                this.order_detail = res_data.order.cart_detail.order_details;
                this.destination_address = res_data.order.cart_detail.destination_addresses[0];
                this.pickup_address = res_data.order.cart_detail.pickup_addresses[0];
                this.OrderDetail = res_data.order;
                this.OrderDetail.currency = res_data.order.country_detail.currency_sign;
                this.order_payment = res_data.order.order_payment_detail;
                this.date_time = res_data.order.date_time;
                if(res_data.order.request_detail){
                  res_data.order.request_detail.date_time.forEach((date)=>{
                    this.date_time.push(date);
                  })
                }
                this.is_user_pick_up_order = res_data.order.order_payment_detail.is_user_pick_up_order;
                var accepted_index = this.date_time.findIndex((date)=>date.status==this.ORDER_STATE.STORE_ACCEPTED);
                if(accepted_index !==-1){
                  this.accepted_time = this.date_time[accepted_index].date;
                }
                var ready_index = this.date_time.findIndex((date)=>date.status==this.ORDER_STATE.OREDER_READY);
                if(ready_index !==-1){
                  this.ready_time = this.date_time[ready_index].date;
                }
                var deliveryman_on_the_way_index = this.date_time.findIndex((date)=>date.status==this.ORDER_STATE.DELIVERY_MAN_PICKED_ORDER);
                if(deliveryman_on_the_way_index !==-1){
                  this.deliveryman_on_the_way_time = this.date_time[deliveryman_on_the_way_index].date;
                }

                var provider_accepted_index = this.date_time.findIndex((date)=>date.status==this.ORDER_STATE.DELIVERY_MAN_ACCEPTED);
                if(provider_accepted_index !==-1){
                  this.provider_accepted_time = this.date_time[provider_accepted_index].date;
                }

                var picked_index = this.date_time.findIndex((date)=>date.status==this.ORDER_STATE.DELIVERY_MAN_PICKED_ORDER);
                if(picked_index !==-1){
                  this.picked_time = this.date_time[picked_index].date;
                }

                if(res_data.order.request_id){
                    this.OrderDetail.request_status = res_data.order.request_detail.delivery_status
                } else {
                    this.OrderDetail.request_status = 0;
                }

                if(this.OrderDetail.order_status_id == this.user_helper.ORDER_STATUS_ID.CANCELLED || this.OrderDetail.order_status_id == this.user_helper.ORDER_STATUS_ID.REJECTED){
                    this.user_helper.router.navigate(['orders']);
                } else {

                    let time = res_data.order.order_payment_detail.total_time * 60;
                    let hours = Math.floor(time / 3600)
                    let minute = Math.floor((time % 3600) / 60);

                    this.OrderDetail.total_time = hours + ' hr ' + ': ' + minute + ' min';

                }

                if (this.OrderDetail.request_status <= this.ORDER_STATE.ORDER_COMPLETED && !this.is_user_pick_up_order && this.OrderDetail.request_status >= this.ORDER_STATE.DELIVERY_MAN_STARTED_DELIVERY && this.map_loaded == false) {
                        this.ProviderDetail = res_data.order.provider_detail[0];
                        this.map_loaded = true;
                        this.old_lat_lng = this.ProviderDetail.location;
                        this.new_lat_lng = this.ProviderDetail.location;
                        this.user_helper.ngZone.run(() => {
                            this.map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 10,
                                center: {lat: this.ProviderDetail.location[0], lng: this.ProviderDetail.location[1]},
                                draggable: false,
                                zoomControl: true,
                                scrollwheel: false,
                                disableDoubleClickZoom: false,
                                fullscreenControl: true
                            });
                            this.bounds = new google.maps.LatLngBounds();
                            this.bounds.extend( new google.maps.LatLng(this.ProviderDetail.location[0], this.ProviderDetail.location[1]));
                            this.directionsDisplay.setMap(this.map);
                            var map_pin = document.getElementById('map_pin');
                            this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(map_pin);
                            this.bounds.extend( new google.maps.LatLng(this.pickup_address.location[0], this.pickup_address.location[1]));
                            var store_marker = new google.maps.Marker({
                                position: {lat: this.pickup_address.location[0], lng: this.pickup_address.location[1]},
                                map: this.map,
                                icon: 'map_pin_images/Store/store_open.png'
                            });
                            var store_contentString =
                            '<b>Name</b>: ' + this.pickup_address.user_details.name +
                            '<br><b>Email</b>: ' + this.pickup_address.user_details.email +
                            '<br><b>Phone</b>: ' + this.pickup_address.user_details.country_phone_code + this.pickup_address.user_details.phone;
                            var store_message = new google.maps.InfoWindow({
                                content: store_contentString,
                                maxWidth: 320
                            });
                            google.maps.event.addListener(store_marker, 'click', (e)=> {
                                store_message.open(this.map, store_marker);
                                setTimeout(function () {store_message.close();}, 5000);
                            });

                            this.bounds.extend( new google.maps.LatLng(this.destination_address.location[0], this.destination_address.location[1]));

                            var user_marker = new google.maps.Marker({
                                position: {lat: this.destination_address.location[0], lng: this.destination_address.location[1]},
                                map: this.map,
                                icon: 'map_pin_images/Store/store_open.png'
                            });
                            var user_contentString =
                            '<b>Address</b>: ' + this.destination_address.address;
                            var user_message = new google.maps.InfoWindow({
                                content: user_contentString,
                                maxWidth: 320
                            });
                            google.maps.event.addListener(user_marker, 'click', (e)=> {
                                user_message.open(this.map, user_marker);
                                setTimeout(function () {user_message.close();}, 5000);
                            });
                            this.map.fitBounds(this.bounds);
                        });
                    }

            } else {
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.router.navigate(['']);
            }
        });

    }

    get_deliveryman_data(){
        setTimeout(()=> {
            google.maps.event.trigger(this.map, "resize");
        },1000);
        if(this.OrderDetail.request_status >= this.ORDER_STATE.DELIVERY_MAN_STARTED_DELIVERY && this.OrderDetail.request_status < this.ORDER_STATE.ORDER_COMPLETED){
            this.selected_screen = 2;
            this.get_deliveryman_location(this.ProviderDetail._id);
        }
    }

    get_deliveryman_location(provider_id){
        clearInterval(this.interval)
        let json = {
            user_id: this.user_id,
            order_id: this.order_id,
            server_token: this.server_token,
            provider_id: provider_id
        }
        this.get_location_service(json);
        this.interval = setInterval(()=>{

            this.get_location_service(json);
        },10000)
    }

    get_location_service(json){
        var lat;
        var lng;

        this.old_lat_lng = JSON.parse(JSON.stringify(this.new_lat_lng));
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_PROVIDER_LOCATION, json, (res_data) => {

            if (res_data.success) {
                this.new_lat_lng = res_data.provider_location;
                let i = 0;
                if(this.new_lat_lng[0] == this.old_lat_lng[0] && this.new_lat_lng[1] == this.old_lat_lng[1])
                {
                    lat=0;
                    lng=0;
                    // this.moveMarker(lat, lng, i);
                }
                else
                {
                    lat = (this.new_lat_lng[0] - this.old_lat_lng[0])/ this.numDeltas;
                    lng = (this.new_lat_lng[1] - this.old_lat_lng[1])/ this.numDeltas;
                    this.moveMarker(lat, lng, i);
                }
            }
        });
    }
     moveMarker(lat, lng, i){

        if (i != this.numDeltas) {
            i++;

            this.old_lat_lng[0] += lat;
            this.old_lat_lng[1] += lng;
            var latlng = new google.maps.LatLng(this.old_lat_lng[0], this.old_lat_lng[1]);
            this.map.setCenter(latlng)

            setTimeout(()=> {
                this.moveMarker(lat,lng, i)
            }, 100);
        } else {
            this.old_lat_lng = this.new_lat_lng;
        }
    }

    go_to_full_detail(){
        this.user_helper.router_id.user.order_id = this.order_id;
        this.user_helper.router.navigate(['order_detail']);
    }

}
