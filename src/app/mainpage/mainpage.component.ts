import { Component, OnInit } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import {button, placeholder, title, slider_conList, tabList, menu_title} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import { BooleanService } from '../boolean.service';
import {Location} from '@angular/common';
import {Helper} from '../user_helper';
declare var google;
declare var jQuery;
declare var $;
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

export interface CurrentLocation{
    city1: string,
    city2: string,
    city3: string,
    country: string,
    country_code : string,
    country_code_2: string,
    city_code: string,
    latitude: any,
    longitude: any,
    address: string
}

@Component({
 	selector: 'app-mainpage',
  	templateUrl: './mainpage.component.html',
  	styleUrls: ['./mainpage.component.css'],
  	encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})

export class MainpageComponent implements OnInit {

	
closeResult: string;
  public button:any = button;
  public placeholder:any = placeholder;
  public title:any = title;
  private slider_conList:any = slider_conList;
  private tabList:any = tabList;
  private menu_title:any = menu_title;
  selected_delivery_id: string = '';
  delivery_type_image : string = '../assets/images/sac-kraft.png';
  ads: any[] = [];
  total_delivery_slider: any[] = [];

    public current_location: CurrentLocation;
    deliveries_in_city: any[] = [];

    map_address: string = '';
    map_latitude: number = 0;
    map_longitude: number = 0;
    map: any;
    city_id: Object = null;
    private cart_unique_token: string = '';
    private user_id: string = '';
    private server_token: string = '';
    public user_profile: string = '';
    public is_show_unavailable_delivery: boolean = false;
    private cart_data : any = {};

    device_type: string= '';
    app_url : string = '';
    jssor_1_slider: any;
    jssor_2_slider: any;


    public color_array : any[] = ['#EAD174', '#A1545E', '#A2D6F1', '#76C8A8', '#EAD174', '#A1545E', '#A2D6F1', '#76C8A8']
    color: string = '#EAD174';


    

  constructor(private modalService: NgbModal, public bln: BooleanService, private location: Location, public user_helper: Helper) { }

