import {Component} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {button, title, placeholder} from '../helper';
import { BooleanService } from '../boolean.service';
import {Helper} from '../user_helper';
import { HeaderComponent } from './header.component';
declare var $;
import {Response, Http} from '@angular/http';
import { map } from "rxjs/operators";

export interface UserLogin {
    email: string,
    social_id: string,
    login_by: any,
    cart_unique_token: string,
    password: string
}
export interface UserRegister{
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    social_unique_id: String,
    login_by:String,
    confirm_password: String,
    country_id: Object,
    city: Object,
    address: String,
    country_phone_code: string,
    cart_unique_token: string,
    phone: Number,
    image_url: String,
    referral_code:String,
    is_email_verified:Boolean,
    is_phone_number_verified:Boolean
}
export interface UserForgotPassword{
    email: String
}

@Component({
  selector: 'ngbd-modal-basic',
  templateUrl: './modal-basic.html',
    providers: [Helper]
})
export class NgbdModalBasic {
  closeResult: string;
  public button:any = button;
  public title:any = title;
  public placeholder:any = placeholder;

  public user_login: UserLogin;

  "tel_url" = "../assets/images/flag.svg";

   fname: string;
   sname:string;
   password: string;
   email: string;
   mobile: number;
    private user_id: string = '';
    private server_token: string = '';
    setting_data: any = {};
    email_placeholder:Number = 1;
    email_or_phone_error: Boolean = false;
    private user_register: UserRegister;
    country_list: any[] = [];
    error_message: string = '';
    private user_forgot_password: UserForgotPassword;

  constructor(private modalService: NgbModal, public HeaderComponent: HeaderComponent, public user_helper: Helper, public bln: BooleanService) {
   this.fname = "";
   this.sname = "";
   this.password = "";
   this.email = "";
   this.mobile = null;
   this.bln.showSignup = true;
  }

