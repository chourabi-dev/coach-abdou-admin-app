import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { PlanbuilderService } from 'src/app/api/planbuilder.service';
import { UsersService } from 'src/app/api/users.service';
import { EditexerciceComponent } from '../editexercice/editexercice.component';
import { NewgymComponent } from '../newgym/newgym.component';

@Component({
  selector: 'app-exercicemanager',
  templateUrl: './exercicemanager.component.html',
  styleUrls: ['./exercicemanager.component.scss'],
})
export class ExercicemanagerComponent implements OnInit {
  isLoading:boolean=true;
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

  ngOnInit() {}

  getExercicesList(){
    this.isLoading=true;
    this.gym.getExercicesList().subscribe((data)=>{
      console.log(data);
      
        if (data.success === true) {
          this.exercices=data.exercices
        } else {
          //show alert and dismiss
          this.showAlert("Error",data.message)
        }
        this.isLoading=false;
    },(error)=>{
        // show alert and dismiss
        this.isLoading=false;
        this.showAlert("Error","Désolé, une erreur s'est produite. Veuillez réessayer.")
    })
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

    this.gym.addNewExercice(this.newex.value).subscribe((data)=>{
      loading.dismiss();

      console.log(data);
      
      if (data.success) {
        
        // add a toast
        this.showToast(data.message);
        this.newex.reset();
        this.getExercicesList();

      } else {
        this.showAlert("Erreur",data.message);

        
      }

    },(error)=>{
      loading.dismiss();
    })
  }

  async showToast(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  


  getGymInfo(){
    this.isLoading=true;
    this.errorLoading=false;
    this.hasAGym=false;
    this.noGymYet=false;

    this.gym.getGymDetails().subscribe((data)=>{
      this.isLoading=false;
      console.log(data);
      if(data.success == true){
        if (data.gym != null) {
          this.gymInfo = data.gym;
          this.hasAGym=true;

          this.getExercicesList();
          

          //updating UI
          this.gymName=data.gym.name

        }else{
          this.noGymYet=true;
        }
      }
      else{
        this.errorLoading=true;
      }
      
    },(error)=>{
      this.isLoading=false;
      this.errorLoading=true;
      
    })
  }


   async createGymModal(){
    
    const modal = await this.modalController.create({
      component: NewgymComponent
    });

    modal.onDidDismiss().then(()=>{
      this.getGymInfo();
    })
    return await modal.present();
    
  }

  ionViewWillEnter(){
    this.getGymInfo();
  }


  async editExercice(e){

    console.log(e);
    

    const modal = await this.modalController.create({
      component: EditexerciceComponent,
      componentProps: {
        'exercice': e,
      }
    });

    modal.onDidDismiss().then(()=>{
      this.getExercicesList();
    })

    return await modal.present();
  }



  

}
