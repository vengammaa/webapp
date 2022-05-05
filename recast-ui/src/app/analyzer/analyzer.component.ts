import { Component, Injectable, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ReportsService } from '../services/reports.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription, interval, BehaviorSubject } from 'rxjs';
import {ProjectServiceService} from '../services/project-service.service';
import {GlobalConstants} from '../common/GlobalConstants';
// @ts-ignore
import * as Excel from "exceljs/dist/exceljs.min.js";
// @ts-ignore
import * as FileSaver from 'file-saver';
declare var jQuery: any;

@Component({
  selector: 'app-analyzer',
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.css'],
  // providers: [ChecklistDatabase]
})
export class AnalyzerComponent implements OnInit {

  connectionName:any;
  reportType:any
  projectId!: string;
  projName!:String;
  tasks: any = [];
  taskName: string;
  taskNameList: any = [];
  taskIdToBeDeleted: number;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  showList: boolean = true;

  failedTaskName:string;
  failureReason:string ;
  dataNotAvailable:boolean = false;

  showTaskDetails: boolean = false;
  showConnections: boolean = false;
  showFailedTasks:boolean = false;

  newTaskForm: FormGroup;
  showalert: boolean = false;

  isDisabled: boolean = true;
  isTaskStatusSubmitted : boolean = false;

  //Metadata Variables
  taskStatusInfo:any = [];
  workbookInfo: any = [];
  taskId:any = '';
  reportInformation: any = [];
  finalList: any = [];
  exportDataList: any = [];

  //TDS Metadata Variables
  universeData: any = [];

  //Error handling
  errorMessage: boolean = false;
  taskErrorMessage: string = "";

  constructor(private formBuilder: FormBuilder, private reportServ: ReportsService, private projServiceObj: ProjectServiceService) { 
    //alert("Constructor of Analyzer")
     this.newTaskForm = this.formBuilder.group({

      'name': ['',Validators.required],
      'reportType':[],
      'connections': []
    });
    
  }

  ngDoCheck() {
    if (GlobalConstants.globalFlag === 0) {
      this.connectionName=GlobalConstants.globalConnectionName;
      this.reportType = GlobalConstants.reportTypeConst; 
      this.projectId=GlobalConstants.globalProjectId;
      this.projName=GlobalConstants.globalProjectName;
      this.isDisabled = true;
      this.getAddedTasks();
    }
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
 }
  ngOnInit(): void {
    //alert("ng on init of analyzer screen")
   //this.getAllReports();
   
   this.connectionName=GlobalConstants.globalConnectionName;
   this.reportType = GlobalConstants.reportTypeConst; 
   this.projectId=GlobalConstants.globalProjectId;
   this.projName=GlobalConstants.globalProjectName;

  //  this.getAddedTasks();
  // this.getProjectDetailsByID();
   this.dtOptions = {
     pagingType: 'full_numbers',
     processing: true,
     jQueryUI: true,
      dom: "lfBrtip",
      drawCallback: function(oSetting: any) {
        $('input').filter(':radio').prop('checked', false);
        $('#metadataBtn').prop('disabled', true);
      }
   }    

  //  this.populateDummyData([]);
  //  this.populateHeaders();

  }

