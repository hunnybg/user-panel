import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {button, title, description} from '../helper';
import {Helper} from "../user_helper";

@Component({
  selector: 'app-welcome-hopper',
  templateUrl: './welcome-hopper.component.html',
    providers: [Helper]
})

export class WelcomeHopperComponent implements OnInit {

  public button: any = button;
  public title: any = title;
  public description: any = description;


  constructor(public bln: BooleanService, public user_helper: Helper) {}

  ngOnInit() {

  this.bln.showLogin = true;
  this.bln.showhedmid = true;
  this.bln.showcart = true;
  this.bln.isSticky = false;
  this.bln.showLink = false;
  this.bln.isHome = true;
  this.bln.cart = true;
  this.bln.showSignup = false;
  this.bln.isAdd_product = true;
  this.bln.isShop = true;
  this.bln.isInner_page = true;
   this.bln.isGreen = true;
   this.bln.isBod_btm_h = true;
      this.bln.address = true;


  }

}
