import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {button, language, menu_title, label, title, placeholder, description, ordList, price} from '../helper';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ViewEncapsulation} from '@angular/core';
import {Params} from '@angular/router';
import {Location} from '@angular/common';
import {Helper} from "../user_helper";
declare var google;
declare var jQuery;

export interface CartProductItems{
    item_id: Object,
    unique_id: Number,
    item_name: string,
    quantity: Number,
    image_url: any,
    details: string,
    specifications: any[],
    item_price: Number,
    total_specification_price: Number,
    total_item_and_specification_price: Number,
    note_for_item: string
}

export interface cartProducts{
    items: any[],
    product_id: Object,
    product_name: string,
    unique_id: number,
    total_item_price: number
}

declare var $:any;

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  encapsulation: ViewEncapsulation.None,
    providers: [Helper]
 
})
export class ShopComponent implements OnInit {
  
  closeResult: string;
  public button:any = button;
  public language:any = language;
  public menu_title:any = menu_title;
  public label:any = label;
  public title:any = title;
  public placeholder:any = placeholder;
    public description:any = description;
    private ordList:any = ordList;
    public price:any = price;

    private city_name: string = '';
    private current_store : any;
    private current_location : any;
    private store_id : string;
    private filtered_product_item_list: any[] = [];
    private product_item_list: any[] = [];
    current_item: any = {image_url:[]};
    current_main_item: any = {};
    required_count: number = 0;
    private total: number = 0;
    required_temp_count: number = 0;
    delivery_currency : string = '';
    qty: number = 1;
    private cart_unique_token: string = '';
    private user_id: string = '';
    private server_token: string = '';
    public user_profile: string = '';
    note_for_item: string = '';
    product_name: string = '';
    product_unique_id: number = 0;
    private cart_data : any = {};
    selected_product_id: Object = null;

    filter_item_name: string = '';

    start_screex: number = 0;
    end_screex: number = 0;

    private cartProductItems : CartProductItems;
    private cartProducts : cartProducts;
    public device_type : string = "web";

    selected_item_index: number = 0;
    selected_product_index: number = 0;
    private favourite_stores: any[] = [];

  public counter:number = 0;
  increment(){
      this.counter += 1;
    }
    
    decrement(){
      if(this.counter > 0){
      this.counter -= 1;
      }
    }

  constructor( public bln: BooleanService, private location: Location, private modalService: NgbModal , public user_helper: Helper) { }