  ngOnInit() {

  	this.current_location = {
          city1: '',
          city2: '',
          city3: '',
          country: '',
          country_code: '',
          country_code_2: '',
          city_code: '',
          latitude: '',
          longitude: '',
          address: ''
      }
      if(localStorage.getItem('current_location')){
          this.user_helper.router_id.user_current_location = JSON.parse(localStorage.getItem('current_location'));
          this.current_location =  JSON.parse(localStorage.getItem('current_location'));
      }
       let user = JSON.parse(localStorage.getItem('user'));
      if(user && user._id){
          this.user_id = user._id;
          this.server_token = user.server_token;
          this.user_profile = user.image_url;
      }

      this.check_device_type();
      this.cart_data = this.user_helper.user_cart.cart_data;
      this.cart_unique_token = localStorage.getItem('cart_unique_token');

      let autocompleteElm = <HTMLInputElement>document.getElementById('address1');
      let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), {});

      autocomplete.addListener('place_changed', () => {
          this.user_helper.myLoading = true;
          var place = autocomplete.getPlace();
          this.current_location.latitude = place.geometry.location.lat();
          this.current_location.longitude = place.geometry.location.lng();
          this.current_location.city1 = '';
          this.current_location.city2 = '';
          this.current_location.city3 = '';
          for (var i = 0; i < place.address_components.length; i++) {
              // this.address = place.formatted_address;
              this.current_location.address = place.formatted_address;
              if (place.address_components[i].types[0] == "locality") {
                  this.current_location.city1 = place.address_components[i].long_name;
              } else if (place.address_components[i].types[0] == "administrative_area_level_1") {
                  this.current_location.city2 = place.address_components[i].long_name;
                  this.current_location.city_code = place.address_components[i].short_name;
              } else if (place.address_components[i].types[0] == "administrative_area_level_2") {
                  this.current_location.city3 = place.address_components[i].long_name;
              } else if (place.address_components[i].types[0] == "country") {
                  this.current_location.country = place.address_components[i].long_name;
                  this.current_location.country_code = place.address_components[i].short_name;
                  this.current_location.country_code_2 = place.address_components[i].short_name;
              }
          }
          this.delivery_list(this.current_location)
      });
      if(this.current_location.address !== '') {
          this.delivery_list(this.current_location)
      }
  
      this.bln.showLogin = true;
      this.bln.showhedmid = true;
      this.bln.showcart = true;
      this.bln.isSticky = false;
      this.bln.showLink = false;
      this.bln.isHome = false;
      this.bln.cart = true;
      this.bln.showSignup = false;
      this.bln.isAdd_product = true;
      this.bln.isShop = false;
      this.bln.isInner_page = true;
      this.bln.isGreen = true;
      this.bln.isBod_btm_h = true;
      this.bln.address = true;

      $(document).ready(function(){
        $('video').parent().click(function () {
          if($(this).children("video").get(0).paused){
              $(this).children("video").get(0).play();
              $(this).children(".playpause").fadeOut();
          }else{
             $(this).children("video").get(0).pause();
              $(this).children(".playpause").fadeIn();
          }
        });

        $('a#ngb-tab-0').click(function(){
            $(this).closest('.section2').addClass('bg1');
        });
        $('a#ngb-tab-1').click(function(){
            $(this).closest('.section2').addClass('bg2');
         });

        $('a#ngb-tab-2').click(function(){
            $(this).closest('.section2').addClass('bg3');
        });
        $('a#ngb-tab-3').click(function(){
            $(this).closest('.section2').addClass('bg4');
        });

        $('a#ngb-tab-1, a#ngb-tab-2, a#ngb-tab-3').click(function(){
            $(this).closest('.section2').removeClass('bg1');
        });
        $('a#ngb-tab-0, a#ngb-tab-2,a#ngb-tab-3').click(function(){
            $(this).closest('.section2').removeClass('bg2');
        });
        $('a#ngb-tab-0, a#ngb-tab-1,a#ngb-tab-3').click(function(){
            $(this).closest('.section2').removeClass('bg3');
        });
        $('a#ngb-tab-0, a#ngb-tab-1,a#ngb-tab-2').click(function(){
            $(this).closest('.section2').removeClass('bg4');
        });
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

    delivery_list(current_location) {
        this.user_helper.router_id.user_current_location = current_location;
        localStorage.setItem('current_location', JSON.stringify(current_location));
        current_location.cart_unique_token = this.cart_unique_token;
        current_location.user_id = this.user_id;
        current_location.server_token = this.server_token;
        current_location.delivery_type = this.user_helper.DELIVERY_TYPE.STORE;
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_DELIVERY_LIST_FOR_NEAREST_CITY, current_location, (res_data) => {
            this.user_helper.myLoading = false;
            if(res_data.success){
                this.is_show_unavailable_delivery = false;
                this.user_helper.ngZone.run(() =>{
                    this.deliveries_in_city = res_data.deliveries;
                    this.city_id = res_data.city._id;
                    this.ads = res_data.ads;

                    this.user_helper.router_id.user.delivery_currency = res_data.currency_sign;
                    this.user_helper.user_cart.timezone = res_data.city.timezone;
                    this.user_helper.user_cart.server_date = res_data.server_time;

                    if(res_data.deliveries.length>0){
                        this.selected_delivery_id = res_data.deliveries[0]._id;
                        this.delivery_type_image = this.user_helper.CONSTANT.IMAGE_BASE_URL + res_data.deliveries[0].image_url3
                    } else {
                        this.selected_delivery_id = '';
                    }
                    var total_delivery_slider = Math.ceil((this.deliveries_in_city.length)/6);
                    this.total_delivery_slider = Array(total_delivery_slider).map((x,i)=>i);
                    
                    // if(this.user_helper.user_cart.after_login !== "invoice") {
                    //     let city_name = res_data.city_data.city1.replace(/ /g, "-");
                    //     city_name = city_name.toLowerCase();
                    //     this.location.replaceState('deliveries/' + city_name);
                    // }
                });
                var height = ($('#d_services').height());
                $('html, body').animate({
                    scrollTop: height
                }, 1000);
            } else {
                this.selected_delivery_id = '';
                this.deliveries_in_city = [];
                this.is_show_unavailable_delivery = true;
                this.ads = [];
                
            } 
        
        });
    }

    redirect_to_store(is_ads_redirect_to_store, store_id){
      if(is_ads_redirect_to_store && store_id){
        this.user_helper.router.navigate(['city/delivery/store/'+store_id]);
      }
    }

    check_device_type(){
      var userAgent = navigator.userAgent || navigator.vendor;
      

      if (/android/i.test(userAgent)) {
          this.device_type = "android"
          this.app_url = "https://play.google.com/store/apps/details?id=com.vaiter.user&hl=en";
          jQuery('#content').click();
          jQuery('.modal-content').css('background-color', 'white');
          setTimeout(()=>{
            jQuery('.modal-content').css('padding', '70px 0px');
            jQuery('.modal-dialog').css('margin-top', '5px');
          })
      }

      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod/.test(userAgent)) {
          this.device_type = "ios";
          this.app_url = "https://itunes.apple.com/us/app/id1477016153?ls=1&mt=8"
          jQuery('#content').click();
          jQuery('.modal-content').css('background-color', 'white');
          setTimeout(()=>{
            jQuery('.modal-content').css('padding', '70px 0px');
            jQuery('.modal-dialog').css('margin-top', '5px');
          })
      }
      
    }
  
  open(content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop : 'static', keyboard : false}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
  }

    get_store_list(selected_delivery_id){
            let delivery_index = this.deliveries_in_city.findIndex((x)=>x._id == selected_delivery_id);
            let delivery = this.deliveries_in_city[delivery_index];
            this.user_helper.router_id.user.delivery_type_id = delivery._id;
            this.user_helper.router_id.user_current_delivery_type = delivery;
            this.user_helper.router_id.user.city_id = this.city_id;
            this.user_helper.router_id.delivery_tag = delivery.famous_products_tags;
            this.user_helper.router_id.deliveries_in_city = this.deliveries_in_city;
            this.user_helper.router.navigate(['stores']);
    }

    onLinkClick(index){
      this.color = this.color_array[index];
    }

    onTabChange($event: NgbTabChangeEvent) {
      this.color = this.color_array[Number($event.activeId)];
    }

    clickon_category(selected_delivery_id){
      this.selected_delivery_id = selected_delivery_id;
      //this.delivery_type_image = this.user_helper.CONSTANT.IMAGE_BASE_URL + delivery_type_image;
    }

    select_delivery(selected_delivery_id){
      
    }

}
