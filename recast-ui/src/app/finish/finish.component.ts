import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../common/GlobalConstants';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {

  finishBtn: any = "";

  constructor() { }

  ngOnInit(): void {
    this.finishBtn = "SOURCESYS";
  }

  setFinish() {
    GlobalConstants.globalFinishCase = this.finishBtn;
    // console.log("finish component: " + GlobalConstants.globalFinishCase);
  }

}
