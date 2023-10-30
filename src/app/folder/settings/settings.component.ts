import { Component, OnInit } from '@angular/core';
import { NewgymComponent } from '../newgym/newgym.component';
import { ModalController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { ManageplansComponent } from '../manageplans/manageplans.component';
import { MachinesupdateComponent } from '../machinesupdate/machinesupdate.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  isLoading:boolean=true;
  noGymYet:boolean=false;
  hasAGym:boolean=false;
  errorLoading:boolean=false;
  gymName:String="Chargement...";
  gymEmail;

  creationDate:string="";

  constructor(public modalController:ModalController,private gym:GymproService) {

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

          //updating UI
          this.gymName=data.gym.name;
          this.creationDate=data.gym.creation_date;
          this.gymEmail=data.gym.email

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
    this.getGymInfo();
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


  public async managePlannigs(){
    const modal = await this.modalController.create({
      component: ManageplansComponent
    });

    modal.onDidDismiss().then(()=>{
      
    })
    return await modal.present();
  }


  public async machinesCheckDate(){
    const modal = await this.modalController.create({
      component: MachinesupdateComponent
    });

    modal.onDidDismiss().then(()=>{
      
    })
    return await modal.present();
  }


  manageWorkoutPlannigs(){
    
  }

  
}
