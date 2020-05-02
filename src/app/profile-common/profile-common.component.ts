import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, links, placeholder, label, button, description, price, menu_title, orderTable} from '../helper';
import {ViewEncapsulation} from '@angular/core';
import {Helper} from "../user_helper";
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-profile-common',
  templateUrl: './profile-common.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Helper]
})
export class ProfileCommonComponent implements OnInit {

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

        $(document).ready(function(){
            $(".edit").click(function(){
                $(this).parent().siblings().addClass("edit_data");
                $(".save, .change").show();
                $(this).hide();
            })
        })
        let user = JSON.parse(localStorage.getItem('user'));
        this.user_helper.user_name = user.first_name + ' ' + user.last_name;



    }
    activeRoute(routename: string): boolean {
        return this.user_helper.router.url.indexOf(routename) > -1;
    }
}