    ngOnInit() {
      this.user_login = {
          cart_unique_token: localStorage.getItem('cart_unique_token'),
          email: '',
          password: '',
          login_by: this.title.manual,
          social_id: ''
      }
      this.user_forgot_password={
            email: "",
        }

        this.user_register ={
            cart_unique_token: localStorage.getItem('cart_unique_token'),
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            social_unique_id: "",
            login_by: this.title.manual,
            confirm_password: "",
            country_id: "",
            city: "",
            address: "",
            country_phone_code: "",
            phone: null,
            image_url: "./default.png",
            referral_code: "",
            is_phone_number_verified: false,
            is_email_verified : false

        }

        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user._id){
            this.user_id = user._id;
            this.server_token = user.server_token;
        }
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.GET_SETTING_DETAIL, {}, (res_data) => {

            this.user_helper.myLoading=false;
            this.setting_data=res_data.setting

            if(this.setting_data.is_user_login_by_phone == true && this.setting_data.is_user_login_by_email == true)
            {
                this.email_placeholder = 1
            }
            else if(this.setting_data.is_user_login_by_phone == true)
            {
                this.email_placeholder = 2
            }
            else if(this.setting_data.is_user_login_by_email == true)
            {
                this.email_placeholder = 3
            }

        });
        this.user_helper.http.get(this.user_helper.GET_METHOD.GET_COUNTRY_LIST).pipe(map((res)=>res.json())).subscribe((res_data) => {
            this.country_list = res_data.countries;
        });
        // this.user_helper.http.get(this.user_helper.GET_METHOD.GET_COUNTRY_LIST).map((response: Response) => response.json()) .subscribe(res_data => {
                // this.country_list = res_data.countries;
        //     },
        // (error: any) => {
        //     this.user_helper.http_status(error)
        // });
    }

    select_country(){
        var index = this.country_list.findIndex((x)=>x.country_phone_code == this.user_register.country_phone_code);
        this.user_register.country_id = this.country_list[index]._id;
    }

    userForgotPassword(forgotpassworddata)
    {
        this.user_helper.myLoading=true;
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.FORGOT_PASSWORD, {email:forgotpassworddata.email.trim(), type:7}, (res_data) => {
            this.user_helper.myLoading=false;
            if(res_data.success == false)
            {
                this.user_helper.data.storage = {
                    "code": res_data.error_code,
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.message()
                this.error_message = this.user_helper.ERROR_CODE[res_data.error_code];
            }
            else
            {
                this.user_helper.data.storage = {
                    "message": this.user_helper.MESSAGE_CODE[res_data.message],
                    "class": "alert-info"
                }
                $('#success_modal').click();
                $('#forgot_modal').click();
                this.error_message = '';
            }
        });
    }

    open_login_modal(){
        $('#success_modal123').click();
    }

    public formData = new FormData();
    userRegister(userdata)
    {
        this.user_helper.myLoading=true;
        this.formData.append('phone',userdata.phone.trim());
        this.formData.append('password',this.user_register.password.trim());
        this.formData.append('cart_unique_token',this.user_register.cart_unique_token);
        this.formData.append('country_id',this.user_register.country_id.toString());
        this.formData.append('city','');
        this.formData.append('social_id', '');
        this.formData.append('login_by', this.user_helper.title.manual);
        this.formData.append('country_phone_code',this.user_register.country_phone_code);
        this.formData.append('first_name',userdata.first_name.trim());
        this.formData.append('last_name',userdata.last_name.trim());
        this.formData.append('email',userdata.email.trim());
        this.formData.append('address','');
        this.formData.append('referral_code','');
        // this.formData.append('is_phone_number_verified',true);
        // this.formData.append('is_email_verified',true);

        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.REGISTER, this.formData, (res_data) => {

            this.user_helper.myLoading=false;
            if(res_data.success == false)
            {
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.message();
                this.error_message = this.user_helper.ERROR_CODE[res_data.error_code];
                this.formData = new FormData();
                if(this.user_register.login_by == this.title.social){
                    this.user_register.password = '123456';
                    this.user_register.confirm_password='123456';
                }
            }
            else
            {
                this.error_message = '';
                this.user_helper.data.storage = {
                    "message": this.user_helper.MESSAGE_CODE[res_data.message],
                    "class": "alert-info"
                }
                localStorage.setItem('user', JSON.stringify(res_data.user));
                this.user_helper.check_detail();
                this.user_helper.router.navigate(['welcome']);
                $('#register_modal').click();
            }
        });
    }

  open(content) {
    this.user_login = {
          cart_unique_token: localStorage.getItem('cart_unique_token'),
          email: '',
          password: '',
          login_by: this.title.manual,
          social_id: ''
      }
      this.user_forgot_password={
            email: "",
        }
        this.error_message = '';
        this.user_register ={
            cart_unique_token: localStorage.getItem('cart_unique_token'),
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            social_unique_id: "",
            login_by: this.title.manual,
            confirm_password: "",
            country_id: "",
            city: "",
            address: "",
            country_phone_code: "",
            phone: null,
            image_url: "./default.png",
            referral_code: "",
            is_phone_number_verified: false,
            is_email_verified : false

        }
        if(this.country_list.length>0){
            this.user_register.country_phone_code = this.country_list[0].country_phone_code;
            this.user_register.country_id = this.country_list[0]._id;
        }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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

   open2(content2) {
    this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     this.closeResult = `Closed with: ${result}`;
   }, (reason) => {
     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
   });
  }

    userLogin(logindata)
    {
        this.user_login.social_id = '';
        this.user_login.login_by = this.title.manual

        this.user_login.email=this.user_login.email.trim();
        logindata.email=logindata.email.trim();
        if(this.email_placeholder == 1)
        {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if(!isNaN(logindata.email) || reg.test(logindata.email))
            {
                this.email_or_phone_error=false;
                this.Login()
            }
            else
            {
                this.email_or_phone_error=true;
            }
        }
        else
        {
            this.email_or_phone_error=false;
            this.Login()
        }
    }

    Login(){
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.LOGIN,this.user_login, (res_data) => {
            if (res_data.success) {
                localStorage.setItem('user', JSON.stringify(res_data.user));
                this.user_helper.check_detail();
                $('#login_modal').click();
                this.error_message = '';
            } else {
                this.user_helper.data.storage = {
                    "message": this.user_helper.ERROR_CODE[res_data.error_code],
                    "class": "alert-danger"
                }
                this.user_helper.message();
                this.error_message = this.user_helper.ERROR_CODE[res_data.error_code];
            }
        });
    }
 

   onSubmit(data){
  }


}