  getAddedTasks() {
    //  alert(this.projectId);
   // alert("Added task called by refresh");
    //this.projectId="10001";
    //alert(this.projectId);
    this.isDisabled = true;
    GlobalConstants.globalFlag = 1;
      this.reportServ.getTasks(this.projectId).subscribe(resp => {
        this.tasks = [];
        this.taskNameList = [];
       // this.tasks = resp as string[];

      
        for (let data of resp as string[]) {
        //  alert(data['reportTypeCode']+" Global Report type:"+GlobalConstants.reportTypeConst)
          if(data['reportTypeCode']==GlobalConstants.reportTypeConst && data['projectReportConId']==GlobalConstants.globalConnectionId)
          {
            this.tasks.push(data);
            this.taskNameList.push(data['taskName']);
          }
        }

        console.log(this.taskNameList);
        console.log(this.tasks);
        this.rerender();
      },
        errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)))
    }

    rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
         dtInstance.destroy();
         this.dtTrigger.next();     
     });
    }

    openModal(data:any) {
      //alert(data.taskName)
      this.isTaskStatusSubmitted = false;
      this.taskName = data.taskName;
      this.taskIdToBeDeleted = data.id;
      if (data.taskStatus.code === 'SUB') {
        this.isTaskStatusSubmitted = true;
      }
      
    }

    clearField() {
      this.taskName = " ";
    }
  
    deleteTask() {
      this.reportServ.deleteTask(this.taskIdToBeDeleted).subscribe(resp => {
        this.getAddedTasks();
        jQuery('#deleteConfirmation').modal('hide');
      },
        errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)))
    }


    showFailedTasksSection(data:any){
      console.log(data.comment);

      if (data.comment == null) {
        this.failureReason = 'Error in adding task because of connection issue!';
      } else {
        this.failureReason = data.comment;
      }

      this.failedTaskName = data.taskName;
      this.showList = false;
      this.showTaskDetails = false;
      this.showConnections = false;
      this.showFailedTasks = true;
    }

    clearForm() {
      this.showalert = false;
      this.errorMessage = false;
      this.newTaskForm.reset();
    }

    onDismissError() {
      this.errorMessage = false;
    }

    onSubmit() {
      if (GlobalConstants.globalReportsList.length === 0 && !GlobalConstants.shouldSkipStepForPath) {
        this.newTaskForm.reset();
        this.taskErrorMessage = 'Please select report(s) in the previous step!';
        this.errorMessage = true;
        return;
      }

      if (GlobalConstants.shouldSkipStepForPath) {
        let obj = {'reportid': 'local', 'reportname': 'local', 'path': 'local', 'universes': ['local'] };
        GlobalConstants.globalReportsList = [obj];
      }

      let formData = this.newTaskForm.value;
      
      // var regex = new RegExp( this.taskNameList.join( "|" ), "i");

      if (formData.name.trim() == null || formData.name.trim() == "") {
        this.newTaskForm.reset();
        this.taskErrorMessage = 'Please enter the task name!';
        this.errorMessage = true;
        return;
      } else if (/^\d+$/.test(formData.name.trim()) || /^[^a-zA-Z0-9]+$/.test(formData.name.trim())) {
        this.newTaskForm.reset();
        this.taskErrorMessage = 'Please enter valid task name!';
        this.errorMessage = true;
        return;
      } 
      else if (this.taskNameList.length !== 0) {
        if (this.taskNameList.includes(formData.name.trim())) {
          this.taskErrorMessage = 'Please enter different task name!';
          this.errorMessage = true;
          this.newTaskForm.reset();
          return;
        }
      }

      let data = {
        "projectId": this.projectId,
        "reportTypeCode": this.reportType,
        "projectReportConId": GlobalConstants.globalConnectionId,
        "taskName": formData.name.trim(),
        "taskStatus": {
          "code": "SUB"
        },
        "selectedReportsList": GlobalConstants.globalReportsList
  
      }

      console.log(data);
      this.reportServ.addTask(data).subscribe(resp => {
        this.newTaskForm.reset();
        jQuery('#newTask').modal('hide');
        setTimeout(() => this.getAddedTasks(), 100);
      },
        erroCode => console.log("Error while adding task" + JSON.stringify(erroCode)))
    }

    hideForm() {
      this.showList = true;
      this.showConnections = false;
      this.showTaskDetails = false;
      this.showFailedTasks = false;
     // this.getAddedTasks();
    }



  async setTaskId(e:any,data:any)
  {
    //alert("In change event of radio button"+data);
    jQuery('#task-loading').modal('show');
    GlobalConstants.globalTask=data;
    this.taskId = data.id;
    // GlobalConstants.globalFlagStep2 = 0;
    if (data.taskStatus.code !== "SUB" && data.taskStatus.code !== "FAIL") {
        if (GlobalConstants.globalTabExtractType == 'tds')
        {
          await this.getUniverseData();
        } else {
          await this.getTaskDetails();
          await this.getReportDetails();
          // await this.getReportExport();
        }
        setTimeout(() => {
          this.isDisabled = false;
          $('#metadataBtn').prop('disabled', false);
        }, 50);
        setTimeout(() => jQuery('#task-loading').modal('hide'), 1000);
    } else {
      this.isDisabled = true;
      setTimeout(() => jQuery('#task-loading').modal('hide'), 1000);
    }
    jQuery('#task-loading').modal('hide');
  // GlobalConstants.globalConnectionId=data.id;
  //alert(GlobalConstants.globalConnectionName+" "+GlobalConstants.globalConnectionId)
  }

  //Metadata Extraction

  async getTaskDetails() {
    this.reportServ.getTaskStatusInfo(this.taskId).then(resp => {
      this.taskStatusInfo = [];
      this.workbookInfo = [];
      this.taskStatusInfo = resp as string[];

      console.log(this.taskStatusInfo);

      if (this.taskStatusInfo.length == 0) {
        this.dataNotAvailable = true;
      }
      else {
        this.dataNotAvailable = false;
        for (let task of this.taskStatusInfo) {
          if (this.workbookInfo.length == 0) {
            this.workbookInfo.push({workbookName: task.workbookName, folderPath: [task.folderPath], universes: [task.universeName]});
          } else {
            let flag = 0;
            for (let w of this.workbookInfo) {
              if (w.workbookName == task.workbookName) {
                let f = w.folderPath.includes(task.folderPath) ? [...w.folderPath] : [...w.folderPath, task.folderPath];
                let u = w.universes.includes(task.universeName) ? [...w.universes] : [...w.universes, task.universeName];
                w.folderPath = f;
                w.universes = u;
                flag = 1;
                break;
              }
            }
            if (flag == 0) {
              this.workbookInfo.push({workbookName: task.workbookName, folderPath: [task.folderPath], universes: [task.universeName]});
            }
          }
        }

        console.log(this.workbookInfo);
      }

    },
    errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)))
  }

  // async getReportExport() {
  //   this.reportServ.getReportExport(this.taskId).then(resp => {
  //     let reportExport = resp;
  //     this.reportInformation = [];
  //     this.taskStatusInfo = [];
  //     this.reportInformation = reportExport['analysisDetails'] as string[];
  //     this.taskStatusInfo = reportExport['reportDetails'] as string[];

  //     console.log(this.reportInformation);
  //     console.log(this.taskStatusInfo);
  //   });
  // }

  async getReportDetails() {
    this.reportServ.getReportDetails(this.taskId).then(resp => {
      this.reportInformation = [];
      this.reportInformation = resp as string[];
      console.log(this.reportInformation);
      
    },
    errorCode => console.log("error while fetching report details" + JSON.stringify(errorCode)));
  }

  async getUniverseData() {
    this.reportServ.getUniverseData(this.taskId).then(resp => {
      this.universeData = [];
      this.universeData = resp as string[];
      console.log(this.universeData);
    },
    errorCode => console.log("error while fetching universe details" + JSON.stringify(errorCode)));
  }

  infoExtract()
  {
    if (GlobalConstants.globalTabExtractType == 'tds') {
      this.datasourceDetailInfo();
    } else {
      this.reportDetailInfo();
    }
  }

  datasourceDetailInfo() {
    let finalDatasourceList = [];

    for (let data of this.universeData)
    {
      let columnsList = [];
      if (JSON.parse(data.tables))
      {
        for (let tbl of JSON.parse(data.tables))
        {
          for (let c of tbl.columns)
          {
            columnsList.push({columnName: c.name, dataType: c.dataType, formula: '', tableName: tbl.name, dbName: data.dbName});
          }
        }
      }
      if (JSON.parse(data.items).measures)
      {
        for (let m of JSON.parse(data.items).measures)
        {
          columnsList.push({columnName: m.name, dataType: m.dataType, formula: m.formula, tableName: '', dbName: ''});
        }
      }
      if (JSON.parse(data.items).dimensions)
      {
        for (let d of JSON.parse(data.items).dimensions)
        {
          columnsList.push({columnName: d.name, dataType: d.dataType, formula: d.formula, tableName: '', dbName: ''});
        }
      }
      finalDatasourceList.push({databaseName: data.name, columns: columnsList, datasourceName: data.connectionClass, dbName: data.dbName});
    }
    
    this.exportCompleteTDSInfo(finalDatasourceList);
  }

  reportDetailInfo() {
    this.finalList = [];
    let workbookList : any = [];

    for (let task of this.taskStatusInfo) {
      let cols = task.columnNames.substring(1, task.columnNames.length-1);
      let colsArr = cols.split(', ');
      let colList = [];
      for (let colName of colsArr) {
        if (this.isKeyPresent(this.reportInformation, colName)) {
          let index = this.reportInformation.findIndex((obj:any) => obj.columnName === colName && obj.datasourceName === task.universeName);
          if (index == -1) {
            let unvArr = task.universeName.split(', ');
            for (let unv of unvArr) {
              // console.log('unv : ' + unv);
              index = this.reportInformation.findIndex((obj:any) => obj.columnName === colName && obj.datasourceName === unv);
              if (index !== -1) break;
            }
            // console.log('fnd ind: ' + index);
          }

          if (index !== -1) {
            let obj = {
              columnName: colName,
              datasourceName: this.reportInformation[index].dbName,
              tableName: this.reportInformation[index].tableName,
              dataType: this.reportInformation[index].dataType,
              connectionClass: this.reportInformation[index].connectionClass,
              expression: ''
            };
            colList.push(obj);
          }
          
        } else {
          for(let v of JSON.parse(task.variableList)){
            if (v.formulaLanguageId == colName) {
              let expression = v.definition;
              let dataType = v.dataType;
              colList.push({columnName: colName, datasourceName: '', tableName: '', connectionClass: '', expression: expression, dataType: dataType});
            }
          }
        }
      }
      let fObj = {
        worksheetName: task.reportName,
        columnsInfo: colList,
        workbookName: task.workbookName
      }
      this.finalList.push(fObj);

      if (!workbookList.includes(task.workbookName)) {
        workbookList.push(task.workbookName);
      }
      
    }
    console.log(this.finalList);

    this.exportDataList = [];

    for (let data of this.finalList) {
      this.exportDataList = this.addDataToWrkbk(this.exportDataList, data.workbookName, data);
    }

    console.log(this.exportDataList);

    this.exportCompleteRptInfo();

  }

  isKeyPresent(arr : any, name: string) {
    let found = arr.some((el:any) => el.columnName === name);
    if (!found) return false;
    return true;
  }

  addDataToWrkbk(arr : any, name: string, completeInfoObj: any) {
    let { length } = arr;
    let found = arr.some((el:any) => el.workbookName === name);
    if (!found) {
      let obj = {
        workbookName: name,
        workbookInfo: [completeInfoObj]
      }
      arr.push(obj);
    } else {
      let index = arr.map(function(e : any) { return e.workbookName; }).indexOf(name);
      let wkInfo = [...arr[index].workbookInfo, completeInfoObj];
      arr[index].workbookInfo = wkInfo;
    }
    return arr;
  }

  exportCompleteTDSInfo(finalDatasourceList: any) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    let fileName = "Datasource(s)_Information " + dateTime + ".xlsx";
    let workbook = new Excel.Workbook();
    let ds_details = workbook.addWorksheet('Datasource(s) Information');

    ds_details.columns = [
      // { header: 'Database Name', key: 'db_name' },
      // { header: 'Column Name', key: 'col_name' },
      // { header: 'Datatype', key: 'datatype' },
      // { header: 'Expression', key: 'expr' },
      // { header: 'Table Name', key: 'table_name' },
      // { header: 'Datasource Name', key: 'ds_name'},
      { header: 'Workbook Name', key: 'wrk_book_name' },
      { header: 'Worksheet Name', key: 'wrk_sht_name' },
      { header: 'Column Name', key: 'col_name' },
      { header: 'Datatype', key: 'dtype' },
      { header: 'Expression', key: 'expr' },
      { header: 'Table Name', key: 'table_name' },
      { header: 'Database Name', key: 'ds_name' },
      { header: 'Datasource Name', key: 'ds_name'},
    ];

    for (let data of finalDatasourceList)
    {
      ds_details.addRow([data['databaseName'], '', '', '', '', '', '', '']);
      for (let col of data.columns)
      {
        ds_details.addRow(['', '', col.columnName.substring(1, col.columnName.length-1), col.dataType, col.formula, col.tableName, data.dbName, data.datasourceName]);
      }
    }

    ds_details.columns.forEach(function (column:any, i:any) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell:any) {
          var columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength ) {
              maxLength = columnLength;
          }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    let headerrow1 = ds_details.getRow(1);
    this.setExcelSheetHeaders(headerrow1)

    workbook.xlsx.writeBuffer().then((data:any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, fileName);
    });

  }

  exportCompleteRptInfo() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;


    let fileName = "Report(s)_Information " + dateTime + ".xlsx";
    let workbook = new Excel.Workbook();
    let report_details = workbook.addWorksheet('Report(s) Information');

    report_details.columns = [
      {header: 'Workbook Name', key: 'wrkbk_name'},
      { header: 'Worksheet Name', key: 'wrksht_name' },
      { header: 'Column Name', key: 'col_name' },
      { header: 'Datatype', key: 'datatype' },
      { header: 'Expression', key: 'expr' },
      { header: 'Table Name', key: 'table_name' },
      { header: 'Database Name', key: 'db_name' },
      { header: 'Datasource Name', key: 'ds_name'},
    ];

    for (let data of this.exportDataList) {
      report_details.addRow([data.workbookName,'','', '', '', '', '', '']);
      for (let wrkshtInfo of data.workbookInfo) {
        report_details.addRow(['',wrkshtInfo.worksheetName,'', '', '', '', '', '']);
        for (let col of wrkshtInfo.columnsInfo) {
          report_details.addRow(['','', col.columnName.substring(1, col.columnName.length-1), col.dataType, col.expression, col.tableName.substring(1, col.tableName.length-1), col.datasourceName, col.connectionClass]);
        }
      }
    }

    report_details.columns.forEach(function (column:any, i:any) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell:any) {
          var columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength ) {
              maxLength = columnLength;
          }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    let headerrow1 = report_details.getRow(1);
    this.setExcelSheetHeaders(headerrow1)

    workbook.xlsx.writeBuffer().then((data:any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, fileName);
    });

  }

  setExcelSheetHeaders(row:any){
    row.font = { bold: true }
    row.alignment = { vertical: 'top', horizontal: 'left' };
    row.eachCell(function (cell:any, colNumber:any) {
      row.getCell(colNumber).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '074588' }
      };
      row.getCell(colNumber).font = {
        color: { argb: 'FFFFFFFF' }
      }
      row.getCell(colNumber).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

}
