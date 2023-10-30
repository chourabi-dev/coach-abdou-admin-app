import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { PlanbuilderService } from 'src/app/api/planbuilder.service';
import { UsersService } from 'src/app/api/users.service';
import { NewgymComponent } from '../newgym/newgym.component';
@Component({
  selector: 'app-editexercice',
  templateUrl: './editexercice.component.html',
  styleUrls: ['./editexercice.component.scss'],
})
export class EditexerciceComponent implements OnInit {

  @Input() exercice;


  isLoading:boolean=false;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Loading...";
  

  newex = new FormGroup({
    title:new FormControl('',Validators.required),
    instructions:new FormControl('',Validators.required),
    bodysection:new FormControl('',Validators.required),
    
    sets:new FormControl('',Validators.required),
    reps:new FormControl('',Validators.required),
    pause:new FormControl('',Validators.required),
    videolink:new FormControl('',Validators.required),
    id:new FormControl('',Validators.required),
    
    
  });

  

  gymInfo:any;

  exercices = [];

  constructor(
    private auth: UsersService,
    private alertController: AlertController,
    private gym: GymproService,
    private modalController:ModalController,
    public alert:AlertController,
    public toastController:ToastController,
    public workout:PlanbuilderService,
    public loadingController:LoadingController
  ) { }


  ngOnInit() {
    this.updateForm();
  }


  updateForm(){
    this.newex.setValue({
      title: this.exercice.title_exercice,
      instructions: this.exercice.instruction_exercice,
      bodysection: this.exercice.body_section,
      sets: this.exercice.sets,
      reps: this.exercice.reps,
      pause: this.exercice.pause,
      videolink: this.exercice.url,
      id: this.exercice.id_exercice,
      
    })



  }



  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
  async createEx(){
    

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    console.log(this.newex.value);
    

    this.gym.editExercice(this.newex.value).subscribe((data)=>{
      loading.dismiss();

      console.log(data);
      
      if (data.success) {
        
        // add a toast
        this.showToast(data.message);
        this.closeModal();

      } else {
        this.showAlert("Erreur",data.message);

        
      }

    },(error)=>{
      loading.dismiss();
      this.showAlert("Erreur","Something went wrong, please try again.");
    })
  }

  async showToast(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


   
  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
           

          }
        }
      ]
    });

    await alert.present();
  }

}
