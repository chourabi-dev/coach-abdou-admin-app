import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { NewgymComponent } from '../newgym/newgym.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  isLoading: boolean = true;
  noGymYet: boolean = false;
  hasAGym: boolean = false;
  errorLoading: boolean = false;


  gymInfo:any;


  newTickets= [];
  oldTickets = [];

  constructor(private gym: GymproService,private modalController:ModalController) { }

  ngOnInit() {
    
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
          this.getTickets();

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



  async createGymModal() {

    const modal = await this.modalController.create({
      component: NewgymComponent
    });

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
    })
    return await modal.present();

  }


  
  ionViewWillEnter(){
    this.getGymInfo();
  }


  getTickets(){
    this.newTickets= [];
    this.oldTickets = [];
    this.isLoading = true;
    

    this.gym.getGymTickets().subscribe((tickets)=>{
      console.log(tickets);

      tickets.tickets.forEach(ticket => {
        if (ticket.is_closed == 0) {
          this.newTickets.push(ticket);
        }else{
          this.oldTickets.push(ticket);
        }
      });

      this.gym.updateTickets().subscribe((data)=>{
        console.log(data);
        
      });
      
      this.isLoading = false;
    },(error)=>{
      this.isLoading = false;
    })
  }

}
