import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient ,HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  url:string = environment.baseUrl + 'reports/';


  constructor(private http:HttpClient) { }

  getTasks(pid:any){
    return this.http.get(this.url + "getTasks/" + pid)
  }

  deleteTask(id:any){
    return this.http.delete(environment.baseUrl + "analyzer/removeTasks/" + id)
  }

  addTask(data:any){
    return this.http.post(environment.baseUrl + "analyzer/addTask",data)
  }

  getCommonality(id:any){
    return this.http.get(environment.baseUrl + "analyzer/" + id + "/Commonality")
  }

  getReportUserCount(id:any){
    return this.http.get(environment.baseUrl + "analyzer/reportUser/count/" + id)
  }

  getUniverseCount(id: any) {
    return this.http.get(environment.baseUrl + "analyzer/universe/count/" + id)
  }

  getTaskStatusInfo(id:any){
    const promise = this.http.get(environment.baseUrl + "analyzer/" + id).toPromise();
    return promise;
  }

  getUniverseData(id:any){
    const promise = this.http.get(environment.baseUrl + "analyzer/" + id + "/universe").toPromise();
    return promise;
  }

  getReportDetails(taskId:any) {
    const promise = this.http.get(environment.baseUrl + "analyzer/" + taskId + "/tableauReportDetails").toPromise();
    return promise;
  }

  getReportExport(taskId:any) {
    const promise = this.http.get(environment.baseUrl + "analyzer/" + taskId + "/tableauReportExport").toPromise();
    return promise;
  }

  getPythonCodeCalled() {
    return this.http.get(this.url + "pythonCall", {responseType: "text"});
  }
}
