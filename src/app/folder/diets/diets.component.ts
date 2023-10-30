import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { PlanbuilderService } from 'src/app/api/planbuilder.service';
import { UsersService } from 'src/app/api/users.service';
import { EditdietplanComponent } from '../editdietplan/editdietplan.component';

@Component({
  selector: 'app-diets',
  templateUrl: './diets.component.html',
  styleUrls: ['./diets.component.scss'],
})
export class DietsComponent implements OnInit {
  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";

  step1Form = new FormGroup({
    title:new FormControl('',Validators.required),
    
  })

  step2Form = new FormGroup({
    mealDescription:new FormControl('',Validators.required),
    
  })

  step = 1;

  meals=[];

  diets = [];




  
  constructor(
    private auth: UsersService,
    private alertController: AlertController,
    private gym: GymproService,
    private modalController:ModalController,
    public alert:AlertController,
    public toastController:ToastController,
    public workout:PlanbuilderService,
    public loader:LoadingController
  ) { }

  ngOnInit() {}

  addMeal(){
    const meal = {
      number : this.meals.length,
      description : this.step2Form.value.mealDescription
    }

    this.meals.push(meal);

    this.step2Form.reset();
  }

  deleteMeal(i){
    this.meals.splice(i,1);
  }

  
  ionViewWillEnter(){
    this.getGymInfo();
  }

  nexStep(){
    this.step = this.step+1;
  }

  
  async showAlert(title,message){
    const alert = await this.alert.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirm(){
      const loading = await this.loader.create({
        message: 'Chargement...',
      });
      await loading.present();

      let dietPlan = {
        info : this.step1Form.value,
        meals : this.meals
      }

      
      this.gym.addNewDietPlan(dietPlan).subscribe((data)=>{
        loading.dismiss();
        if (data.success==true) {
          this.showAlert('Add diet',data.message);
          this.step1Form.reset();
          this.step2Form.reset();
          this.step = 1;
          this.getDiets();
        } else {
          this.showAlert('Erreur',data.message);
        }
      },(error)=>{
        loading.dismiss();
        this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.")
      })
    
  
  }



  getDiets(){
    this.isLoading = true;

    this.gym.getDietsList().subscribe((data)=>{
      this.isLoading=false;
      console.log(data);
      if(data.success == true){
        this.diets = data.diets;
        console.log(this.diets);
        
      }
      else{
        this.errorLoading=true;
      }
      
    },(error)=>{
      this.isLoading=false;
      this.errorLoading=true;
      
    })

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
          this.hasAGym=true;
          this.getDiets();
          

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


  async editDietDetails(diet,idplan){

    console.log(diet,idplan);
    

    const modal = await this.modalController.create({
      component: EditdietplanComponent,
      componentProps: {
        'diet': diet,
        'idplan':idplan
      }
    });

    modal.onDidDismiss().then(()=>{
      this.getDiets();
    })

    return await modal.present();
  }


}
