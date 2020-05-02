import { Component, OnInit } from '@angular/core';
import {button, menu_title, label, title, placeholder} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalBasic } from './modal-basic';
import { BasketComponent } from '../basket/basket.component';
import { Router } from '@angular/router';
import { BooleanService } from '../boolean.service';
import {Helper} from '../user_helper';
import { UUID } from 'angular2-uuid';
declare var $:any;
declare var google;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})
export class HeaderComponent implements OnInit {
    
  public button:any = button;
  public menu_title:any = menu_title;
  public label:any = label;
  public title:any = title;
  public placeholder:any = placeholder;

    schedule_date: any = '';
    schedule_time: string = '';
    schedule_time_error: Boolean = false;

    declined:Boolean = false;
    private cart_unique_token: string = '';
    //private user_id: string = '';
    //private server_token: string = '';
    interval:any;
    error_code : any;
    heading_title:any;
    
    private delivery_location : any[];
    private delivery_address : string = '';
    selected_language: string = '';

    is_schedule_order: Boolean = false;
    server_date: any = null;
    date_array: any[] = [];
    time_array: any[] = [];
    clicked_date: any = null;

  constructor( public bln: BooleanService, public user_helper: Helper, ) {
      user_helper.trans.addLangs(['fr', 'en']);

      var language = localStorage.getItem('language');
      if (language == '' || language == undefined || language == null) {
          language = 'en'
      }
      user_helper.trans.setDefaultLang('en');
      user_helper.trans.use(language);

      const browserLang = user_helper.trans.getBrowserLang();
  }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    ngOnInit() {
        let user = JSON.parse(localStorage.getItem('user'));
        if(user){
            this.user_helper.user_name = user.first_name + ' ' + user.last_name;
        }

        this.is_schedule_order = this.user_helper.user_cart.is_schedule_order;
  this.bln.showLogin = true;
  this.bln.showhedmid = true;
  this.bln.showcart = true;
  this.bln.isSticky = true;
  this.bln.showLink = false;
  this.bln.isHome = true;
  this.bln.cart = true;
  this.bln.showSignup = true;
  this.bln.isAdd_product = true;
  this.bln.isShop = true;
  this.bln.isInner_page = true;
  this.bln.isGreen = true;
  this.bln.isBod_btm_h = true;

    let cart_unique_token = localStorage.getItem('cart_unique_token');
    if(cart_unique_token == "" || cart_unique_token == null || cart_unique_token == undefined){
        let uuid = UUID.UUID();
        localStorage.setItem('cart_unique_token', uuid);
    }

    this.user_helper.check_detail();

    

        var language = localStorage.getItem('language');
        this.selected_language = language;
  /* sticky */
      let self = this;
  $(window).scroll(function() {

   if ($(this).scrollTop() > 100){  
        if($("header").hasClass("sticky")){

        } else {
            $("header").hide();
            $("header").slideDown('slow').addClass("sticky");
            // $(".banner").hide();
            // $(".section1").addClass("scroll_w");
        }
        
        // if((self.user_helper.router.url=='/partner' || self.user_helper.router.url=='/hopper')){
        //     self.bln.cart = true;
        // }
      
    }
    else{
        // if((self.user_helper.router.url!=='' && self.user_helper.router.url!=='/home')){
        //     $(".home header").removeClass("sticky");
        // }
        // if((self.user_helper.router.url=='/partner' || self.user_helper.router.url=='/hopper')){
        //     self.bln.cart = false;
        // }
      // $(".banner").show();
      // $(".section1").removeClass("scroll_w");
    }
  });

  /* dropdown */
    $(document).ready(function() {


        // $('.head_mid .asap').click(function(){
        //     $(this).siblings('.dropdown_div').hide();
        // });

        $('.addr').click(function(){
          $('.address_box').toggle();
        });

        $('.schedule').click( function(e){
            e.preventDefault();
            $('.drop_form').show().parent().addClass('open2');
        });

        $('.asap a').click(function(e){
          e.preventDefault() ;
          $('.drop_form').hide().parent().removeClass('open2');
        });

        $('.ent_add input').click(function(){
          $('.hide_con').hide();
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

        $('#menu li').click(function(e){
            $('.show-menu').click();
        })
    });

        this.delivery_location = [this.user_helper.router_id.user_current_location.latitude, this.user_helper.router_id.user_current_location.longitude];
        this.delivery_address = this.user_helper.router_id.user_current_location.address;
        let autocompleteElm = <HTMLInputElement>document.getElementById('address');
        let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), {});

        autocomplete.addListener('place_changed', () => {
            // this.user_helper.myLoading = true;
            var place = autocomplete.getPlace();
            this.user_helper.router_id.user_current_location.latitude = place.geometry.location.lat();
            this.user_helper.router_id.user_current_location.longitude = place.geometry.location.lng();
            this.user_helper.router_id.user_current_location.address = place.formatted_address;
            localStorage.setItem('current_location', JSON.stringify(this.user_helper.router_id.user_current_location));
            // this.update_address();
            this.user_helper.router.navigate(['/home']);
        });

  }

    change_language(language){
        this.user_helper.trans.use(language);
        localStorage.setItem('language', language);
        this.selected_language = language;
    }

    update_address() {

        let json = {
            city_id: this.user_helper.router_id.user.city_id,
            latitude: this.user_helper.router_id.user_current_location.latitude,
            longitude: this.user_helper.router_id.user_current_location.longitude
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.CHECK_CITY_RADIUS, json, (res_data) => {
            if(!res_data.success){
                this.user_helper.router_id.user_current_location.address = this.delivery_address;
                this.user_helper.router_id.user_current_location.latitude = this.delivery_location[0];
                this.user_helper.router_id.user_current_location.longitude = this.delivery_location[1];
            } else {
                this.delivery_location = [this.user_helper.router_id.user_current_location.latitude, this.user_helper.router_id.user_current_location.longitude];
                this.delivery_address = this.user_helper.router_id.user_current_location.address;
                let user:any = JSON.parse(localStorage.getItem('current_location'));
                user.address = this.user_helper.router_id.user_current_location.address;
                user.latitude = this.user_helper.router_id.user_current_location.latitude;
                user.longitude = this.user_helper.router_id.user_current_location.longitude;
                localStorage.setItem('current_location', JSON.stringify(user));
            }
        });
    }

    set_current_location(){
        navigator.geolocation.getCurrentPosition((position) => {
            this.geocoder(position.coords.latitude, position.coords.longitude)
        });
    }

    geocoder(latitude, longitude){
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        var geocoder = new google.maps.Geocoder();

        let request = {latLng: initialLocation};
        geocoder.geocode(request, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                this.user_helper.ngZone.run(() => {
                    this.user_helper.myLoading = true;
                    this.user_helper.router_id.user_current_location.latitude = latitude;
                    this.user_helper.router_id.user_current_location.longitude = longitude;
                    this.user_helper.router_id.user_current_location.address = results[0].formatted_address;
                    this.update_address();
                });
            }
        });
    }


    pad2(number) {
   
     return (number < 10 ? '0' : '') + number
   
    }
    asap(){
        $('.soon_btn').siblings('.dropdown_div').toggle();
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
                    $('.soon_btn').siblings('.dropdown_div').toggle();
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
            $('.soon_btn').siblings('.dropdown_div').toggle();
        }
    }
}
