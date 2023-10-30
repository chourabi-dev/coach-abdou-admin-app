import { Component, OnInit } from '@angular/core';
import { GymproService } from 'src/app/api/gympro.service';
import { NewgymComponent } from '../newgym/newgym.component';
import { ModalController } from '@ionic/angular';
import { EquipmentdetailsComponent } from '../equipmentdetails/equipmentdetails.component';
import { NewequipmentComponent } from '../newequipment/newequipment.component';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss'],
})
export class EquipmentsComponent implements OnInit {
  isLoading: boolean = true;
  noGymYet: boolean = false;
  hasAGym: boolean = false;
  errorLoading: boolean = false;

  machines = [];
  isSearchingFor: boolean = false;
  filtre = "1";
  gymInfo:any;


  constructor(private gym: GymproService,private modalController:ModalController) { }

  ngOnInit() {
    this.getGymInfo();
  }


  getGymInfo() {
    this.isLoading = true;
    this.errorLoading = false;
    this.hasAGym = false;
    this.noGymYet = false;

    this.gym.getGymDetails().subscribe((data) => {
      this.isLoading = false;
      console.log(data);
      if (data.success == true) {
        if (data.gym != null) {
          this.hasAGym = true;
          this.gymInfo=data.gym;

          // we can get the machines list now
          this.getMachines();

        } else {
          this.noGymYet = true;
        }
      }
      else {
        this.errorLoading = true;
      }

    }, (error) => {
      this.isLoading = false;
      this.errorLoading = true;

    })
  }

  getMachinesFromFilters(e) {
    this.filtre = e.target.value;
    this.getMachines();
  }

  getMachines() {

    this.isLoading = true;
    this.gym.getMachinesList().subscribe((res) => {
      console.log('hello ', res);
      this.isLoading = false;

      if (res.success == true) {
        var tmpMachinesArray=[];
        switch (this.filtre) {
          case "1":
            for (let i = 0; i < res.machines.length; i++) {
              var lastMaintainDate= new Date(res.machines[i].last_maintain_date);
              var today = new Date();
              today.setHours(0);
              today.setSeconds(0);
              today.setMinutes(0);
              today.setMilliseconds(0);
    
              var lastMaintainDateIndays = (((( (today.getTime() - lastMaintainDate.getTime()) /1000)/60)/60)/24);
              if (lastMaintainDateIndays >= this.gymInfo.check_equipments_duration_days ) {
                tmpMachinesArray.push({
                  add_date: res.machines[i].add_date,
                  id: res.machines[i].id,
                  label: res.machines[i].label,
                  last_maintain_date: res.machines[i].last_maintain_date,
                  photo: res.machines[i].photo,
                  stat:1,
                  histroy:res.machines[i].history
    
                });
              } else {
                tmpMachinesArray.push({
                  add_date: res.machines[i].add_date,
                  id: res.machines[i].id,
                  label: res.machines[i].label,
                  last_maintain_date: res.machines[i].last_maintain_date,
                  photo: res.machines[i].photo,
                  stat:0,
                  histroy:res.machines[i].history
    
                });
              }
              
            }

            this.machines=tmpMachinesArray;

            
            
            break;
          case "2":
            for (let i = 0; i < res.machines.length; i++) {
              var lastMaintainDate= new Date(res.machines[i].last_maintain_date);
              var today = new Date();
              today.setHours(0);
              today.setSeconds(0);
              today.setMinutes(0);
              today.setMilliseconds(0);
    
              var lastMaintainDateIndays = (((( (today.getTime() - lastMaintainDate.getTime()) /1000)/60)/60)/24);
              console.log(lastMaintainDateIndays.toFixed() );
    
              if (lastMaintainDateIndays >= this.gymInfo.check_equipments_duration_days ) {
                tmpMachinesArray.push({
                  add_date: res.machines[i].add_date,
                  id: res.machines[i].id,
                  label: res.machines[i].label,
                  last_maintain_date: res.machines[i].last_maintain_date,
                  photo: res.machines[i].photo,
                  stat:1,
                  histroy:res.machines[i].history
    
                });
              }
              
            }

            this.machines=tmpMachinesArray;

            break;
        }





      } else {
        this.errorLoading = true;
      }
    }, (error) => {
      this.isLoading = false;
      this.errorLoading = true;

    })
  }


  async machineDetails(machine) {
    console.log(machine);
    
    const modal = await this.modalController.create({
      component: EquipmentdetailsComponent,
      componentProps: {
        'machine': machine,
      }
    });

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
    })
    return await modal.present();
  }

  async createGymModal() {

    const modal = await this.modalController.create({
      component: NewgymComponent
    });

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
    })
    return await modal.present();

  }

  async newEquipment(){
    const modal = await this.modalController.create({
      component: NewequipmentComponent
    });

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
    })
    return await modal.present();
  }

}
