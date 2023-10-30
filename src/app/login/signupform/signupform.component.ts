import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/api/users.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signupform',
  templateUrl: './signupform.component.html',
  styleUrls: ['./signupform.component.scss'],
})
export class SignupformComponent implements OnInit {
  
  createAdminForm = new FormGroup({
    email: new FormControl('',[Validators.email,Validators.required]),
    fullname: new FormControl('',[Validators.required,Validators.min(6)]),
    phone: new FormControl('',[Validators.required,Validators.min(8)]),
    password: new FormControl('',[Validators.required,Validators.min(6)])
  });


  constructor(private auth:UsersService,private loader:LoadingController,private alert:AlertController,private router:Router) {
    
  }

  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

   async  createUser(e) {
    const loading = await this.loader.create({
      message: 'Chargement...',
    });
    await loading.present();
    this.auth.createNewAdmin(this.createAdminForm.value.fullname,this.createAdminForm.value.email,this.createAdminForm.value.password,this.createAdminForm.value.phone).subscribe((data)=>{
      loading.dismiss();
      if (data.success === true) {
        this.showAlert('Succès',data.message);
        this.createAdminForm.reset();
        this.router.navigate(['/auth/login']);
      } else {
        this.showAlert('Erreur',data.message);
      }
      
    },(error)=>{
      loading.dismiss();
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.");
      
    })
    
  }

  ngOnInit() {
  }

}
