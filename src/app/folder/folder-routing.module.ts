import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MembersComponent } from './members/members.component';
import { SettingsComponent } from './settings/settings.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { FinanceComponent } from './finance/finance.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { EmployeesComponent } from './employees/employees.component';
import { TicketsComponent } from './tickets/tickets.component';
import { WorkoutComponent } from './workout/workout.component';
import { WorkoutcreatorComponent } from './workoutcreator/workoutcreator.component';
import { ExercicemanagerComponent } from './exercicemanager/exercicemanager.component';
import { DietsComponent } from './diets/diets.component';

const routes: Routes = [
  {
    path: '',
    component: FolderPage ,
    children:[
        {
          path: '',
          component: DashboardComponent
        },
        {
          path: 'members',
          component: MembersComponent
        },
        /*{
          path: 'employees',
          component: EmployeesComponent
        },*/
        {
          path: 'tickets',
          component: TicketsComponent
        },
        
        {
          path: 'equipments',
          component: EquipmentsComponent
        },
        {
          path: 'finance',
          component: FinanceComponent
        },
        {
          path: 'settings',
          component: SettingsComponent
        },
        {
          path:'dashboard',
          component:DashboardComponent
        },
        {
          path:'notifications',
          component:NotificationsComponent
        }
        ,
        {
          path:'workout/:id',
          component:WorkoutComponent
        },
        {
          path:'workoutcreator',
          component:WorkoutcreatorComponent
        },
        {
          path:'exercicecreator',
          component:ExercicemanagerComponent
        },
        {
          path:'diets',
          component:DietsComponent
        },
        
        
    ]
  },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
