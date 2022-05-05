import { Injectable } from '@angular/core';
import {HttpClient ,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  url:string = environment.baseUrl + 'connections/';
  constructor(private http:HttpClient) { }

    getAddedConnections(pid:String){
    console.log("In connection service");
    return this.http.get(this.url + "getConnections/" + pid);
   }

   getConnParams(code:any){
    return this.http.get(this.url + "params/" + code);
   }

   getAllConnnectionNames(){ 
    return this.http.get(this.url + "reportTypes");
   }

  //  testConnection(data: any){
  //   const body = JSON.stringify(data);
  //   const httpHeaders = new HttpHeaders({
  //     'Content-Type' : 'application/json'
  //  });
  //    return this.http.post(this.url + "testConnection", body, {headers:httpHeaders, responseType: 'text'});
  //  }

  tesConnection(connId: any, reportType: any) {
    return this.http.get(this.url + "testConnection/" + connId + "/" + reportType, {responseType: 'text'});
  }

   addConnection(pid:any,data:any){
    return this.http.post(this.url + "addConnection/" + pid,data);
   }

   deleteConnection(connId:any){
    return this.http.delete(this.url + "deleteConnection/" + connId,{responseType: 'text'});
   }

   getConnectionDetails(connId:any) {
    return this.http.get(this.url + "getConnectionDetails/" + connId);
  }
   editConnection(pid:any, connection:any) {
    return this.http.put(this.url + "editConnection/" + pid, connection);
  }
  getReportFolderStructure(connId: any, reportType: any) {
    return this.http.get(this.url + "reportPath/" + connId + "/" + reportType);
  }

  uploadFile(formData: FormData) {
    return this.http.post(this.url + "uploadFile", formData, {responseType: 'text'});
  }

}
