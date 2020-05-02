import { Component, OnInit } from '@angular/core';
import { BooleanService } from '../boolean.service';
import {title, faqList, faqList2, description} from '../helper';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {

   public title:any = title;
   private faqList:any = faqList;
   private faqList2:any = faqList2;
   public description:any = description;


  constructor(public bln: BooleanService) { }

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
  this.bln.isBod_btm_h = true;

  }

}
