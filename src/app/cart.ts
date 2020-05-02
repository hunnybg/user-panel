import {Injectable} from '@angular/core';


@Injectable()
export class Cart {
    user: any = JSON.parse(localStorage.getItem('user'));

    minimum_phone_number_length: number = 8;
    maximum_phone_number_length: number = 12;
    delivery_note: string = '';
    delivery_user_name: string = '';
    delivery_user_phone: string = '';
    is_user_pick_up_order: Boolean = false;

    cart_main_item: any[] = [];

    user_profile_image_url: string = '';

    myLoading: Boolean = false;
    server_date: any = null;
    timezone: string = '';

    public user_id: string = '';
    private user_type: number;
    public server_token: string = '';

    is_schedule_order: Boolean = false;
    schedule_date: any = null;
    clicked_date: string = '';

    after_login: string = "deliveries";
    public cart_data : any;

    public destination_address: any;
    public pickup_address: any;
    public total_cart_amount: number = 0;
    total_item_tax: number = 0;
    public store_location : any [];
    public order_payment_id: Object = null;
    public constructor() {

        if(this.user && this.user._id){
            this.user_profile_image_url = this.user.image_url;
        }

        this.cart_data = {
            cart_id: null,
            city_id: null,
            destination_addresses: [],
            pickup_addresses: [],
            cart: [],
            selectedStoreId: null,
            max_item_quantity_add_by_user: 0,
            total_item: 0
        }

        this.destination_address = {
            "delivery_status":0,
            "address_type":"destination",
            "address":"",
            "city":"",
            "location":[],
            "note":"",
            "user_type":0,
            "user_details":{
                "name":"",
                "country_phone_code":"",
                "phone":"",
                "email":""
            }
        }

        this.pickup_address = {
            "delivery_status":0,
            "address_type":"pickup",
            "address":"",
            "city":"",
            "location":[],
            "note":"",
            "user_type":0,
            "user_details":{
                "name":"",
                "country_phone_code":"",
                "phone":"",
                "email":""
            }
        }
    }

}
