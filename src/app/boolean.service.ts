import { Injectable } from '@angular/core';

@Injectable()
export class BooleanService {
 
  showLogin:boolean;
  showhedmid:boolean;
  showcart:boolean;
  isSticky:boolean;
  showLink:boolean;
  isHome:boolean;
  showSignup:boolean;
  isAdd_product:boolean
  isShop:boolean;
  isInner_page:boolean;
  isGreen:boolean;
  isBod_btm_h:boolean;
    isOrd_b: boolean;
    address: boolean;
    cart: boolean;
    force_cart: boolean


  constructor() {
  this.showLogin = true;
  this.showhedmid = true;
  this.showcart = true;
  this.isSticky = true;
  this.showLink = false;
  this.isHome = true;
  this.cart = true;
  this.showSignup = true;
  this.isAdd_product = true;
  this.isShop = true;
  this.isInner_page = true;
  this.isGreen = true;
  this.isBod_btm_h = true;
  this.address = true;
  this.force_cart = true;
  }

  


 
}