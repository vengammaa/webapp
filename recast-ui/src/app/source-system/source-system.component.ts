import { Component, OnInit, Output,Input,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {StepperUiComponent} from '../stepper-ui/stepper-ui.component';
import { MatStepper } from '@angular/material/stepper';
import {GlobalConstants} from '../common/GlobalConstants';
@Component({
  selector: 'app-source-system',
  templateUrl: './source-system.component.html',
  styleUrls: ['./source-system.component.css']
})
export class SourceSystemComponent implements OnInit {


  sourceBtn:string = "TABLEAU";
  isDisabled: boolean = false;

  constructor() { 
    //alert("Source system constructor")
  }

  ngOnInit():void {
  //alert("Source System on init") 
  }

  ngDoCheck(): void {
    if (GlobalConstants.globalFlagStep1 === 0) {
      GlobalConstants.globalFlagStep1 = 1;
      this.sourceBtn = "TABLEAU";
      this.isDisabled = true;
    }
  }

  setSourceSystem(): void {
    this.isDisabled = false;
  }

    getSource() : void {
      GlobalConstants.reportTypeConst = this.sourceBtn;
      console.log(GlobalConstants.reportTypeConst);

    }

  goForward(stepper: MatStepper){
    stepper.next();
}


}
