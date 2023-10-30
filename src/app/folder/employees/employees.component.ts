import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GymproService } from 'src/app/api/gympro.service';
import { NewemployeeComponent } from '../newemployee/newemployee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  isLoading: boolean = true;
  noGymYet: boolean = false;
  hasAGym: boolean = false;
  errorLoading: boolean = false;



  constructor(public modalController: ModalController, private gym: GymproService) { }



  ngOnInit() {
    
  }

}
