import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {button, title, description} from '../helper';
import {Helper} from "../user_helper";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css'],
    providers: [Helper]
})
export class ThankyouComponent implements OnInit {

	public button:any = button;
	public title:any = title;
	public description:any = description;

  constructor(public bln: BooleanService, public user_helper: Helper) {}

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
   this.bln.isBod_btm_h = true;
      this.bln.address = true;
  }

    goto_tracking(){
        this.user_helper.router.navigate(['delivery-coming']);
    }

}
