import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GymproService {

  private url:String;

  constructor(private http:HttpClient) {
    this.url=environment.apiEndPoint;
  }

  getGymDetails(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/gym/gymDetails/index.php', httpOptions);
  }



  getMachinesExercices(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/gym/getMachinesExercices/index.php', httpOptions);
  }


  getAdminNotifications(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/users/getNotifications/index.php', httpOptions);
  }


  getGymTickets(){
    
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/gym/getTickets/index.php', httpOptions);
  }



  getExercicesList(){
    
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/gym/getExercicesList/index.php', httpOptions);
  }


  resetPassword(hashedUserID){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/resetPassword/index.php',{
      idMember:hashedUserID
    }, httpOptions);
  }


  addNewExercice(data){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/addNewExercice/index.php',data, httpOptions);
  }

  editExercice(data){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/editExercice/index.php',data, httpOptions);
  }

  addNewDietPlan(data){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/addNewDietPlan/index.php',data, httpOptions);
  }

  updateDietPlanForMember(id,data){
    const d = {
      "idMember":id,
      "data":data
    }
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/updateDietPlanForMember/index.php',d, httpOptions);
  }


  updateAdminFCM(fcm){
    const d = {
      "fcm":fcm
    }
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/updateAdminFCM/index.php',d, httpOptions);
  }


  updateDietPlan(id,plan){
    const d = {
      "id":id,
      "plan":plan
    }
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/updateDietPlan/index.php',d, httpOptions);
  }


  getDietsList(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/gym/getDietsList/index.php', httpOptions);
  }


  updateMembreWorkoutData(id,data){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/updateMembreWorkoutData/index.php',{
      jsonPlan:data,
      idMember:id

    }, httpOptions);
  }

  updateWorkoutData(id,data){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/updateWorkoutData/index.php',{
      jsonPlan:data,
      id:id

    }, httpOptions);
  }





  sendMessage(id,title,message){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/sendMessage/index.php',{
      idMember:id,
      title:title,
      message:message,
      
    }, httpOptions);
  }


  addNewWorkoutPlan(plan) {
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/addNewWorkoutPlan/index.php',{
      json_plan:plan
      
    }, httpOptions);
  }


  getGymWorkoutPlans(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/gym/getGymWorkoutPlans/index.php', httpOptions);
  }

  updateTickets(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/gym/updateTickets/index.php', httpOptions);
  }

  getAdminNotificationsCounter(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/users/getNotificationCounter/index.php', httpOptions);
  }

  getGymMembersList(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/members/getGymMembers/index.php', httpOptions);
  }

  createNewGym(name,email,pricing,bills){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/createNewGym/index.php',{
      name:name,
      email:email,
      pricing:pricing,
      bills:bills
    }, httpOptions);
  }

  updateGymMachineCheckDuration(duration){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/updateGymMachineCheckDuration/index.php',{
      duration:duration
    }, httpOptions);
  }



  getMemberDetails(hashedUserID){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/getMemberDetails/index.php',{
      idMember:hashedUserID
    }, httpOptions);
  }


  generateAppCode(id){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/generateAppCode/index.php',{
      idMember:id
    }, httpOptions);
  }

  addNewMember(fullname,email,phone,addDate,idplan,reduction,sex,reste){
    
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/addNewMember/index.php',{
      "fullname":fullname,
      "email":email,
      "phone":phone,
      "addDate":addDate,
      "idPlan":idplan,
      "reduction":reduction,
      "sex":sex,
      "reste":reste
    }, httpOptions);
  }



  getGymPlans(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      }),
      
    };
    return this.http.get<any>(this.url+'/API/gym/getPricingPlans/index.php', httpOptions);
  }


  updateMemberPhoto(data:FormData){
    let adminAccessToken = window.localStorage.getItem('token');
    return this.http.post<any>(this.url+'/API/members/updateProfileAvatar/index.php',data,{
      headers:new HttpHeaders({
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    });
  }

  archiveMembre(idMembre){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/archiveMembre/index.php',{
      "idMembre":idMembre,
    }, httpOptions);
  }

  unarchiveMembre(idMembre){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/unarchiveMembre/index.php',{
      "idMembre":idMembre,
    }, httpOptions);
  }

  renewelMembre(idMembre,newDate){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/updateMemberSubscription/index.php',{
      "idMembre":idMembre,
      "newDate":newDate
    }, httpOptions);
  }


  sendVerificationMail(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      }),
      
    };
    return this.http.get<any>(this.url+'/API/gym/sendVerificationMail/index.php', httpOptions);
  }

  updateMemberData(idMembre,fullname,phone,idplan,reduction,sex,addDate,reste,workoutplan,dietPlan){

    console.log("workout plan is",workoutplan);
    
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/updateMembreData/index.php',{
      "idMember":idMembre,
      "fullname":fullname,
      "phone":phone,
      "idPlan":idplan,
      "reduction":reduction,
      "sex":sex,
      "addDate":addDate,
      "reste":reste,
      "workoutplan":workoutplan,
      "dietPlan":dietPlan
    }, httpOptions);
  }


  deleteMemberFromGym(id){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/members/deleteMemberFromGym/index.php',{
      "idMember":id,
    }, httpOptions);
  }

  addNewMachineOperation(id,title,description,date,amount){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/machines/newMachineOperation/index.php',{
      "idMachine":id,
      "title":title,
      "description":description,
      "date":date,
      "amount":amount
    }, httpOptions);
  }



  addNewMachine(name,date){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/machines/addNewMachine/index.php',{
      "name":name,
      "date":date
    }, httpOptions);
  }


  deleteMachine(id){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/machines/deleteMachine/index.php',{
      "idMachine":id,
    }, httpOptions);
  }

  deleteTransaction(id){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/deleteTransaction/index.php',{
      "id":id
      
    }, httpOptions);
  }


  newFinancialOperartion(title,description,amount){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/newFinancialOperation/index.php',{
      "title":title,
      "description":description,
      "amount":amount,
      
    }, httpOptions);
  }


  updateMemberpayment(id,title,description,amount){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/updateMemberpayment/index.php',{
      "id":id,
      "title":title,
      "description":description,
      "amount":amount,
      
    }, httpOptions);
  }


  
  getMachinesList(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      }),
      
    };
    return this.http.get<any>(this.url+'/API/machines/getGymMachines/index.php', httpOptions);
  }


  
  getFinancialStat(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      }),
      
    };
    return this.http.get<any>(this.url+'/API/gym/getFinancialData/index.php', httpOptions);
  }


  addNewGymPlan(name,duration,price){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/addNewGymPlan/index.php',{
      "name":name,
      "duration":duration,
      "price":price,
      
    }, httpOptions);
  }


  deleteGymPlan(id){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.post<any>(this.url+'/API/gym/deleteGymPlan/index.php',{
      "id_plan":id,
      
    }, httpOptions);
  }

  




  

}
