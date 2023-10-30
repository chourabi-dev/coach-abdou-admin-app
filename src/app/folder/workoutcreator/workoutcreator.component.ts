import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { PlanbuilderService } from 'src/app/api/planbuilder.service';
import { UsersService } from 'src/app/api/users.service';
import { NewgymComponent } from '../newgym/newgym.component';
import { PlandetailsComponent } from '../plandetails/plandetails.component';
import { Exercice } from './Exercice';
import { WorkoutPlan } from './Plan';
@Component({
  selector: 'app-workoutcreator',
  templateUrl: './workoutcreator.component.html',
  styleUrls: ['./workoutcreator.component.scss'],
})
export class WorkoutcreatorComponent implements OnInit {
  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";
  

  savedPlans = [];



  Machines = [];

  arrNotifications = [];
  tmpExerseciesArrayPerDay = [];
  machineDetails :any;



  tmpSets = [];

  step = 1;

  days = 0;

  daysArr = [
    "Monday",
    "Tusday",
    "Wednesday",
    "Thrsday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  monday:any = null;
  tusday:any = null;
  wensday:any = null;
  thursday:any = null;
  firday:any = null;
  sanday:any = null;
  saturday:any = null;

  // step 1 var

  step1Form = new FormGroup({
    title:new FormControl('',Validators.required),
    goal:new FormControl('',Validators.required),
    bodySection:new FormControl('',Validators.required),
    
    duration:new FormControl('',Validators.required),
    
  })
  //end of step 1 


    // step 1 var

    exercices = [
      
    ];

    step2Form = new FormGroup({
      exercice : new FormControl('',Validators.required)
    })
    //end of step 1 
  

    exercicesFromDataBase = [];

    groupMusclesInput:String = "";

  gymInfo:any;
  constructor(
    private auth: UsersService,
    private alertController: AlertController,
    private gym: GymproService,
    private modalController:ModalController,
    public alert:AlertController,
    public toastController:ToastController,
    public workout:PlanbuilderService
  ) { }



    nexStep(){
      this.step = this.step+1;
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

  getExercicesList(){
    this.isLoading=true;
    this.gym.getExercicesList().subscribe((data)=>{
      console.log(data);
      
        if (data.success === true) {
          this.exercicesFromDataBase=data.exercices
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

  async addMoreReps(){
    const alert = await this.alert.create({
      header: "répétitions",
      message: "Ajouter plus de répétitions.",
      inputs:[
        {
          name:"reps",
          type:"number",
          placeholder: "répétitions"
        },

        {
          name:"pause",
          type:"number",
          placeholder: "pause (sec)"

        },

        

      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {

          }
        },

        {
          text: 'Ajouter',
          cssClass: 'secondary',
          handler: async (data) => {
              console.log(data);
              this.tmpSets.push(data);
              

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
  
  resendVerificationMail(){
    this.isLoading = true;
    this.gym.sendVerificationMail().subscribe((data)=>{
      this.isLoading = false;
     
      if (data.success==true) {
        //add a toast;
        this.presentToast(data.message);

        
      } else {
        
        this.showAlert('Erreur',data.message);
      }
    },(error)=>{
      this.showAlert('Erreur',"Une erreur s'est produite. Veuillez réessayer.");
    })
  }


  getSavedPlans(){
    this.savedPlans = [];

    this.isLoading = true;
    this.gym.getGymWorkoutPlans().subscribe((data)=>{
      this.isLoading = false;

      console.log(data);

      if (data.success) {
        data.plans.forEach(plan => {
          let tmp = {
            add_date: plan.add_date,
            id_gym: plan.id_gym,
            id_workout: plan.id_workout,
            json_boc: JSON.parse(plan.json_boc)
          }
          this.savedPlans.push(tmp);
        });

        console.log(this.savedPlans);
        
      }
      


    },(error)=>{
      this.isLoading= false;
      this.errorLoading = true;
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
          this.gymInfo = data.gym;
          this.hasAGym=true;

          this.getSavedPlans();

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

  ngOnInit() {


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


  async viewData(p){
    
    const modal = await this.modalController.create({
      component: PlandetailsComponent,
      componentProps: {
        'workoutplan': p
      }
    });

    modal.onDidDismiss().then(()=>{
      this.getSavedPlans();
    })
    return await modal.present();
    
  }



  


  ionViewWillEnter(){
    this.getGymInfo();
    this.getExercicesList();
  }






  addexercice(){
    

    this.tmpExerseciesArrayPerDay.push(this.step2Form.value);

    this.step2Form.reset();


    console.log(this.tmpExerseciesArrayPerDay);
    
    
    
  }


  updateMachineDetailsVariable(){
    
    for (let i = 0; i < this.Machines.length; i++) {
      if (this.Machines[i].id_machine == this.step2Form.value.machine) {
        console.log("found");
        
        this.machineDetails = this.Machines[i];
        console.log(this.machineDetails);
        
        
        
      }
      
    }
    
    
  }



  removeSet(i){
    this.tmpSets.splice(i,1);
  }

  removeExercice(i){
    this.tmpExerseciesArrayPerDay.splice(i,1);
  }


  skipDay(){
    this.days = this.days+1;
    this.tmpExerseciesArrayPerDay= [];

    this.step2Form.reset();
    this.machineDetails = null;
    this.tmpSets = [];
  }

  goToNextDay(){
    if (this.days == 7) {
      console.log("we are done ");

      
      
    }else{
      switch (this.days) {
        case 0:
          this.monday = {
            split:this.groupMusclesInput,
            exercices: this.tmpExerseciesArrayPerDay
          } 

          break;

          case 1:
          this.tusday = {
            split:this.groupMusclesInput,
            exercices: this.tmpExerseciesArrayPerDay
          } 

  
          break;

          case 2:
          this.wensday = {
            split:this.groupMusclesInput,
            exercices: this.tmpExerseciesArrayPerDay
          } 

  
          break;
          case 3:
          this.thursday = {
            split:this.groupMusclesInput,
            exercices: this.tmpExerseciesArrayPerDay
          } 

  
          break;
          case 4:
          this.firday = {
            split:this.groupMusclesInput,
            exercices: this.tmpExerseciesArrayPerDay
          } 

  
          break;
          case 5:
            this.saturday = {
              split:this.groupMusclesInput,
              exercices: this.tmpExerseciesArrayPerDay
            } 

  
          break;
          case 6:
          this.sanday = {
            split:this.groupMusclesInput,
            exercices: this.tmpExerseciesArrayPerDay
          } 

  
          break;

          
      
        default:
          break;
      }

      // empty tmps
      this.tmpExerseciesArrayPerDay= [];
      this.groupMusclesInput="";

      this.step2Form.reset();
      this.machineDetails = null;
      this.tmpSets = [];

      
      this.days = this.days+1;
    }
    
  }


  doneMakingProgram(){
    let program = {
      monday : this.monday,
      tusday : this.tusday,
      wensday : this.wensday,
      thursday : this.thursday,
      friday: this.firday,
      sanday : this.sanday,
      saturday : this.saturday,
      
    }

    let plan = {
      title: this.step1Form.value.title,
      goal: this.step1Form.value.goal,
      duration: this.step1Form.value.duration,
      bodysection: this.step1Form.value.bodySection,
      
      program: program
      
    }

    console.log(plan);

    // send it to server
    this.isLoading = true;

    this.gym.addNewWorkoutPlan(JSON.stringify(plan)).subscribe((res)=>{
      this.presentToast(res.message);
      if (res.success == true) {
        this.resetAll();
      }
      this.isLoading = false;
    },(error)=>{
      this.showAlert("Erreur","une erreur s'est produite lors de la tentative d'ajout du plan");
      this.isLoading = false;
    })
  }

  resetAll(){
    this.step = 1;
    this.step1Form.reset();
    this.step2Form.reset();
    this.tmpExerseciesArrayPerDay= [];

    this.step2Form.reset();
    this.machineDetails = null;
    this.tmpSets = [];

    
    this.days = 0;

    this.getSavedPlans();

  }

}
