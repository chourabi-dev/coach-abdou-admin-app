import { Component, OnInit } from '@angular/core';
import { NewgymComponent } from '../newgym/newgym.component';
import { ModalController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { MemberdetailsComponent } from '../memberdetails/memberdetails.component';
import { CreatenewmemberComponent } from '../createnewmember/createnewmember.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {

  isLoading: boolean = true;
  noGymYet: boolean = false;
  hasAGym: boolean = false;
  errorLoading: boolean = false;

  members = [];
  isSearchingFor: boolean = false;
  membersSearch = [];
  filtre="1";
  cat="all";
  plans=[];

  constructor(public modalController: ModalController, private gym: GymproService) {


  }

  updateFiltre(e) {
    this.filtre = e.target.value;
    this.getMembersList(this.filtre);

  }

  getGymPlans(){
    this.isLoading=true;
    this.gym.getGymPlans().subscribe((data)=>{
      console.log(data);
      
      this.isLoading=false;
      
      if (data.success==true) {
        this.plans=data.plans;
      }


    },(error)=>{
      this.isLoading=false;
    })
  }


  updateFiltreCategorie(e){
    this.cat = e.target.value;
    this.getMembersList(this.filtre);
    
  }


  sortMembersByLeftDays(){
    this.members.sort( (m1,m2) => m1.leftDays - m2.leftDays );
  }

  getMembersList(f) {
    this.isLoading = true;
    this.gym.getGymMembersList().subscribe((res) => {
      console.log(res);

      this.isLoading = false;



      if (res.success == true) {



        switch (f) {
          case "1":

            var tmpMembersList = [];

            for (let i = 0; i < res.members.length; i++) {
              if (res.members[i].isArchived === 0) {
                let lastRenewalDate = new Date(res.members[i].lastRenewalDate);
              let today = new Date();
              let hoursCounted = (((today.getTime() - lastRenewalDate.getTime()) / 1000) / 60) / 60;
              let daysPasses = Math.round(hoursCounted / 24);
              let leftDays = res.members[i].pricingPlan.duration - daysPasses;

              let member = {
                leftDays: leftDays,
                data: res.members[i],
                shouldpayat: new Date( (today.getTime() + (leftDays * 24 * 60 * 60 * 1000)) )
              }

              // check for plan filter first
              if (this.cat !="all") {
                if (member.data.pricingPlan.id == this.cat) {
                  tmpMembersList.push(member);
                }
              }else{
                tmpMembersList.push(member);
              }

              
              }
            }

            this.members = tmpMembersList;
            this.sortMembersByLeftDays();
            console.log(this.members);
            break;

            case "2":

              var tmpMembersList = [];
  
              for (let i = 0; i < res.members.length; i++) {
                if (res.members[i].isArchived === 1) {
                  let lastRenewalDate = new Date(res.members[i].lastRenewalDate);
                let today = new Date();
                let hoursCounted = (((today.getTime() - lastRenewalDate.getTime()) / 1000) / 60) / 60;
                let daysPasses = Math.round(hoursCounted / 24);
                let leftDays = res.members[i].pricingPlan.duration - daysPasses;
  
                let member = {
                  leftDays: leftDays,
                  data: res.members[i]
                }
  
                if (this.cat !="all") {
                  if (member.data.pricingPlan.id == this.cat) {
                    tmpMembersList.push(member);
                  }
                }else{
                  tmpMembersList.push(member);
                }
                }
              }
  
              this.members = tmpMembersList;
  
              console.log(this.members);
              break;

              case "3":

                var tmpMembersList = [];
    
                for (let i = 0; i < res.members.length; i++) {
                  if (res.members[i].isArchived === 0) {
                    let lastRenewalDate = new Date(res.members[i].lastRenewalDate);
                  let today = new Date();
                  let hoursCounted = (((today.getTime() - lastRenewalDate.getTime()) / 1000) / 60) / 60;
                  let daysPasses = Math.round(hoursCounted / 24);
                  let leftDays = res.members[i].pricingPlan.duration - daysPasses;
    
                  let member = {
                    leftDays: leftDays,
                    data: res.members[i]
                  }

                  if (leftDays <=3) {
                    if (this.cat !="all") {
                      if (member.data.pricingPlan.id == this.cat) {
                        tmpMembersList.push(member);
                      }
                    }else{
                      tmpMembersList.push(member);
                    }
                  }
    
                  
                  }
                }
    
                this.members = tmpMembersList;
    
                console.log(this.members);

                this.sortMembersByLeftDays();
                break;

        }





      } else {

      }
    }, (error) => {
      this.isLoading = false;

    })
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

          // we can get the memebers list now
          this.getMembersList(this.filtre);


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

  ngOnInit() {
    this.getGymPlans();
    this.getGymInfo();
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


  async openUserDetailsModal(id, fullname) {
    console.log(id);

    const modal = await this.modalController.create({
      component: MemberdetailsComponent,
      componentProps: {
        'idMember': id,
        'fullname': fullname
      }
    });

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
      this.isSearchingFor = false;

    })
    return await modal.present();

  }


  async openCreateNewUserModal() {

    const modal = await this.modalController.create({
      component: CreatenewmemberComponent
    });

    modal.onDidDismiss().then(() => {
      this.getGymInfo();
    })
    return await modal.present();

  }

  searchFor(e) {

    let newMembersList = [];
    var query: string = e.target.value;

    if (query !== '') {
      this.isSearchingFor = true;
      this.members.map((member) => {
        if (member.data.fullname.toLowerCase().indexOf(query.toLowerCase()) != -1) {
          newMembersList.push(member);
        }
      })

      this.membersSearch = newMembersList;
    } else if (query === '') {
      this.isSearchingFor = false;
    }


  }




}
