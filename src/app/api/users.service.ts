import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

   private url:String;

  constructor(private http:HttpClient) {
    this.url=environment.apiEndPoint;
  }


  createNewAdmin(fullname, email, password, phone):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1'
      })
    };
    return this.http.post<any>(this.url+'/API/users/createAdmin/index.php', {
      fullname: fullname,
      email: email,
      password: password,
      phone: phone

    }, httpOptions);

  }


  authAdmin(email,password):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1'
      })
    };
    return this.http.post<any>(this.url+'/API/users/authAdmin/index.php', {
      email:email,
      password:password

    }, httpOptions);

  }


  getAdminDetails(){
    let adminAccessToken = window.localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'gympro-token':  'yytgsfrahjuiplns2sutags4poshn1',
        'gympro-admin-token':adminAccessToken
      })
    };
    return this.http.get<any>(this.url+'/API/users/detailsAdmin/index.php', httpOptions);
  }

  openSessionUsingToken(token){
    window.localStorage.setItem('token',token);
  }


  isConnected(){
    if (window.localStorage.getItem('token')!=null) {
      return true;
    }

    return false;
  }



}
