import { Component, OnInit, ViewChild,EventEmitter,Input,Output,ViewEncapsulation } from '@angular/core';
import { SourceSystemComponent } from '../source-system/source-system.component';
import {ConnectionParamComponent} from '../connection-param/connection-param.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ConnectionService } from '../services/connection.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ReportsService } from '../services/reports.service';
import {GlobalConstants} from '../common/GlobalConstants';

import{CdkStep} from '@angular/cdk/stepper'

@Component({
  selector: 'app-stepper-ui',
  templateUrl: './stepper-ui.component.html',
  styleUrls: ['./stepper-ui.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StepperUiComponent implements OnInit {
  isLinear = false;
  tasks: any = [];

  @ViewChild('SourceSystemComponent') sourceSystemComponent!:SourceSystemComponent;
  @ViewChild('ConnectionParamComponent') connectionParamComponent!:ConnectionParamComponent;
  @ViewChild('stepper') private myStepper: MatStepper;
  @Output() msgToSibling2  = new EventEmitter<any>();
  //sourceSystemData:any;

  constructor(private formBuilder: FormBuilder,public connObj: ConnectionService, private reportServ: ReportsService) { 
 //   alert("Constructor stepper ui")
  }

  ngOnInit(): void {
   // alert("Stepper ui on init")
    
  }



  ngAfterViewInit() {
    // child is set
   // this.connectionParamComponent.doSomething();
  }

  /* fwdMsgToSib2($event:any) 
  {
     alert("message");
     this.sourceSystemData = $event;
  } */


  /* selectionChange(event: StepperSelectionEvent) {
  //  alert(event.selectedStep.label);
  
    let stepLabel = event.selectedStep.label
    if (stepLabel == "Set Connection Parameters") {
    let myCompOneObj = new ConnectionParamComponent(this.formBuilder,this.connObj);
    myCompOneObj.fetchData();
  }

  } */


  selectionChange(event: any){
    // alert("In selection change")
    if (event.selectedIndex === 2 && event.previouslySelectedIndex === 1) {
      if (GlobalConstants.shouldSkipStepForPath) {
        setTimeout(()=> this.goForward(), 1);
      }
      GlobalConstants.globalFlag = 0;
      GlobalConstants.globalFlagReportSel = 0;
    }
    else if (event.selectedIndex === 2 && event.previouslySelectedIndex === 3) {
      if (GlobalConstants.shouldSkipStepForPath) {
        setTimeout(()=> this.goBack(), 1);
      }
      GlobalConstants.globalFlagReportSel = 0;
      GlobalConstants.globalFlagStep2 = 0;
    } 
    else if (event.selectedIndex === 4 && event.previouslySelectedIndex === 3) {
      GlobalConstants.globalFlagStep5 = 0;
      GlobalConstants.globalFlagCharts = 0;
    } else if (event.selectedIndex === 1 && event.previouslySelectedIndex === 0) {
      GlobalConstants.globalFlagStep2 = 0;
    } else if (event.selectedIndex === 4 && event.previouslySelectedIndex === 5) {
      setTimeout(() => this.moveRoute(), 10);
    }
    else if (event.selectedIndex === 0 && event.previouslySelectedIndex === 1) {
      GlobalConstants.globalFlagStep1 = 0;
    }
    console.log(event);
  }

  moveRoute() {
    // console.log("stepper component " + GlobalConstants.globalFinishCase);
    if (GlobalConstants.globalFinishCase === "SOURCESYS") {
      setTimeout(()=> this.goBack(), 0.1);
      setTimeout(()=> this.goBack(), 0.1);
      setTimeout(()=> this.goBack(), 0.1);
      setTimeout(()=> this.goBack(), 0.1);
      // console.log("inside source");
      return;
    }
    setTimeout(()=> this.goBack(), 0.1);
    // console.log("inside report");
  }

  nextClicked(event:any) {
    // complete the current step
    // alert("Next Clicked")
    this.myStepper.selected.completed = true;
    // move to next step
    this.myStepper.next();
  }

  goForward(){
    this.myStepper.next();
  }

  goBack(){
    this.myStepper.previous();
  }

}
