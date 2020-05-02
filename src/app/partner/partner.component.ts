import { Component, OnInit } from '@angular/core';
import { OwlModule } from 'ngx-owl-carousel';
import { BooleanService } from '../boolean.service';
import { placeholder, button, label, title, service, description, slide_conList, partnerList} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
import {Response} from "@angular/http";

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css'],
  encapsulation: ViewEncapsulation.None,
    providers: [Helper]

})
export class PartnerComponent implements OnInit {

  public button:any = button;
  public label:any = label;
  public title:any = title;
  public placeholder:any = placeholder;
  public service:any = service;
  public description:any = description;
  private slide_conList:any = slide_conList;
  private partnerList:any = partnerList;
    deliveries: any[] = [];
   name: string;
   snames:string;
    password: string;
    address:string;
   email: string;
    mobile: number;
    delivery_type: string = '';
    companyName: string = '';
    postal_code: string = '';
    message: boolean = false;

    show_future: boolean = false;

constructor( public bln: BooleanService , public user_helper: Helper ) { }



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
      // this.user_helper.http.get('/admin/delivery_list').map((response: Response) => response.json()) .subscribe(res_data => {
      //     console.log(res_data)
      //     this.deliveries = res_data.deliveries;
      // });

  }

  onSubmit(data){


        let json = {
            name: this.name,
            email: this.email,
            password: this.password,
            snames: this.snames,
            mobile: this.mobile,
            address: this.address,
            delivery_type: this.delivery_type,
            companyName: this.companyName,
            postal_code: this.postal_code
        }

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.SEND_PARTNER_EMAIL, json, (res_data) => {
             this.message = true;
             this.show_future = true;
             setTimeout(function(){
               this.message = false;
             },5000)
            this.name = "";
            this.snames = "";
            this.password = "";
            this.email = "";
            this.mobile = null;
            this.address = "";
            this.delivery_type = '';
            this.companyName = '';  
            this.postal_code = '';
        });
  }

  redirect(){
    document.querySelector('#l_section4_in').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
