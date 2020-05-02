import { Component, OnInit } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import { BooleanService } from '../boolean.service';
import { placeholder, button, language, label, title, menu_title, hopperSlideList, list_info } from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";

@Component({
  selector: 'app-hopper',
  templateUrl: './hopper.component.html',
    providers: [Helper]
})
export class HopperComponent implements OnInit {

   public button:any = button;
  public language:any = language;
  public menu_title:any = menu_title;
  public label:any = label;
  public title:any = title;
  public placeholder:any = placeholder;
  private hopperSlideList:any = hopperSlideList;
  private list_info:any = list_info;
show_future: boolean = false;
  
   name: string;
   snames:string;
    password: string;
    address:string;
   email: string;
    mobile: number;
    message: boolean = false;

  constructor(public bln: BooleanService, public user_helper: Helper ) {}

  ngOnInit() {

  this.bln.showLogin = true;
  this.bln.showhedmid = true;
  this.bln.showcart = true;
  this.bln.isSticky = true;
  this.bln.showLink = false;
  this.bln.isHome = false;
  this.bln.cart = false;
  this.bln.showSignup = false;
  this.bln.isAdd_product = true;
  this.bln.isShop = true;
  this.bln.isInner_page = false;
   this.bln.isGreen = true;
   this.bln.isBod_btm_h = true;
      this.bln.address = true;

   this.name = "";
   this.snames = "";
   this.password = "";
   this.email = "";
   this.mobile = null;
   this.address = "";

  }

  onSubmit(data){
      let json = {
          name: this.name,
          email: this.email,
          password: this.password,
          snames: this.snames,
          mobile: this.mobile,
          address: this.address
      }

      this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.SEND_HOPPER_EMAIL, json, (res_data) => {
          this.show_future = true;
          this.name = "";
          this.snames = "";
          this.password = "";
          this.email = "";
          this.mobile = null;
          this.address = "";
          this.message = true;
          setTimeout(function(){
            this.message = false;
          },5000)
      });
  }

  redirect(){
    document.querySelector('#l_section4').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
