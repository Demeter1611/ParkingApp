import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url='http://localhost:4001/user'
  TOKEN_LOCAL_STORAGE_KEY = "token"
  USER_DETAILS_LOCAL_STORAGE_KEY = "userDetails"

  async submitLoginRequest(data: any){
    try{
      const response = await fetch(`${this.url}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

      if(!response.ok){
        return { error: "Invalid credentials!" };
      }

      localStorage.setItem(this.TOKEN_LOCAL_STORAGE_KEY, response.headers.get('Authorization') || '');
      const body = await response.json();
      localStorage.setItem(this.USER_DETAILS_LOCAL_STORAGE_KEY, JSON.stringify(body));
      return body;

    } catch(err){
    console.error(err);
    }
  }

  async submitRegisterRequest(data: any){
    try{
      const response = await fetch(`${this.url}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })

      return await response.json();
    } catch(err){
      console.error(err);
    }
  }

  logout(){
    localStorage.removeItem(this.TOKEN_LOCAL_STORAGE_KEY);
    localStorage.removeItem(this.USER_DETAILS_LOCAL_STORAGE_KEY);
  }

  isAuthenticated(){
    return localStorage.getItem(this.TOKEN_LOCAL_STORAGE_KEY) != null && localStorage.getItem(this.USER_DETAILS_LOCAL_STORAGE_KEY) != null;
  }
  get user(){
    const userData = localStorage.getItem(this.USER_DETAILS_LOCAL_STORAGE_KEY);
    if(!userData || userData === undefined){
      return null;
    }
    try{
      return JSON.parse(userData);
    } catch(e){
      console.error('Could not parse userdata', e);
      return null;
    }
  }

  get id(){
    return this.user?.id;
  }

  get userEmail() {
    return this.user?.email;
  }

  get userUsername(){
    return this.user?.username;
  }

  get userRole() {
    return this.user?.role?.display;
  }

  get token() {
    return localStorage.getItem(this.TOKEN_LOCAL_STORAGE_KEY);
  }

}
