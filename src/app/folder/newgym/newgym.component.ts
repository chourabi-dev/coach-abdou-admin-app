import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GymproService } from 'src/app/api/gympro.service';

@Component({
  selector: 'app-newgym',
  templateUrl: './newgym.component.html',
  styleUrls: ['./newgym.component.scss'],
})
export class NewgymComponent implements OnInit {

  isLoading: boolean = false;
  newGymForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    pricing: new FormControl('',[Validators.required]),
    bills: new FormControl('',[Validators.required]),
    
    
  })
  constructor(public modalCtrl:ModalController,private gym:GymproService,private loader:LoadingController,private alert:AlertController) { }

  ngOnInit() {

  }

  closeModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }


  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }



  async createNewGym(){
    const loading = await this.loader.create({
      message: 'Chargement...',
    });
    await loading.present();
    this.gym.createNewGym(this.newGymForm.value.name,this.newGymForm.value.email,this.newGymForm.value.pricing,this.newGymForm.value.bills).subscribe((data)=>{
      loading.dismiss();
      if (data.success==true) {
        this.closeModal();
      } else {
        this.showAlert('Erreur',data.message);
      }
    },(error)=>{
      loading.dismiss();
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
    })
  }

 
}