  ngOnInit() {

    this.bln.showLogin = false;
    this.bln.showhedmid = true;
    this.bln.showcart = false;
    this.bln.isSticky = false;
    this.bln.showLink = false;
    this.bln.cart = true;
    this.bln.isHome = true;
    this.bln.showSignup = true;
    this.bln.isAdd_product = false;
    this.bln.isShop = false;
    this.bln.isInner_page = true;
    this.bln.isGreen = true;
    this.bln.isBod_btm_h = true;
      this.bln.address = true;

    /* slide */
    $(".box ul li a").click(function(e){
      e.preventDefault();
      var hrefVal = $(this).attr("href");
      var sectionOffset = $(hrefVal).offset().top - 120;
      $('html, body').animate({
        scrollTop: sectionOffset
      }, 500);
    });

       // var print = function(msg) {
       //   alert(msg);
       // };

       // var setInvisible = function(elem) {
       //   elem.css('display', 'none');
       // };
       // var setVisible = function(elem) {
       //   elem.css('display', 'block');
       // };

       // var elem = $("#fix_bar");
       // var items = elem.children();

       // // Inserting Buttons
       // elem.prepend('<div id="right-button" style="display: none;"><a><img src="../assets/images/arrow.svg" /></a></div>');
       // elem.append('  <div id="left-button"><a><img src="../assets/images/arrow-right.svg" style="height: 20px;" /></a></div>');

       // // Inserting Inner
       // items.wrapAll('<div id="inner" />');

       // // Inserting Outer
       // elem.find('#inner').wrap('<div id="outer"/>');

       // var outer = $('#outer');

       // var updateUI = function() {
       //   var maxWidth = outer.outerWidth(true);
       //   var actualWidth = 0;
       //   $.each($('#inner >'), function(i, item) {
       //     actualWidth += $(item).outerWidth(true);
       //   });

       //   if (actualWidth <= maxWidth) {
       //     setVisible($('#left-button'));
       //   }
       // };
       // updateUI();



       // $('#right-button').click(function() {
       //   var leftPos = outer.scrollLeft();
       //   outer.animate({
       //     scrollLeft: leftPos - 200
       //   }, 800, function() {
       //     if ($('#outer').scrollLeft() <= 0) {
       //       setInvisible($('#right-button'));
       //     }
       //   });
       // });

       // $('#left-button').click(function() {
       //   setVisible($('#right-button'));
       //   var leftPos = outer.scrollLeft();
       //   outer.animate({
       //     scrollLeft: leftPos + 200
       //   }, 800,  function() {
           
       //   });
       // });

       // $(window).resize(function() {
       //   updateUI();
       // });
     


    $(window).scroll(function() {
      if ($(this).scrollTop() > 555){  
        $('#fix_bar').addClass('fix_bar')
              $('#fix_bar').css('margin-top', 'unset');
      } else {
        $('#fix_bar').removeClass('fix_bar')
        var height = jQuery('.banner_text').height();
         $('#fix_bar').css('margin-top', ((height/2) + 10) + 'px');
      }

      var height = $('.shop').height() + $('.shop_banner').height() + $('#fix_bar').height();
      // height = height.slice(0, -2);
      // height = Number(height);

      if ($(this).scrollTop() > height - 50){  

        if(($(window).scrollTop() + $(window).height()) >= ($(document).height() - $('footer').height())) {
         $('.fix_bar1').css('width', '33.33%')
          $('.fix_bar1').css('left', 'unset')
          $('#fix_bar1').removeClass('fix_bar1')
        } else {
          $('#fix_bar1').addClass('fix_bar1')

          var width = $('.box').width();
          var full_width = $(window).width();

          var margin = $('.tab3 .row').css('marginLeft');
          margin = parseInt(margin)
          margin = Math.abs(margin * 2);

          var left = (((full_width - (width + margin))/2));

          if($(window).width() > 1499){
            $('.fix_bar1').css('width', ((width + margin)/3))
            $('.fix_bar1').css('left', (((width + margin) * 2)/3) + left)
          } else {
            $('.fix_bar1').css('width', (width + margin)/2)
            $('.fix_bar1').css('left', ((width + margin)/2) + left)
          }
          if($('#fix_bar1').height()>($(window).height()-150)){
            $('.fix_bar1').css('bottom', '30px')
            $('.fix_bar1').css('top', 'unset')
          } else {
            $('.fix_bar1').css('top', '60px')
            $('.fix_bar1').css('bottom', 'unset')
          }
        }

      } else {
        $('.fix_bar1').css('width', '33.33%')
        $('.fix_bar1').css('left', 'unset')
        $('#fix_bar1').removeClass('fix_bar1')
      }
    });

      this.current_store = {
          price_rating : 0,
          famous_for: []
      };

      this.user_helper.route.params.subscribe((x: Params) => {

          this.store_id = x['store_id'];
          this.city_name = x['city_name'];
          this.current_location = this.user_helper.router_id.user_current_location;
          this.delivery_currency = this.user_helper.router_id.user.delivery_currency;
          this.cart_unique_token = localStorage.getItem('cart_unique_token');

          let user = JSON.parse(localStorage.getItem('user'));
          if (user && user._id) {
              this.user_id = user._id;
              this.server_token = user.server_token;
              this.user_profile = user.image_url;
              this.favourite_stores = user.favourite_stores;
          }

          this.cart_data = this.user_helper.user_cart.cart_data;
          if (this.store_id.length !== 24) {
              this.user_helper.router.navigate(['deliveries']);
          } else {
              this.get_item_list()
          }

          this.cartProductItems = {
              item_id: null,
              unique_id: 0,
              item_name: '',
              quantity: 0,
              image_url: [],
              details: '',
              specifications: [],
              item_price: 0,
              total_specification_price: 0,
              total_item_and_specification_price: 0,
              note_for_item: ''
          }
          this.cartProducts = {
              items: [],
              product_id: null,
              product_name: '',
              unique_id: 0,
              total_item_price: 0
          }

      });

  }

