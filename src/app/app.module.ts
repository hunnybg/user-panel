import { BrowserModule } from '@angular/platform-browser';
import { NgModule , OnInit, ViewChild, Injectable} from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RouterModule, Routes, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'ngx-owl-carousel';
import { FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
//import { TranslateModule, TranslateService  } from 'ng2-translate';
import {Cart} from "./cart";
import {Router_id} from "./routing_hidden_id";
import {Data} from "./data";
import {Helper} from './user_helper';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NgbdModalBasic } from './header/modal-basic';
import { FooterComponent } from './footer/footer.component';
import { OrderComponent } from './order/order.component';
import { BooleanService } from './boolean.service';
import { ShopComponent } from './shop/shop.component';
import { PartnerComponent } from './partner/partner.component';
import { HopperComponent } from './hopper/hopper.component';
import { FaqComponent } from './faq/faq.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomePartnerComponent } from './welcome-partner/welcome-partner.component';
import { WelcomeHopperComponent } from './welcome-hopper/welcome-hopper.component';
import { BasketComponent } from './basket/basket.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { DeliveryComingComponent } from './delivery-coming/delivery-coming.component';
import { ProfileComponent } from './profile/profile.component';
import {HttpModule, JsonpModule} from '@angular/http';
import { ProfileCommonComponent } from './profile-common/profile-common.component';
import { PaymentsComponent } from './payments/payments.component';
import { OrdersComponent } from './orders/orders.component';
import { FavouriteStoresComponent } from './favourite-stores/favourite-stores.component';
import { AddressesComponent } from './addresses/addresses.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HelpComponent } from './help/help.component';
import { MainpageComponent } from './mainpage/mainpage.component';


export const ROUTES: Routes = [
  { path: '', component: MainpageComponent },       
  { path: 'home', component: MainpageComponent },
  { path: '', redirectTo: 'home',  pathMatch: 'full' },
  { path: 'stores', component: OrderComponent },
  { path: ':city_name/:delivery_name/:store_name/:store_id', component: ShopComponent},
  { path: 'partner', component: PartnerComponent },
  { path: 'hopper', component: HopperComponent },
  { path: 'faq', component: HelpComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'welcome-partner', component: WelcomePartnerComponent },
  { path: 'welcome-hopper', component: WelcomeHopperComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'thankyou', component: ThankyouComponent },
  { path: 'help', component: HelpComponent },

  { path: '', component: ProfileCommonComponent,
      children: [
          { path: 'profile', component: ProfileComponent},
          { path: 'addresses', component: AddressesComponent},
          { path: 'payments', component: PaymentsComponent},
          { path: 'orders', component: OrdersComponent},
          { path: 'order_detail', component: OrderDetailComponent},
          { path: 'delivery-coming', component: DeliveryComingComponent },
          { path: 'favourite_stores', component: FavouriteStoresComponent}
      ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full' ,  component: MainpageComponent},

];

@NgModule({
  declarations: [

    AppComponent,
    HeaderComponent,
    NgbdModalBasic,
    FooterComponent,
    OrderComponent,
    ShopComponent,
    PartnerComponent,
    HopperComponent,
    FaqComponent,
    WelcomeComponent,
    WelcomePartnerComponent,
    WelcomeHopperComponent,
    BasketComponent,
    ThankyouComponent,
    DeliveryComingComponent,
    ProfileComponent,
    ProfileCommonComponent,
    PaymentsComponent,
    OrdersComponent,
    FavouriteStoresComponent,
    AddressesComponent,
    OrderDetailComponent,

    HelpComponent,

    MainpageComponent
  ],
  imports: [
      HttpModule,
      BrowserModule,
      AngularFontAwesomeModule,
      FormsModule,
      OwlModule,
      TranslateModule.forRoot(),
      RouterModule.forRoot(ROUTES),
      NgbModule.forRoot(),
      UiSwitchModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot(),
  ],
  providers: [Cart, Data, Router_id, BooleanService, Validators, Helper, TranslateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
