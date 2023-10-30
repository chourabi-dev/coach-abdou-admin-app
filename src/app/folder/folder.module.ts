import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewgymComponent } from './newgym/newgym.component';
import { MembersComponent } from './members/members.component';
import { SettingsComponent } from './settings/settings.component';
import { MemberdetailsComponent } from './memberdetails/memberdetails.component';
import { CreatenewmemberComponent } from './createnewmember/createnewmember.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { EquipmentdetailsComponent } from './equipmentdetails/equipmentdetails.component';
import { NewequipmentComponent } from './newequipment/newequipment.component';
import { FinanceComponent } from './finance/finance.component';
import { NewmoneyoperationComponent } from './newmoneyoperation/newmoneyoperation.component';

import { BaseChartDirective, ChartsModule } from 'ng2-charts';
import { ManageplansComponent } from './manageplans/manageplans.component';
import { MachinesupdateComponent } from './machinesupdate/machinesupdate.component';
import { EditpaymentdataComponent } from './editpaymentdata/editpaymentdata.component';
import { DataTablesModule } from 'angular-datatables';
import { NotificationsComponent } from './notifications/notifications.component';
import { EmployeesComponent } from './employees/employees.component';
import { NewemployeeComponent } from './newemployee/newemployee.component';
import { TicketsComponent } from './tickets/tickets.component';
import { WorkoutComponent } from './workout/workout.component';
import { WorkoutcreatorComponent } from './workoutcreator/workoutcreator.component';
import { ExercicemanagerComponent } from './exercicemanager/exercicemanager.component';
import { MoreuserinfoComponent } from './moreuserinfo/moreuserinfo.component';
import { ProgressmemberComponent } from './progressmember/progressmember.component';
import { DietsComponent } from './diets/diets.component';
import { DietdetailsComponent } from './dietdetails/dietdetails.component';
import { EditdietplanComponent } from './editdietplan/editdietplan.component';
import { EditexerciceComponent } from './editexercice/editexercice.component';
import { PlandetailsComponent } from './plandetails/plandetails.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    DataTablesModule
    
  ],
  
  declarations: [
    EditdietplanComponent,EditexerciceComponent,PlandetailsComponent,
    EditpaymentdataComponent,TicketsComponent, MachinesupdateComponent, FolderPage,NewgymComponent,DashboardComponent,MembersComponent,SettingsComponent,MemberdetailsComponent,CreatenewmemberComponent,EquipmentsComponent,EquipmentdetailsComponent,NewequipmentComponent,FinanceComponent,NewmoneyoperationComponent,ManageplansComponent,NotificationsComponent,EmployeesComponent
  ,NewemployeeComponent,WorkoutComponent,WorkoutcreatorComponent,ExercicemanagerComponent,MoreuserinfoComponent,ProgressmemberComponent,DietsComponent,DietdetailsComponent
  ],
  entryComponents:[
    EditdietplanComponent,EditexerciceComponent,PlandetailsComponent,
    MachinesupdateComponent,EditpaymentdataComponent,NewemployeeComponent,WorkoutComponent,MoreuserinfoComponent,ProgressmemberComponent,DietdetailsComponent,
    NewgymComponent,MemberdetailsComponent,CreatenewmemberComponent,EquipmentdetailsComponent,NewequipmentComponent,NewmoneyoperationComponent,ManageplansComponent
  ]
})
export class FolderPageModule {}
