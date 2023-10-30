import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { UsersService } from 'src/app/api/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.scss'],
})
export class LoginformComponent implements OnInit {

  loginForm = new FormGroup({
    login: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',Validators.required)
  })

  constructor(private loader:LoadingController,private auth: UsersService,private alert:AlertController,private router:Router) { }

  ngOnInit() {
  }

  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  async connectAdmin(e){

    const loading = await this.loader.create({
      message: 'Connexion...',
    });
    await loading.present();
    this.auth.authAdmin(this.loginForm.value.login.toLowerCase().trim(),this.loginForm.value.password).subscribe((data)=>{
      loading.dismiss();
      if (data.success==true) {
        this.auth.openSessionUsingToken(data.token);
        this.router.navigate(['/home']);

      } else {
        this.showAlert('Erreur',data.message);
      }

    },(error)=>{
      loading.dismiss();
      this.showAlert('Erreur',"Quelque chose s'est mal passé, veuillez réessayer");
    });
  }

}
