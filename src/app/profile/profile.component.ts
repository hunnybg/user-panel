import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links, placeholder, label, button, description, price, menu_title, orderTable} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
declare var jquery:any;
declare var $ :any;

export interface userProfile{
    user_id: string,
    server_token: string,
    email: string,
    old_password: string,
    new_password: string,
    first_name: string,
    last_name: string,
    address: string,
    phone: number,
    country_phone_code: string,
    login_by: string,
    social_id: any[],
    confirm_password: String,
    image_url: string
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})
export class ProfileComponent implements OnInit {

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
    public edit: Boolean = false;
    public user_profile: userProfile;

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

        this.user_profile = {
            user_id: null,
            server_token: '',
            email: '',
            old_password: '',
            new_password: '',
            first_name: '',
            last_name: '',
            address: '',
            phone: null,
            login_by: '',
            social_id: [],
            confirm_password: '',
            image_url: '',
            country_phone_code: ''
        }


        $(document).ready(function(){
            $(".edit").click(function(){
                $(this).parent().siblings().addClass("edit_data");
                $(".save, .change").show();
                $(this).hide();
            })
            $(".save").click(function(){
                $(this).parent().siblings().removeClass("edit_data");
                $(".edit, .change").show();
                $(this).hide();
            })
        })

        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            // if(this.helper.user_cart.cart_data.cart.length > 0){
            this.user_id = user._id;
            this.server_token = user.server_token;
            this.user_profile = {
                user_id: user._id,
                server_token: user.server_token,
                email: user.email,
                old_password: '',
                new_password: '',
                first_name: user.first_name,
                last_name: user.last_name,
                address: user.address,
                phone: user.phone,
                login_by: user.login_by,
                confirm_password: '',
                social_id: user.social_ids,
                image_url: user.image_url,
                country_phone_code: user.country_phone_code
            }
            // } else {
            //     this.helper.router.navigate(['deliveries']);
            // }
        } else {
            this.user_helper.router.navigate(['']);
        }


    }
    public formData = new FormData();
    user_update(user_data)
    {
        this.user_helper.user_cart.myLoading=true;
        this.formData.append('user_id',this.user_profile.user_id);
        this.formData.append('server_token',this.user_profile.server_token);
        this.formData.append('phone',user_data.phone);
        this.formData.append('email',user_data.email.trim());
        this.formData.append('new_password',this.user_profile.new_password);
        this.formData.append('first_name',user_data.first_name.trim());
        this.formData.append('last_name',user_data.last_name.trim());
        this.formData.append('social_id', '');
        this.formData.append('login_by',this.user_profile.login_by);
        this.formData.append('old_password',this.user_profile.old_password);

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.UPDATE, this.formData, (res_data) => {
                
                this.user_helper.user_cart.myLoading=false;
                this.user_profile.new_password="";
                this.user_profile.old_password = '';
                if(res_data.success == false)
                {
                    this.user_helper.data.storage = {
                        "code": res_data.error_code,
                        "message": this.user_helper.ERROR_CODE[res_data.error_code],
                        "class": "alert-danger"
                    }
                    this.user_helper.message()
                    this.formData = new FormData();
                    let user = JSON.parse(localStorage.getItem('user'));
                    this.user_profile.first_name=user.first_name;
                    this.user_profile.last_name=user.last_name;
                    this.user_profile.address= user.address;
                    this.user_profile.phone= user.phone;
                    this.user_profile.email= user.email;
                }
                else
                {
                    this.edit = false;
                    this.formData = new FormData();
                    localStorage.setItem('user', JSON.stringify(res_data.user));
                    this.user_helper.data.storage = {
                        "message": this.user_helper.MESSAGE_CODE[res_data.message],
                        "class": "alert-info"
                    }
                    this.user_helper.message()
                    this.user_helper.user_name = res_data.user.first_name + ' ' + res_data.user.last_name;
                }
            });
    }


}
