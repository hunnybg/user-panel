import { Component, OnInit } from '@angular/core';
import {button, placeholder, menu_title, title, description, links} from '../helper';
import {Helper} from '../user_helper';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
    providers: [Helper]
})
export class FooterComponent implements OnInit {

	public placeholder:any = placeholder;
	public menu_title:any = menu_title;
	public title:any = title;
	public button:any = button;
	public description:any = description;
	public links:any = links
    selected_language: string = '';

	email: string = '';
  message_string: boolean = false;

  constructor(public user_helper: Helper) { }

  ngOnInit() {
      var language = localStorage.getItem('language');
      if(!language){
        language = 'en'
      }
      this.selected_language = language;
  }

  change_language(){
  	  this.user_helper.trans.use(this.selected_language);
  	  localStorage.setItem('language', this.selected_language);
  }

    send_email(){
      if(this.email){
        this.user_helper.http_post_method_requester(this.user_helper.POST_METHOD.SEND_EMAIL,{email: this.email}, (res_data) => {
            this.email = '';
            this.message_string = true;
            setTimeout(()=>{
              this.message_string = false;
            },5000);
        });
      }
    }

}
