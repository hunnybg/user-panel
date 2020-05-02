import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import { button, title, description } from '../helper';
import {Helper} from '../user_helper';

@Component({
  selector: 'app-wecome',
  templateUrl: './welcome.component.html',
   providers: [Helper]
})
export class WelcomeComponent implements OnInit {

  public button:any = button;
  public title:any = title;
  public description:any = description;
	user_first_name: string = '';

  constructor(public bln: BooleanService, public user_helper: Helper) { }

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
    this.bln.isBod_btm_h = true;
    this.bln.address = true;

    let user = JSON.parse(localStorage.getItem('user'));
    if(user && user._id){
      this.user_first_name = user.first_name;
    }
  }

  go_to_home(){
    this.user_helper.router.navigate(['']);
  }

}