    open_item_modal(item, item_index , product_index, event, content){
        this.note_for_item = '';
        if(event.target.attributes.class != undefined) {
            if(event.target.attributes.class.value !== "carousel-indicators_li" && event.target.attributes.class.value !== "carousel-indicators_li active"){
                this.qty = 1;
                this.required_count = 0;
                this.current_item = JSON.parse(JSON.stringify(item));
                this.current_main_item = item;
                this.product_unique_id = this.filtered_product_item_list[product_index]._id.unique_id;
                this.product_name = this.filtered_product_item_list[product_index]._id.name;
                this.calculate_is_required();
                this.calculateTotalAmount();
                this.open(content);
            }
        } else {
            this.qty = 1;
            this.required_count = 0;
            this.current_item = JSON.parse(JSON.stringify(item));
            this.current_main_item = item;
            this.product_unique_id = this.filtered_product_item_list[product_index]._id.unique_id;
            this.product_name = this.filtered_product_item_list[product_index]._id.name;
            this.calculate_is_required();
            this.calculateTotalAmount();
            this.open(content);

        }
    }

    redirect(id){
      // id.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelector('#tab' + id).scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" });
    }

    add_favourite_store() {
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.ADD_FAVOURITE_STORE, {user_id: this.user_id, store_id: this.current_store._id}, (res_data) => {
            this.current_store.favourite = true;
            this.favourite_stores = res_data.favourite_stores;
            let user = JSON.parse(localStorage.getItem('user'));
            user.favourite_stores = res_data.favourite_stores;
            localStorage.setItem('user', JSON.stringify(user));

        });
    }

    remove_favourite_store(){
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.REMOVE_FAVOURITE_STORE, {user_id: this.user_id, store_id: [this.current_store._id]}, (res_data) => {
            this.current_store.favourite = false;
            this.favourite_stores = res_data.favourite_stores;
            let user = JSON.parse(localStorage.getItem('user'));
            user.favourite_stores = res_data.favourite_stores;
            localStorage.setItem('user', JSON.stringify(user));
        });
    }

  get_item_list(){
        let json = {
            store_id: this.store_id,
            user_id: this.user_id,
            server_token: this.server_token,
            cart_unique_token: this.cart_unique_token
        }
      this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.USER_GET_STORE_PRODUCT_ITEM_LIST, json, (res_data) => {

          this.user_helper.myLoading = false;
          if(res_data.success){
              let specification_price;
              let product_array = res_data.products.filter((product_data) => {
                  let item_array = product_data.items.filter((item_data) => {
                      specification_price = 0;
                      item_data.specifications.filter((specification_group) => {
                          specification_group.list.filter((specification) => {
                              if(specification.is_default_selected){
                                  specification_price = specification_price + specification.price;
                              }
                          })
                      })

                      let total_item_price = item_data.price + specification_price;
                      item_data.total_item_price = total_item_price;
                      return item_data;
                  });
                  product_data.items = item_array;
                  return product_data;
              });
              this.product_item_list = product_array;
              this.selected_product_id = product_array[0]._id._id;
              this.filtered_product_item_list = product_array;
              this.filter_item("");
              this.delivery_currency = res_data.currency;
              this.user_helper.router_id.user.delivery_currency = res_data.currency;
              this.current_store = res_data.store;
              let index = this.favourite_stores.indexOf(this.current_store._id);
              if(index !== -1){
                this.current_store.favourite = true;
              }
              // this.helper.user_cart.store_location = res_data.store.location;

              let store_name = res_data.store.name.replace(/ /g, "-");
              store_name = store_name.toLowerCase();
              let delivery_name = res_data.delivery_name.replace(/ /g, "-");
              delivery_name = delivery_name.toLowerCase();
              let city_name = res_data.city_name.replace(/ /g, "-");
              city_name = city_name.toLowerCase();
              this.location.replaceState(city_name + '/' + delivery_name + '/' + store_name + '/' + res_data.store._id);

              var height = jQuery('.banner_text').height();
              $('#fix_bar').css('margin-top', ((height/2) + 10) + 'px');
          } else {
              this.user_helper.data.storage = {
                  "code": res_data.error_code,
                  "message": this.user_helper.ERROR_CODE[res_data.error_code],
                  "class": "alert-danger"
              }
              // this.user_helper.router.navigate(['']);
          }
      });
    }

    close_item_modal(){
        this.current_item = {image_url:[]};
        // this.item_modal.close();
    }


    calculate_is_required(){
        this.current_item.specifications.forEach((specification_group) => {
            if(specification_group.is_required){
                this.required_count++;
            }
        })
    }

    calculateTotalAmount(){
        this.total = this.current_item.price;
        this.required_temp_count = 0;
        this.current_item.specifications.forEach((specification_group , specification_group_index) => {
            let isAllowed = false;
            var default_selected_count = 0
            specification_group.list.forEach((specification , specification_index) => {

                if(specification.is_default_selected){
                    this.total = this.total + specification.price;
                    default_selected_count++;
                }
                specification_group.default_selected_count = default_selected_count;
            });

            if(specification_group.type ==1 && specification_group.is_required) {
                if(specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            } else if(specification_group.type == 2 && specification_group.is_required) {
                if (specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            }

        });

        this.total = this.total * this.qty;
    }

    changeradio(event, specification_group_index, specification_index){

        var index = this.current_item.specifications[specification_group_index].list.findIndex(x => x.is_default_selected == true)
        if(index !== -1){
            this.current_item.specifications[specification_group_index].list[index].is_default_selected = false;
        }
        this.current_item.specifications[specification_group_index].list[specification_index].is_default_selected = true;
        this.calculateTotalAmount();
    }

    changecheckbox(event, specification_group_index, specification_index){

        this.current_item.specifications[specification_group_index].list[specification_index].is_default_selected = event.target.checked;
        this.calculateTotalAmount();

    }

    range(number){
        let a = [];
        for(let i = 0; i < number; ++i)
        {
            a.push(i+1)
        }
        return a;
    }

    filter_item(data)
    {
        data = data.replace(/^\s+|\s+$/g, '');
        data = data.replace(/ +(?= )/g, '');
        data = new RegExp(data,"gi");

        var product_array = [];
        this.product_item_list.forEach((product) => {

            var item_array = product.items.filter((item_data) => {
                var a = item_data.name.match(data);
                return a !== null;
            })
            if(item_array.length > 0)
            {
                product_array.push({_id:product._id , name:product.name , store_id:product.store_id , unique_id:product.unique_id,
                    is_visible_in_store: product.is_visible_in_store , items:item_array})
            }
        });
        this.filtered_product_item_list = product_array;

        // setTimeout(function () {
        //     jQuery('.iradio').iCheck({
        //         handle: 'radio',
        //         radioClass: 'iradio_square-green'
        //     });
        //
        //     jQuery('.iradio').on('ifChecked', (event) => {
        //
        //         let scroll = (jQuery("#product"+event.target.id).offset().top  - jQuery(".first_div").offset().top + 70);
        //         jQuery("body").animate({
        //             scrollTop: scroll
        //         },1000);
        //
        //     });
        // }, 1000);
    }

    incerase_qty(){
        // if(this.qty < this.current_store.max_item_quantity_add_by_user){
        this.qty++;
        this.calculateTotalAmount();
        // }

    }

    // dragstart_image(event){
    //     this.start_screex = event.screenX
    // }
    // dragend_image(event, length){
    //     this.end_screex = event.screenX;
    //     var a = jQuery('.a.active').attr('data-slide-to');
    //     a = Number(a);
    //     if(this.start_screex < this.end_screex && a > 0){
    //         a = a-1;
    //         jQuery('.a#aa'+a).click()
    //     } else if(this.start_screex > this.end_screex && a < length){
    //         a = a+1;
    //         jQuery('.a#aa'+a).click()
    //     }
    // }

    decrease_qty(){
        if(this.qty>1){
            this.qty--;
            this.calculateTotalAmount();
        }
    }

    clear_old_cart(){
        this.user_helper.myLoading = true;
        let json = {
            user_id: this.user_id,
            server_token: this.server_token,
            cart_unique_token: this.cart_unique_token,
            cart_id: this.user_helper.user_cart.cart_data.cart_id
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.CLEAR_CART, json, (res_data) => {

            if(res_data.success){
                this.user_helper.user_cart.cart_data.cart = [];
                this.user_helper.user_cart.cart_data.selectedStoreId = null;
                this.user_helper.user_cart.cart_data.max_item_quantity_add_by_user = 0;
                this.user_helper.user_cart.cart_data.total_item = 0;
                this.user_helper.user_cart.total_cart_amount = 0;
                // this.clear_cart_modal.close();
                this.addToCart();
            } else {
                this.user_helper.data.storage = {
                    "code": res_data.error_code,
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
            }
        });
    }

    handleClickOnAddToCart(){

        // if(this.current_store.close){
        //     console.log("Store Closed")
        // } else {
        //     if(this.current_location.address == ''){
        //         console.log("your current location is empty")
        //     } else {

        if(this.user_helper.user_cart.cart_data.cart.length == 0){
            if(this.current_location.latitude == 0 || this.current_location.longitude == 0){
                navigator.geolocation.getCurrentPosition((position) => {

                    // this.helper.user_cart.cart_data.deliveryLatLng = [position.coords.latitude, position.coords.longitude];
                    this.user_helper.user_cart.destination_address.location = [position.coords.latitude, position.coords.longitude];

                    var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var geocoder = new google.maps.Geocoder();

                    let request = {latLng: initialLocation};
                    geocoder.geocode(request, (results, status) => {
                        if (status == google.maps.GeocoderStatus.OK) {
                            this.user_helper.ngZone.run(() => {
                                // this.helper.user_cart.cart_data.deliveryAddress = results[0].formatted_address;
                                this.user_helper.user_cart.destination_address.address = results[0].formatted_address;
                                this.user_helper.user_cart.destination_address.city = this.current_location.city1;
                                this.addToCart()
                            });
                        } else {
                            this.addToCart();
                        }
                    });
                },(error) => {
                    // this.helper.user_cart.cart_data.deliveryLatLng = this.current_store.location;
                    this.user_helper.user_cart.destination_address.location = this.current_store.location;

                    // this.helper.user_cart.cart_data.deliveryAddress = this.current_location.address;
                    this.user_helper.user_cart.destination_address.address = this.current_location.address;
                    this.user_helper.user_cart.destination_address.city = this.current_location.city1
                    this.addToCart()
                });
            } else {
                // this.helper.user_cart.cart_data.deliveryLatLng = [this.current_location.latitude, this.current_location.longitude];
                // this.helper.user_cart.cart_data.deliveryAddress = this.current_location.address;
                this.user_helper.user_cart.destination_address.location = [this.current_location.latitude, this.current_location.longitude];
                this.user_helper.user_cart.destination_address.address = this.current_location.address;
                this.user_helper.user_cart.destination_address.city = this.current_location.city1

                this.addToCart()
            }

        } else {
            if(this.user_helper.user_cart.cart_data.selectedStoreId == this.store_id){
                this.addToCart()
            } else {
                // this.item_modal.close();
                // this.clear_cart_modal.open();
                $('#close_item_model').click();
                $('#clear_cart_modal').click();
            }
        }
    }

    addToCart(){

        this.user_helper.myLoading = true;
        let specificationPriceTotal = 0;
        let specificationPrice = 0;
        let specificationList = [];

        this.current_item.specifications.forEach((specification_group , specification_group_index) => {

            let specificationItemCartList = [];
            specification_group.list.forEach((specification , specification_index) => {

                if(specification.is_default_selected){

                    specificationPrice = specificationPrice + specification.price;
                    specificationPriceTotal = specificationPriceTotal + specification.price;
                    specificationItemCartList.push(specification)
                }
            });

            if(specificationItemCartList.length > 0){
                let specificationsItem_json ={
                    list: specificationItemCartList,
                    unique_id: specification_group.unique_id,
                    name: specification_group.name,
                    price: specificationPrice,
                    type: specification_group.type,
                    range: specification_group.range,
                    max_range: specification_group.max_range
                }
                specificationList.push(specificationsItem_json);
            }
            specificationPrice = 0;

        });

        this.cartProductItems.item_id = this.current_item._id;
        this.cartProductItems.unique_id = this.current_item.unique_id;
        this.cartProductItems.item_name = this.current_item.name;
        this.cartProductItems.quantity = this.qty;
        this.cartProductItems.image_url = this.current_item.image_url;
        this.cartProductItems.details = this.current_item.details;
        this.cartProductItems.specifications = specificationList;
        this.cartProductItems.item_price = this.current_item.price;
        this.cartProductItems.total_specification_price = specificationPriceTotal;
        this.cartProductItems.total_item_and_specification_price = this.total;
        this.cartProductItems.note_for_item = this.note_for_item;

        this.user_helper.user_cart.cart_main_item.push(this.current_main_item);

        this.user_helper.user_cart.total_cart_amount = this.user_helper.user_cart.total_cart_amount + this.total;

        if(this.isProductExistInLocalCart(this.cartProductItems))
        {

        } else {
            let cartProductItemsList = [];
            cartProductItemsList.push(this.cartProductItems)
            this.cartProducts.items = cartProductItemsList;
            this.cartProducts.product_id = this.current_item.product_id;
            this.cartProducts.product_name = this.product_name
            this.cartProducts.unique_id = this.product_unique_id
            this.cartProducts.total_item_price = this.total;

            this.user_helper.user_cart.cart_data.cart.push(this.cartProducts);
            this.user_helper.user_cart.cart_data.selectedStoreId = this.store_id;
            this.user_helper.user_cart.cart_data.max_item_quantity_add_by_user = this.current_store.max_item_quantity_add_by_user;
            this.user_helper.user_cart.store_location = this.current_store.location;
            if(this.user_helper.user_cart.cart_data.pickup_addresses.length == 0){
                this.user_helper.user_cart.pickup_address.location = this.current_store.location;
                this.user_helper.user_cart.pickup_address.address = this.current_store.address;
                this.user_helper.user_cart.pickup_address.user_type = this.current_store.user_type;
                this.user_helper.user_cart.pickup_address.user_details = {
                    "name": this.current_store.name,
                    "country_phone_code": this.current_store.country_phone_code,
                    "phone": this.current_store.phone,
                    "email": this.current_store.email
                }
                this.user_helper.user_cart.cart_data.pickup_addresses.push(this.user_helper.user_cart.pickup_address);
            }
            this.user_helper.user_cart.cart_data.total_item++;



            this.addItemInServerCart(this.user_helper.user_cart.cart_data.cart);

        }
    }

    isProductExistInLocalCart(cartProductItems){

        let bool = false;
        this.user_helper.user_cart.cart_data.cart.forEach((cart_item) =>{
            if(cart_item.product_id == this.current_item.product_id && bool == false){
                cart_item.items.push(cartProductItems);
                cart_item.total_item_price = cart_item.total_item_price + this.total;
                this.addItemInServerCart(this.user_helper.user_cart.cart_data.cart);
                this.user_helper.user_cart.cart_data.total_item++;
                bool = true;
            }
        });
        return bool;
    }

    addItemInServerCart(cartData){

        this.cartProductItems = {
            item_id: null,
            unique_id: 0,
            item_name: '',
            quantity: 0,
            image_url: [],
            details: '',
            specifications: [],
            item_price: 0,
            total_specification_price: 0,
            total_item_and_specification_price: 0,
            note_for_item: ''
        }
        this.cartProducts = {
            items: [],
            product_id: null,
            product_name: '',
            unique_id: 0,
            total_item_price: 0
        }

        this.user_helper.add_to_cart();
        // this.item_modal.close();
        $('#close_item_model').click();
        $('#clear_cart_modal_close').click();
    }


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass:'product_pop with_img'}).result.then((result) => {
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

    open_edit_item_modal(content2, item, product, selected_item_index, selected_product_index){

        this.selected_item_index = selected_item_index;
        this.selected_product_index = selected_product_index;
        let item_index = this.user_helper.user_cart.cart_main_item.findIndex((x) => x._id == item.item_id);
        let current_specification =this.user_helper.user_cart.cart_main_item[item_index].specifications;
        let order_specification = item.specifications;
        let new_specification = [];

        current_specification.forEach((x) => {
            var index = order_specification.findIndex((order_sp) => order_sp.unique_id == x.unique_id)
            if(index == -1){
                new_specification.push(x);
            } else {
                var new_specification_list = [];
                x.list.forEach((y)=>{
                    var list_index = order_specification[index].list.findIndex((order_sp_list) => order_sp_list.unique_id == y.unique_id)
                    if(list_index == -1){
                        y.is_default_selected = false;
                        new_specification_list.push(y);
                    } else {
                        order_specification[index].list[list_index].price = y.price;
                        new_specification_list.push(order_specification[index].list[list_index]);
                    }
                });
                let json = {
                    list: new_specification_list,
                    "unique_id" : x.unique_id,
                    "name" : x.name,
                    "is_required": x.is_required,
                    "price" : x.price,
                    "type" : x.type,
                    "range": x.range,
                    "max_range": x.max_range
                }
                new_specification.push(json);
            }
        });

        this.qty = item.quantity;
        this.required_count = 0;
        this.current_item = JSON.parse(JSON.stringify(item));
        this.current_item.price = this.user_helper.user_cart.cart_main_item[item_index].price;
        this.current_item.specifications = new_specification;
        this.calculate_is_required();
        this.edit_item_calculateTotalAmount();

        setTimeout(()=>{
            this.open(content2);
        },100);
    }

    edit_item_calculateTotalAmount(){
        this.total = this.current_item.price;
        this.required_temp_count = 0;
        // this.current_item.specifications.forEach((specification_group , specification_group_index) => {
        //     let isAllowed = false;
        //     specification_group.list.forEach((specification , specification_index) => {

        //         if(specification.is_default_selected){
        //             this.total = this.total + specification.price;
        //             if(specification_group.is_required && !isAllowed){

        //                 this.required_temp_count++;
        //                 isAllowed = true;
        //             }
        //         }
        //     });
        // });
        this.note_for_item = this.current_item.note_for_item;
        this.current_item.specifications.forEach((specification_group , specification_group_index) => {
            let isAllowed = false;
            var default_selected_count = 0
            specification_group.list.forEach((specification , specification_index) => {

                if(specification.is_default_selected){
                    this.total = this.total + specification.price;
                    default_selected_count++;
                }
                specification_group.default_selected_count = default_selected_count;
            });

            if(specification_group.type ==1 && specification_group.is_required) {
                if(specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            } else if(specification_group.type == 2 && specification_group.is_required) {
                if (specification_group.range) {
                    if (default_selected_count >= specification_group.range) {
                        this.required_temp_count++;
                    }
                } else {
                    if (default_selected_count >= 1) {
                        this.required_temp_count++;
                    }
                }
            }

        });

        this.total = this.total * this.qty;
    }

    updateCart(){
        let specificationPriceTotal = 0;
        let specificationPrice = 0;
        let specificationList = [];
        this.current_item.specifications.forEach((specification_group , specification_group_index) => {

            let specificationItemCartList = [];
            specification_group.list.forEach((specification , specification_index) => {

                if(specification.is_default_selected){

                    specificationPrice = specificationPrice + specification.price;
                    specificationPriceTotal = specificationPriceTotal + specification.price;
                    specificationItemCartList.push(specification)
                }
            });

            if(specificationItemCartList.length > 0){
                let specificationsItem_json ={
                    list: specificationItemCartList,
                    unique_id: specification_group.unique_id,
                    name: specification_group.name,
                    price: specificationPrice,
                    type: specification_group.type,
                    range: specification_group.range,
                    max_range: specification_group.max_range
                }
                specificationList.push(specificationsItem_json);
            }
            specificationPrice = 0;

        });

        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].item_price = this.current_item.price;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].total_specification_price = specificationPriceTotal;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].total_item_and_specification_price = this.total;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].note_for_item = this.note_for_item;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items[this.selected_item_index].specifications = specificationList;

        var total_item_price = 0;
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].items.forEach((item) =>{
            total_item_price = total_item_price + item.total_item_and_specification_price;
        });
        this.user_helper.user_cart.cart_data.cart[this.selected_product_index].total_item_price = total_item_price;

        $('#close_item_model1').click();
        this.user_helper.calculateTotalAmount();
    }


}
