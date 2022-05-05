import { Component, OnInit,SimpleChanges, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import {ReportsService} from '../services/reports.service';
import {ProjectServiceService} from '../services/project-service.service';
import {GlobalConstants} from '../common/GlobalConstants';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
// @ts-ignore
import * as Excel from "exceljs/dist/exceljs.min.js";
// @ts-ignore
import * as FileSaver from 'file-saver';
// @ts-ignore
import pdfMake from "pdfmake/build/pdfmake";  
// @ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts";  

pdfMake.vfs = pdfFonts.pdfMake.vfs;  
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  taskInfo:any = [];
  taskId: number;
  projectId: number;
  taskName: string;
  reportType:any;
  commonalityData: any = [];
  reportUserCountData: any[];
  reportUserDetails: any = [];
  reportInformation: any = {};
  reportInfoFor: any = [];
  finalList: any = [];
  exportDataList: any = [];

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject(); 
  dtTrigger1: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dtTrigger3: Subject<any> = new Subject();
  dtTrigger4: Subject<any> = new Subject();

  taskStatusInfo:any = [];
  workbookInfo: any = [];
  worksheetsStatusInfo: any = [];
  dataNotAvailable: boolean;
  universeData:any = [];
  showBOUniverse:boolean = false;
  showCognosUniverse:boolean=false;
  showTableauUniverse:boolean=false;
  showBOReport:boolean= false;
  showTableauReport:boolean= false;
  showCognosReport:boolean = false;  

  reportName: string;
  selectedWorkbookName: string = '';
  showTaskInfo: boolean = true;
  showWorkbookInfo: boolean = false;
  fullReportDetails:any = [];
  reportData:any = [];
  queryList: any[];
  totalSqlQueries: any;
  exceptionRptAvailable:boolean;

  exceptionReport:any = [];
 dataObjectsAvailable:boolean;
 queryListAvailable:boolean;
 variableList:any= [];
 reportObjectAvailable:boolean;
 tabList:any= [];
 reportDetails: any;
 queryListCognosDataFilter:any =[]
 queryListCognos:any;
 tableSet:any=[];
 showDataObjects:boolean = false;
 showReportObject:boolean = false;
 showQueryList:boolean = false;

 showUniverseTable:boolean = true;

 universeFolders:any= [];
 universeMeasures:any = [];
 universeAttributes:any = [];
 universeFilters:any= [];
 universeDimensions:any= [];
 universeTable:any= [];
 universeJoins:any= [];

  universeVariables:any=[];
  universeIdentifiers:any=[];
  universeFacts:any=[];

  showUnvMeasures:boolean = false;
  showUnvFolders:boolean = false;
  showUnvFilters:boolean = false;
  showUnvAttributes:boolean = false;
  showUnvDimensions:boolean = false;
  showUnvTables:boolean = false;
  showUnvJoins:boolean = false;

  //Code added for universe variables cognos
  showUnvVariables:boolean = false;
  showUnvIdentifiers:boolean =false;
  showUnvFacts:boolean = false;

  //code for tableau -- variables	
  isReportTypeTableau:boolean = false;
  tableauExpandColumn: boolean = false;
  tableauExpandTable: boolean = false;
  showQueryFilters: boolean = false;	
  columnInstanceData:any = [];

  constructor(private reportServ: ReportsService, private projServiceObj: ProjectServiceService) { 

  }

  ngDoCheck() {
    if (GlobalConstants.globalFlagStep5 === 0) {
      GlobalConstants.globalFlagStep5 = 1;
      this.projectId = GlobalConstants.globalProjectId;
      this.taskId = GlobalConstants.globalTask.id;
    // this.projectName = history.state.data.projectName;
      this.taskName = GlobalConstants.globalTask.taskName;
      this.reportType = GlobalConstants.reportTypeConst;
      this.taskInfo = GlobalConstants.globalTask;

      //alert(this.projectId);
      //alert(this.taskId);
      // alert(this.taskInfo['id']);
      this.isReportTypeTableau = false;
      if (this.reportType === 'TABLEAU') {
        this.isReportTypeTableau = true;	
      }
      
      this.getReportDetails();
      this.getCommanality();
      this.getTaskDetails();
      //this.getProjectDetailsByID();
      this.getUniverseDetails();
      this.checkReportTypes();
    }
  }

  ngOnInit(): void {
    //alert("On init")
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      destroy:true

    }
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    this.dtTrigger1.next();
    this.dtTrigger2.next();
    this.dtTrigger3.next();
    this.dtTrigger4.next();
 }

  getCommanality() {
    this.reportServ.getCommonality(this.taskId).subscribe(resp => {
      this.commonalityData = [];
      this.commonalityData = resp as string[];
      console.log("commonality: ");
      console.log(this.commonalityData);
      this.rerender();
    },
      errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)))
  }

  getTaskDetails() {
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
      
      this.rerender();

    },
    errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)))
  }

  showWorksheets(workbookName : any) {
    this.worksheetsStatusInfo = [];

    for (let task of this.taskStatusInfo) {
      if (task.workbookName == workbookName) {
        this.worksheetsStatusInfo.push(task);
      }
    }
  
    this.selectedWorkbookName = workbookName;

    this.showWorkbookInfo = true;
    this.showTaskInfo = false;
    this.rerender();
  }

  getReportDetails() {
    this.reportServ.getReportDetails(this.taskId).then(resp => {
      this.reportInformation = [];
      this.reportInfoFor = [];
      this.reportInformation = resp as string[];
      console.log(this.reportInformation);
      // for (let key in this.reportInformation) {
      //   let obj = {
      //     columnName : key,
      //     tableName: this.reportInformation[key].tableName,
      //     datasourceName: this.reportInformation[key].datasourceName,
      //     reportName: this.reportInformation[key].reportPath != null ? this.reportInformation[key].reportPath.substring(this.reportInformation[key].reportPath.lastIndexOf('/') + 1) : '' ,
      //     worksheets: this.reportInformation[key].worksheetName
      //   }
      //   this.reportInfoFor.push(obj);
      // }

      this.rerender();
      
    },
    errorCode => console.log("error while fetching report details" + JSON.stringify(errorCode)));
  }

  rerender(): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
      });
    });
    this.dtTrigger.next();
    this.dtTrigger1.next();
    this.dtTrigger2.next();
    this.dtTrigger3.next();
    this.dtTrigger4.next();
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.destroy();
    //   this.dtTrigger.next();
    // });
  }

  reportDetailInfo() {
    this.finalList = [];
    let workbookList : any = [];

    for (let task of this.taskStatusInfo) {
      let cols = task.columnNames.substring(1, task.columnNames.length-1);;
      let colsArr = cols.split(', ');
      let colList = [];
      for (let colName of colsArr) {
        if (this.isKeyPresent(this.reportInformation, colName)) {
          let index = this.reportInformation.findIndex((obj:any) => obj.columnName === colName && obj.datasourceName === task.universeName);
          if (index == -1) {
            console.log('colName: ' + colName);
            console.log('task unv: ' + task.universeName);
            let unvArr = task.universeName.split(', ');
            for (let unv of unvArr) {
              console.log('unv : ' + unv);
              index = this.reportInformation.findIndex((obj:any) => obj.columnName === colName && obj.datasourceName === unv);
              if (index !== -1) break;
            }
            console.log('fnd ind: ' + index);
          }

          let obj = {
            columnName: colName,
            datasourceName: this.reportInformation[index].datasourceName,
            tableName: this.reportInformation[index].tableName,
            dataType: this.reportInformation[index].dataType,
            expression: ''
          };
          colList.push(obj);
        } else {
          for(let v of JSON.parse(task.variableList)){
            if (v.formulaLanguageId == colName) {
              let expression = v.definition;
              let dataType = v.dataType;
              colList.push({columnName: colName, datasourceName: '', tableName: '', expression: expression, dataType: dataType});
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

  isKeyPresent(arr : any, name: string) {
    let found = arr.some((el:any) => el.columnName === name);
    if (!found) return false;
    return true;
  }

  getUniverseDetails(){
    this.reportServ.getUniverseData(this.taskId).then(resp => {
      this.universeData = [];
      this.universeData = resp as string[];
      console.log(this.universeData);
      this.rerender();
    },
      errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)))
  }

    checkReportTypes()
  {
    //alert("Report types:"+this.reportType);
    if(this.reportType=="BO")
    {
      this.showBOUniverse=true;
      this.showBOReport=true;
      //alert(this.showBOUniverse);
    }
    else if (this.reportType=='TABLEAU')
    {
      this.showTableauUniverse = true;
      this.showTableauReport=true;
    }
    else if (this.reportType=="COGNOS")
    {
      this.showCognosUniverse=true;
      this.showCognosReport=true;
    // alert(this.showCognosUniverse);
    }
  }

  downloadPDF(){
    this.generatePDF()
     //alert("Download PDF Called")
   }


   public generatePDF():void {
    let dd = {};
    let universe:any = [];
    let reports:any = [];
  
    if(this.reportType=="BO")
    {
      universe = this.generateUniverseDataBO();
      reports = this.generateReportDetailsNode();
    }
    else if(this.reportType=="COGNOS")
    {
      universe = this.generateUniverseDataCognos();
      reports = this.generateReportDetailsNodeCognos();
    }
    else if (this.reportType == "TABLEAU") {
      reports = this.generateReportsDetailsNodeTableau();
      console.log(reports);
      this.completeReportsDetailsTableau(reports);
      return;
    }
   
    
      let commonality = [];
      let taskInfo = [];
      let universeData = [];
      var taskData = [];
      //generate task data
      taskData = [{
        'ID':this.taskInfo['id'],
        'Name':this.taskInfo['taskName'],
        'Report Type':this.taskInfo['reportTypeCode'],
        'Status':this.taskInfo['taskStatus'].name
      }]
      //generate report array
      for(let task of this.taskStatusInfo){
        taskInfo.push({
          'Report Id':task.reportId == undefined?0:task.reportId ,
          'Report Name':task.reportName,
          'Report Type':task.reportType,
          'Report Creation Date':task.reportCreationDate,
          'Report Updated Date':task.reportUpdatedDate,
          'Report User':task.reportUser,
          'Report Published':task.reportPublished,
          'Report Scheduled':task.reportScheduled,
          'Actively Used':task.activelyUsed,
          'Avg. Runtime':task.averageRunTime, 
          'Folder Path':task.folderPath,
          'No Of Blocks':task.numberOfBlocks, 
          'No Of Columns':task.numberOfColumns,
          'No Of Conditional Blocks':task.numberOfConditionalBlocks,
          'No Of Failures':task.numberOfFailures, 
          'No Of Filters':task.numberOfFilters,
          'No Of Formulas':task.numberOfFormulas,
          'No Of Instances':task.numberOfInstances,
          'No Of Query':task.numberOfQuery,
          'No Of Recurring Instances' :task.numberOfRecurringInstances,
          'No Of ReportPages':task.numberOfReportPages,
          'No Of Rows' :task.numberOfRows,
          'No Of Tabs':task.numberOfTabs,  
          'No Of Variables':task.numberOfVariables,
          'No Of Images':task.numberOfImages,
          'No Of Embedded Elements':task.numberOfEmbeddedElements,      
          'Pivot Table Set':task.pivotTableSet,    
          'Chartset':task.chartSet == '[]' ? '':task.chartSet ,
          'Table ColumnMap':task.tableColumnMap,
          'Table Set':task.tableSet,      
          'Total Size':task.totalSize,
          'Total Universe Count':task.totalUniverseCount,
          'Universe Id':task.universeId,
          'Universe Name':task.universeName == undefined?'NA':task.universeName,
          'Universe Path':task.universePath == undefined?'NA':task.universePath,  
          'Commonality Factor':task.commonalityFactor ,
          'Complexity' :task.complexity
        })
       
      }
      //console.log(taskInfo)
        //generate commonality array
      if (this.reportType != "TABLEAU")
      {
        for(let data of this.commonalityData){
          commonality.push({ ID: data.id,
                             Report1 :data['analysisReport1'].reportName,
                             Report2 :data['analysisReport2'].reportName,
                             Commonality: data.commonality,
                             Identical: data.identical}
                        )
        }
     // console.log(commonality)
    //generate universe array
      for(let unv of this.universeData){
        universeData.push({'ID':unv.id,
                           'Name':unv.name,
                           'Description':unv.description,
                           'UniverseSourceId':unv.universeSourceId,
                           'Tables':unv.tables,
                           'Joins':unv.joins})
      }
     console.log(universeData.length)
      if(universeData.length > 0){  
       // console.log("unv data available")
              dd = {
  
                pageOrientation: 'landscape',
                pageSize: 'RA0',
                dontBreakRows: true,
                info: {
                  title: 'Recast - Report Migration Utility',
                  // author: 'john doe',
                  // subject: 'subject of document',
                  // keywords: 'keywords for document',
                  },
                header: {	text:'Recast - Report Migration Utility',style:'headerExample'},
               
                footer: {
                  columns: [
                    '©2020 Larsen and Toubro Infotech Limited',
                  ],
                  style:'footerExample'
                },
                content: [
                  {
                    text: this.taskInfo['taskName'] + 'Details',
                    alignment:'center',fontSize:24,bold:true
                  },
                  { text: 'Task Details', style: 'header' },      
                  this.table(taskData,['ID','Name','Report Type','Status']),
                  { text: 'Report List', style: 'header' },                
                  this.table(taskInfo, ['Report Id','Report Name','Report Type',
                                        'Report Creation Date','Report Updated Date',
                                        'Report User','Report Published','Report Scheduled','Actively Used','Avg. Runtime','Folder Path','No Of Blocks','No Of Columns','No Of Conditional Blocks', 'No Of Failures','No Of Filters', 'No Of Formulas', 'No Of Instances','No Of Query','No Of Recurring Instances','No Of ReportPages','No Of Rows','No Of Tabs',  
                    'No Of Variables', 'No Of Images','No Of Embedded Elements','Pivot Table Set','Chartset','Table ColumnMap','Table Set','Total Size' ,'Total Universe Count', 'Universe Id','Universe Name','Universe Path','Commonality Factor' ,'Complexity' ]),
                  { text: 'Commanality Details', style: 'header' },
                  this.table(commonality, ['ID','Report1','Report2','Commonality','Identical']),
                  { text: 'Universe List', style: 'header' },
                  this.table(universeData, ['ID','Name','Description','UniverseSourceId','Tables','Joins']),
                  { text: 'Report Details', style: 'header',pageBreak: 'before' },  
                   this.nestedTable(reports,['Report Name']),
                  { text: 'Universe Details', style: 'header',pageBreak: 'before' }, 
                  this.generateuniverseTable(universe,['Universe Name'])
                ],
                styles: {
                  headerExample:{
                  
                    fontSize: 14,
                    bold: true,
                    margin: [8, 5, 0, 25] // margin: [left, top, right, bottom]
                  },
                  footerExample:{
                    fontSize: 14,
                    bold: true,
                    margin: [8, 5, 0, 25] 
                  },
                  header: {
                    fontSize: 20,
                    bold: true,
                    
                    margin: [0, 10, 0, 5]
                  },
                  subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                  },
                  tableExample: {
                    margin: [0, 5, 0, 15]
                  },
                  tableHeader: {
  
                    bold: true,
                    fontSize: 13,
                   
                    color: 'red'
                  }
                },
              };
            }
            else{
              dd = {
                
                pageOrientation: 'landscape',
                pageSize: 'RA0',
                info: {
                  title: 'Recast - Report Migration Utility',
                  // author: 'john doe',
                  // subject: 'subject of document',
                  // keywords: 'keywords for document',
                  },
                header: {	text:'Recast - Report Migration Utility',style:'headerExample'},
               
                footer: {
                  columns: [
                    '©2020 Larsen and Toubro Infotech Limited',
                  ],
                  style:'footerExample'
                },
                content: [
                  
                  {
                    text: this.taskInfo['taskName'] + 'Details',
                    alignment:'center',fontSize:24,bold:true
                  },
                  { text: 'Task Details', style: 'header' },      
                  this.table(taskData,['ID','Name','Report Type','Status']),
                  { text: 'Report List', style: 'header' },                
                  this.table(taskInfo, ['Report Id','Report Name','Report Type',
                                        'Report Creation Date','Report Updated Date',
                                        'Report User','Report Published','Report Scheduled','Actively Used','Avg. Runtime','Folder Path','No Of Blocks','No Of Columns','No Of Conditional Blocks', 'No Of Failures','No Of Filters', 'No Of Formulas', 'No Of Instances','No Of Query','No Of Recurring Instances','No Of ReportPages','No Of Rows','No Of Tabs',  
                    'No Of Variables', 'No Of Images','No Of Embedded Elements','Pivot Table Set','Chartset','Table ColumnMap','Table Set','Total Size' ,'Total Universe Count', 'Universe Id','Universe Name','Universe Path','Commonality Factor' ,'Complexity' ]),
                  { text: 'Commanality Details', style: 'header'},
                  this.table(commonality, ['ID','Report1','Report2','Commonality','Identical']),
                 
                  { text: 'Report Details', style: 'header',pageBreak: 'before' },  
                   this.nestedTable(reports,['Report Name'])
                 
                ],
                
                styles: {
                  headerExample:{
                  
                    fontSize: 14,
                    bold: true,
                    margin: [8, 5, 0, 25] // margin: [left, top, right, bottom]
                  },
                  footerExample:{
                    fontSize: 14,
                    bold: true,
                    margin: [8, 5, 0, 25] 
                  },
                  header: {
                    fontSize: 20,
                    bold: true,
                    
                    margin: [0, 10, 0, 5]
                  },
                  subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                  },
                  tableExample: {
                    margin: [0, 5, 0, 15]
                  },
                  tableHeader: {
  
                    bold: true,
                    fontSize: 13,
                   
                    color: 'red'
                  }
                },
              };
            }
          }
          else
           {
            dd = {
                
              pageOrientation: 'landscape',
              pageSize: 'RA0',
              info: {
                title: 'Recast - Report Migration Utility',
                // author: 'john doe',
                // subject: 'subject of document',
                // keywords: 'keywords for document',
                },
              header: {	text:'Recast - Report Migration Utility',style:'headerExample'},
             
              footer: {
                columns: [
                  '©2020 Larsen and Toubro Infotech Limited',
                ],
                style:'footerExample'
              },
              content: [
                
                {
                  text: this.taskInfo['taskName'] + 'Details',
                  alignment:'center',fontSize:24,bold:true
                },
                { text: 'Task Details', style: 'header' },      
                this.table(taskData,['ID','Name','Report Type','Status']),
                { text: 'Report List', style: 'header' },                
                this.table(taskInfo, ['Report Id','Report Name','Report Type',
                                      'Report Creation Date','Report Updated Date',
                                      'Report User','Report Published','Report Scheduled','Actively Used','Avg. Runtime','Folder Path','No Of Blocks','No Of Columns','No Of Conditional Blocks', 'No Of Failures','No Of Filters', 'No Of Formulas', 'No Of Instances','No Of Query','No Of Recurring Instances','No Of ReportPages','No Of Rows','No Of Tabs',  
                  'No Of Variables', 'No Of Images','No Of Embedded Elements','Pivot Table Set','Chartset','Table ColumnMap','Table Set','Total Size' ,'Total Universe Count', 'Universe Id','Universe Name','Universe Path','Commonality Factor' ,'Complexity' ]),
              //  { text: 'Commanality Details', style: 'header'},
               // this.table(commonality, ['ID','Report1','Report2','Commonality','Identical']),
               
                { text: 'Report Details', style: 'header',pageBreak: 'before' },  
                 this.nestedTable(reports,['Report Name'])
               
              ],
              
              styles: {
                headerExample:{
                
                  fontSize: 14,
                  bold: true,
                  margin: [8, 5, 0, 25] // margin: [left, top, right, bottom]
                },
                footerExample:{
                  fontSize: 14,
                  bold: true,
                  margin: [8, 5, 0, 25] 
                },
                header: {
                  fontSize: 20,
                  bold: true,
                  
                  margin: [0, 10, 0, 5]
                },
                subheader: {
                  fontSize: 16,
                  bold: true,
                  margin: [0, 10, 0, 5]
                },
                tableExample: {
                  margin: [0, 5, 0, 15]
                },
                tableHeader: {

                  bold: true,
                  fontSize: 13,
                 
                  color: 'red'
                }
              }
            };
           }
            
      pdfMake.createPdf(dd).open();  
   // pdfMake.createPdf(dd).download();  
    
    }

    generateUniverseDataBO(){
      let tempUniverseData = [];
     console.log(this.universeData)
      for(let data of this.universeData){
        // @ts-ignore
        tempUniverseData.push({'ID':data.universeSourceId,'Name':data.name,folders:[],measures:[],dimensions:[],attributes:[],filters:[],tables:[],joins:[]})
      }
      for(let data of tempUniverseData){
        for(let unv of this.universeData){
              if(data.ID == unv.universeSourceId){
                console.log(unv.joins);
                if(JSON.parse(unv.joins)){
                  for(let f of JSON.parse(unv.joins)){
                    data.joins.push([f.identifier,f.leftTable,f.rightTable,f.expression == undefined ? '':f.expression])
                  }
                }  
                if(JSON.parse(unv.tables)){
                
                  for(let tbl of JSON.parse(unv.tables)){    
                    console.log(tbl.columns.length)           
                    for(let c of tbl.columns){                
                      data.tables.push([tbl.name,c.name,c.dataType,c.isUsed == undefined?'':c.isUsed])
                    }         
                  }
                 }
              if(JSON.parse(unv.items).folders){
                for(let f of JSON.parse(unv.items).folders){        
                  data.folders.push([f.name,f.path])         
                }
              }      
              if(JSON.parse(unv.items).measures){
                for(let m of JSON.parse(unv.items).measures){
                  data.measures.push([m.path,m.name,m.select,m.dataType,m.isUsed == undefined?'':m.isUsed,m.where])
                }
              }
              if(JSON.parse(unv.items).dimensions){
                for(let d of JSON.parse(unv.items).dimensions){
                  data.dimensions.push([d.path,d.name,d.select,d.dataType,d.isUsed == undefined?'':d.isUsed,d.where])
                }
              }      
              if(JSON.parse(unv.items).attributes){
                for(let a of JSON.parse(unv.items).attributes){
                  data.attributes.push([a.path,a.name,a.select,a.dataType,a.isUsed == undefined?'':a.isUsed,a.where])
                }
              }
    
              if(JSON.parse(unv.items).filters){
                for(let f of JSON.parse(unv.items).filters){
                  data.filters.push([f.path,f.name,f.select,f.dataType,f.isUsed == undefined?'':f.isUsed,f.where])
                }
              }  
    
           }
    
          }
        }
      
      console.log(tempUniverseData)
      return tempUniverseData 
    }
   
    generateReportDetailsNode(){
      let tempArray = [];
     
      for(let data of this.taskStatusInfo){    
        // @ts-ignore
        tempArray.push({'Id':data.id,'Report Name':data.reportName,queries:[],columnList:[],exception:[],tabList:[],variableList:[]})    
      }
     
      for(let t of tempArray){
       
        for(let data of this.taskStatusInfo){  
          if(t.Id == data.id){
           
            t.exception.push(data.exceptionReport)     
            if(data.tabList != "NOT AVAILABLE") {
              for(let dt of JSON.parse(data.tabList)){          
                for(let tbl of dt.boTableElements){  
                       
                 t.tabList.push([dt.reportTabName,tbl.tableType,tbl.tableName,tbl.numberOfColumns])
                }         
              }
            }
            
            
            for(let q of JSON.parse(data.queryList)){
              t.queries.push([q.queryName,q.query == undefined?"NA":q.query]);      
             
              if(q.boReportQueryColumns){         
                for(let col of q.boReportQueryColumns){              
                  t.columnList.push([q.queryName,col.columnId,col.columnName,col.columnDataType,col.columnQualification,col.columnExpression,col.aggregateFunction])
                } 
    
              }                   
            }
            
            if(data.variableList != 'NOT AVAILABLE')
            for(let v of JSON.parse(data.variableList)){
              t.variableList.push([v.id,v.name,v.qualification,v.dataType,v.definition,v.formulaLanguageId])
            }
        }      
      }
        
        }
        //console.log(tempArray)
      return tempArray;
    }

    generateReportsDetailsNodeTableau() {
      let tempArray = [];
     
      for(let data of this.taskStatusInfo){    
        // @ts-ignore
        tempArray.push({'Id':data.id,'Report Name':data.reportName,queryFilters:[],columnList:[],exception:[],tabList:[],variableList:[]})    
      }

      for(let t of tempArray){
       
        for(let data of this.taskStatusInfo){  
          if(t.Id == data.id){
           
            t.exception.push(data.exceptionReport)     
            if(data.tabList != "NOT AVAILABLE") {
              for(let dt of JSON.parse(data.tabList)){          
                for(let tbl of dt.tableauTableElements){  
                 t.tabList.push([tbl.tableName,tbl.caption,tbl.numberOfColumns])
                }
                for(let qf of dt.queryFilters) {
                  t.queryFilters.push([qf.className, qf.column, qf.context,qf.filterGroup, qf.kind]);
                }         
              }
            }
            if(data.queryList!="NOT AVAILABLE")
            {
              for(let q of JSON.parse(data.queryList)){
              
                if(q.tabReportQueryColumns){         
                  for(let col of q.tabReportQueryColumns){              
                    t.columnList.push([col.columnId,col.columnName,col.columnDataType,col.columnType,col.columnQualification,col.columnExpression,col.aggregateFunction])
                  } 
                }                   
              }
            }
            
            
            if(data.variableList != 'NOT AVAILABLE')
          {
            for(let v of JSON.parse(data.variableList)){
              t.variableList.push([v.id,v.name,v.qualification,v.dataType,v.definition,v.formulaLanguageId, v.className])
            }
          }
            
          }      
        }
        
      }
      
      //console.log("Temp Array::"+tempArray);
      return tempArray;

    }

    completeReportsDetailsTableau(reports: any) {
      
      let dd = {};
      let taskInfo = [];
      var taskData = [];
      //generate task data
      taskData = [{
        'ID':this.taskInfo['id'],
        'Name':this.taskInfo['taskName'],
        'Report Type':this.taskInfo['reportTypeCode'],
        'Status':this.taskInfo['taskStatus'].name
      }]

      for(let task of this.taskStatusInfo){
        taskInfo.push({
          'Report Id':task.reportId == undefined?0:task.reportId ,
          'Report Name':task.reportName,
          'Report Type':task.reportType,
          'Report Creation Date':task.reportCreationDate,
          'Report Updated Date':task.reportUpdatedDate,
          'Report User':task.reportUser,
          'Report Published':task.reportPublished,
          'Report Scheduled':task.reportScheduled,
          'Actively Used':task.activelyUsed,
          'Avg. Runtime':task.averageRunTime, 
          'Folder Path':task.folderPath,
          'No Of Blocks':task.numberOfBlocks, 
          'No Of Columns':task.numberOfColumns,
          'No Of Conditional Blocks':task.numberOfConditionalBlocks,
          'No Of Failures':task.numberOfFailures, 
          'No Of Filters':task.numberOfFilters,
          'No Of Formulas':task.numberOfFormulas,
          'No Of Instances':task.numberOfInstances,
          'No Of Query':task.numberOfQuery,
          'No Of Recurring Instances' :task.numberOfRecurringInstances,
          'No Of ReportPages':task.numberOfReportPages,
          'No Of Rows' :task.numberOfRows,
          'No Of Tabs':task.numberOfTabs,  
          'No Of Variables':task.numberOfVariables,
          'No Of Images':task.numberOfImages,
          'No Of Embedded Elements':task.numberOfEmbeddedElements,      
          'Pivot Table Set':task.pivotTableSet,    
          'Chartset':task.chartSet == '[]' ? '':task.chartSet ,
          'Table ColumnMap':task.tableColumnMap,
          'Table Set':task.tableSet,      
          'Total Size':task.totalSize,
          'Total Universe Count':task.totalUniverseCount,
          'Universe Id':task.universeId,
          'Universe Name':task.universeName == undefined?'NA':task.universeName,
          'Universe Path':task.universePath == undefined?'NA':task.universePath,  
          'Commonality Factor':task.commonalityFactor ,
          'Complexity' :task.complexity
        })
       
      }

      dd = {
                
        pageOrientation: 'landscape',
        pageSize: 'RA0',
        info: {
          title: 'Recast - Report Migration Utility',
          // author: 'john doe',
          // subject: 'subject of document',
          // keywords: 'keywords for document',
          },
        header: {	text:'Recast - Report Migration Utility',style:'headerExample'},
       
        footer: {
          columns: [
            '©2020 Larsen and Toubro Infotech Limited',
          ],
          style:'footerExample'
        },
        content: [
          
          {
            text: this.taskInfo['taskName'] + 'Details',
            alignment:'center',fontSize:24,bold:true
          },
          { text: 'Task Details', style: 'header' },      
          this.table(taskData,['ID','Name','Report Type','Status']),
          { text: 'Report List', style: 'header' },                
          this.table(taskInfo, ['Report Id','Report Name','Report Type',
                                'Report Creation Date','Report Updated Date',
                                'Report User','Report Published','Report Scheduled','Actively Used','Avg. Runtime','Folder Path','No Of Blocks','No Of Columns','No Of Conditional Blocks', 'No Of Failures','No Of Filters', 'No Of Formulas', 'No Of Instances','No Of Query','No Of Recurring Instances','No Of ReportPages','No Of Rows','No Of Tabs',  
            'No Of Variables', 'No Of Images','No Of Embedded Elements','Pivot Table Set','Chartset','Table ColumnMap','Table Set','Total Size' ,'Total Universe Count', 'Universe Id','Universe Name','Universe Path','Commonality Factor' ,'Complexity' ]),
         
          { text: 'Report Details', style: 'header',pageBreak: 'before' },  
           this.nestedTable(reports,['Report Name'])
         
        ],
        
        styles: {
          headerExample:{
          
            fontSize: 14,
            bold: true,
            margin: [8, 5, 0, 25] // margin: [left, top, right, bottom]
          },
          footerExample:{
            fontSize: 14,
            bold: true,
            margin: [8, 5, 0, 25] 
          },
          header: {
            fontSize: 20,
            bold: true,
            
            margin: [0, 10, 0, 5]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableHeader: {

            bold: true,
            fontSize: 13,
           
            color: 'red'
          }
        },
      }

      pdfMake.createPdf(dd).open(); 

    }

    generateUniverseDataCognos(){

      let tempUniverseData = [];
     console.log(this.universeData)
    
    
      for(let data of this.universeData){
        //tempUniverseData.push({'ID':data.universeSourceId,'Name':data.name,folders:[],variables:[],identifiers:[],attributes:[],filters:[],facts:[],tables:[],joins:[]})
       // @ts-ignore
        tempUniverseData.push({'ID':data.universeSourceId,'Name':data.name,folders:[],variables:[],identifiers:[],attributes:[],filters:[],facts:[],joins:[]})
      }
    
      for(let data of tempUniverseData){
        for(let unv of this.universeData){
              if(data.ID == unv.universeSourceId){
                console.log(unv.joins);
                if(JSON.parse(unv.joins)){
                  for(let f of JSON.parse(unv.joins)){
                    data.joins.push([f.name,f.leftTable,f.rightTable,f.condition == undefined ? '':f.condition])
                  }
                }  
                /* if(JSON.parse(unv.tables)){
                
                  for(let tbl of JSON.parse(unv.tables)){    
                   // console.log(tbl.columns.length)           
                    //for(let c of tbl.columns){                
                     // data.tables.push([tbl.name,tbl.columns,tbl.qName == undefined?'':tbl.qName])
                     data.tables.push([tbl.qName == undefined?'':tbl.qName])
                    //}         
                  }
                 } */
              if(JSON.parse(unv.items).folders){
                for(let f of JSON.parse(unv.items).folders){        
                  data.folders.push([f.name==undefined?'':f.name,f.path==undefined?'':f.path])        
                }
              }      
              if(JSON.parse(unv.items).variables){
                for(let m of JSON.parse(unv.items).variables){
                  data.variables.push([m.name,m.dataType,m.qName,m.expression == undefined?'':m.expression])
                }
              }
              if(JSON.parse(unv.items).identifiers){
                for(let d of JSON.parse(unv.items).identifiers){
                  data.identifiers.push([d.name,d.dataType,d.qName,d.expression == undefined?'':d.expression])
                }
              }      
              if(JSON.parse(unv.items).attributes){
                for(let a of JSON.parse(unv.items).attributes){
                  data.attributes.push([a.name,a.dataType,a.qName,a.expression == undefined?'':a.expression])
                }
              }
    
              if(JSON.parse(unv.items).filters){
                for(let f of JSON.parse(unv.items).filters){
                  data.filters.push([f.name,f.dataType,f.qName,f.expression == undefined?'':f.expression])
                }
              }  
    
              if(JSON.parse(unv.items).facts){
                for(let c of JSON.parse(unv.items).facts){
                  data.facts.push([c.name== undefined?'':c.name,c.dataType== undefined?'':c.dataType,c.qName== undefined?'':c.qName,c.expression == undefined?'':c.expression])
                }
              }  
           }
     
          }
        }
        console.log(tempUniverseData)
      return tempUniverseData 
    }


    generateReportDetailsNodeCognos(){
      let tempArray = [];
     
      for(let data of this.taskStatusInfo){    
       // tempArray.push({'Id':data.id,'Report Name':data.reportName,queries:[],columnList:[],exception:[],tabList:[],variableList:[]})    
       // @ts-ignore
       tempArray.push({'Id':data.id,'Report Name':data.reportName,tableSet:[],querySet:[],filterSet:[]}) 
      }
     
      for(let t of tempArray){
       
        for(let data of this.taskStatusInfo){  
          if(t.Id == data.id){
            //t.exception.push(data.exceptionReport)     
            if(data.tableSet != "NOT AVAILABLE") {
              for(let dt of JSON.parse(data.tableSet)){          
                for(let tbl of dt.columnNames){        
                 t.tableSet.push([dt.tableName,tbl])
                }         
              }
            }
    
    
            //Query Set
            for(let dt of JSON.parse(data.queryList))
            {
              for(let di of dt.dataItem)
              {
                t.querySet.push([dt.queryName,di.aggregate,di.expression,di.name,di.rollupAggregate,di.sort])
              }
            }
    
            //Filter Set
            for(let dt of JSON.parse(data.queryList))
            {
              for(let di of dt.filterSet)
              {
                t.filterSet.push([dt.queryName,di.filterExpression,di.filterName,di.filterValue,di.filterOperator,di.postAutoAggregation,di.use])
              }
            }
        }      
      }
        
        }
        //console.log(tempArray)
      return tempArray;
    }

    
table(data:any, columns:any) {
  return {
      table: {
          headerRows: 1,
          // dontBreakRows: true,         
          body: this.buildTableBody(data, columns)
      },
      
  };
}

buildTableBody(data:any, columns:any) {
  let body = [];    
  let datacol = []; 
 
  for(let col of columns){
    datacol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true,})
  }
  body.push(datacol);
  data.forEach(function(row:any) {
      let dataRow:any = [];
     
      columns.forEach(function(column:any) {
      //  console.log(column)
          dataRow.push({'text':row[column]});
         
      })

      body.push(dataRow);
      
  });
  return body;
}


nestedTable(data:any, columns:any){
  return {
    table: {
        headerRows: 1,     
        body: this.buildNestedTable(data, columns)
    },
     
  };
}

buildNestedTable(data:any, columns:any){
  let body = [];    

  if(this.reportType=="BO")
  { 
  let datacol = []; 
  for(let col of columns){
    datacol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
  }
  body.push(datacol);

  data.forEach(function(row:any) {
      let dataRow:any = [];
      let reportcol:any = [];
      let varcol:any = [];
      let colmns:any = [];
      let qheader = [{'text':'Query Name','fillColor':'gray','fontSize': 16, 'bold': true},{'text':'Query','fillColor':'gray','fontSize': 16, 'bold': true}];
      let reportheader = ['Report Table Name','BO Table Type','BO Table Name','BO Table Columns'];
      let variablesHeader = ['ID','Name','Qualification','Data Type','Definition','Formula Language Id'];
      let colHeaders = ['Query Name','Column ID','Column Name','Column Data Type','Column Qualification','Column Expression','Column Aggregate Function']
      columns.forEach(function(column:any) {

        let body = [];
        let reportbody = [];
        let variableBody = [];
        let columnbody = [];
        body.push(qheader)
        for(let q of row.queries){
          body.push(q)
        }
   //======================= Reports section ===========================
        for(let col of reportheader){
          reportcol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        
        reportbody.push(reportcol);
        for(let element of row.tabList){
          reportbody.push(element)
        }
  //======================= Variables section ===========================
        for(let col of variablesHeader){
          varcol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        variableBody.push(varcol);
        for(let element of row.variableList){
          variableBody.push(element);
        }
//======================= Columns section ===============================
        for(let col of colHeaders){
          colmns.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        columnbody.push(colmns);
        for(let element of row.columnList){
         
          columnbody.push(element);
        }
//=========================================================================        
         dataRow.push({            
          style: 'tableExample',            
          table: {
            body: [
              [row[column]],
              [                
                [     
                  {'text':'Query List','fontSize': 16, 'bold': true},                
                  {
                    table: {
                      
                      body
                    },
                  },
                  {'text':'Column List','fontSize': 16, 'bold': true},
                  {
                    table: {
                      body: columnbody
                     
                    },
                  },
                  {'text':'Exceptions','fontSize': 16, 'bold': true},
                  {
                    table: {
                      body: [
                      
                        [{'text':'Exception','fillColor':'gray','fontSize': 16, 'bold': true}],
                        row.exception
                      ]
                    },
                  },
                  {'text':'Report Objects','fontSize': 16, 'bold': true},
                  {
                    table: {
                      body:reportbody
                      
                    },
                  },
                  {'text':'Variable List','fontSize': 16, 'bold': true},
                  {
                    
                    table: {
                      body:variableBody
                      
                    },
                  }
                ]
              ]
            ]
          }
        })
         
      })       
    
      body.push(dataRow);        
  });
  }
  else if(this.reportType=="COGNOS")
  {
    let datacol = []; 
    for(let col of columns){
      datacol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
    }
    body.push(datacol);
    

    data.forEach(function(row:any) {
        let dataRow:any = [];
        let reportcol:any = [];
        let queryCol:any =[];
        let filterCol:any =[];
      //  let qheader = [{'text':'Query Name','fillColor':'gray','fontSize': 16, 'bold': true},{'text':'Query','fillColor':'gray','fontSize': 16, 'bold': true}];
        let reportheader = ['Report Table Name','Report Table Columns'];
        let querySetheader = ['Query Name','Aggregate','Expression','Name','Roll Up Aggregate','Sort'];
        let filterSetHeader = ['Query Name','Filter Expression','Filter Name','Filter Value','Filter Operator','Post Auto Aggregartion','Use']
        //  let variablesHeader = ['ID','Name','Qualification','Data Type','Definition','Formula Language Id'];
     //   let colHeaders = ['Query Name','Column ID','Column Name','Column Data Type','Column Qualification','Column Expression','Column Aggregate Function']
        columns.forEach(function(column:any) {

          let body = [];
          let reportbody = [];
          let querySetBody=[];
          let filterSetBody=[];
         // let variableBody = [];
         // let columnbody = [];
        //  body.push(qheader)
          /* for(let q of row.queries){
            body.push(q)
          } */
     //======================= Reports section ===========================
          for(let col of reportheader){
            reportcol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
          }
          
          reportbody.push(reportcol);
          for(let element of row.tableSet){
            reportbody.push(element)
          }

    //======================= Query Data section ===========================

      for(let col of querySetheader){
        queryCol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
      }
      
      querySetBody.push(queryCol);
      for(let element of row.querySet){
        querySetBody.push(element)
      }

  //======================= Filter Data section ===========================

    for(let col of filterSetHeader){
      filterCol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
    }

    filterSetBody.push(filterCol);
    for(let element of row.filterSet){
      filterSetBody.push(element)
    }

    //======================= Variables section ===========================
         /*  for(let col of variablesHeader){
            varcol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
          }
          variableBody.push(varcol);
          for(let element of row.variableList){
            variableBody.push(element);
          } */
  //======================= Columns section ===============================
          /* for(let col of colHeaders){
            colmns.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
          }
          columnbody.push(colmns);
          for(let element of row.columnList){
           
            columnbody.push(element);
          } */
  //=========================================================================        
           dataRow.push({            
            style: 'tableExample',            
            table: {
              body: [
                [row[column]],
                [                
                  [     
                  
                    {'text':'Report Objects','fontSize': 16, 'bold': true},
                    {
                      table: {
                        body:reportbody
                        
                      },
                    },
                     {'text':'Query Data Set','fontSize': 16, 'bold': true},
                    {
                      
                      table: {
                        body:querySetBody
                        
                      },
                    },
                    {'text':'Filter Data Set','fontSize': 16, 'bold': true},
                    {
                      
                      table: {
                        body:filterSetBody
                        
                      },
                    } 
                  ]
                ]
              ]
            }
          })
           
        })       
      
        body.push(dataRow);        
    });
  }
  else if(this.reportType=="TABLEAU")
  {
    let datacol = []; 
    for(let col of columns){
      datacol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
    }
    body.push(datacol);

    data.forEach(function(row:any) {
      let dataRow:any = [];
      let reportcol:any = [];
      let varcol:any = [];
      let filtercol:any = [];
      let columncol:any = [];
      let filterHeader = [
        {'text':'Class Name','fillColor':'gray','fontSize': 16, 'bold': true},
        {'text':'Column','fillColor':'gray','fontSize': 16, 'bold': true},
        {'text':'Context','fillColor':'gray','fontSize': 16, 'bold': true},
        {'text':'Filter Group','fillColor':'gray','fontSize': 16, 'bold': true},
        {'text':'Kind','fillColor':'gray','fontSize': 16, 'bold': true}
      ];
      let reportheader = ['Tableau Table Name','Tableau Table Caption','No. of Columns'];
      let variablesHeader = ['ID','Name','Qualification','Data Type','Definition','Formula Language Id','Class Name'];
      let colHeader = ['Column ID','Column Name','Column Data Type','Column Type','Column Qualification','Column Expression','Column Aggregate Function']
      
      columns.forEach(function(column:any) {

        let body = [];
        let reportbody = [];
        let variableBody = [];
        let filterBody = [];
        let columnBody = [];
       // body.push(qheader)
        //for(let q of row.queries){
         // body.push(q)
       // }
   //======================= Reports section ===========================
        for(let col of reportheader){
          reportcol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        
        reportbody.push(reportcol);
        for(let element of row.tabList){
          reportbody.push(element)
        }
  //======================= Variables section ===========================
        for(let col of variablesHeader){
          varcol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        variableBody.push(varcol);
        for(let element of row.variableList){
          variableBody.push(element);
        }
//======================= Query filters section ===============================
         for(let col of filterHeader){
          filtercol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        filterBody.push(filtercol);
        for(let element of row.queryFilters){
         
          filterBody.push(element);
        } 

//======================= Column list section ===============================
        for(let col of colHeader){
          columncol.push({text:col,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        columnBody.push(columncol);
        for(let element of row.columnList){
         
          columnBody.push(element);
        } 
//=========================================================================        
         dataRow.push({            
          style: 'tableExample',            
          table: {
            body: [
              [row[column]],
              [                
                [     
                  //{'text':'Query List','fontSize': 16, 'bold': true},                
                  //{
                   // table: {
                      
                      //body
                    //},
                  //},
                 /*  {'text':'Column List','fontSize': 16, 'bold': true},
                  {
                    table: {
                      body: columnbody
                     
                    },
                  }, */
                  {'text':'Report Objects','fontSize': 16, 'bold': true},
                  {
                    table: {
                      body:reportbody
                      
                    },
                  },
                  {'text':'Variable List','fontSize': 16, 'bold': true},
                  {
                    
                    table: {
                      body:variableBody
                      
                    },
                  },
                  {'text':'Query Filters','fontSize': 16, 'bold': true},
                  {
                    table: {
                      body:filterBody
                      
                    },
                  },
                  {'text':'Column List','fontSize': 16, 'bold': true},
                  {
                    table: {
                      body:columnBody
                      
                    },
                  }
                ]
              ]
            ]
          }
        })
         
      })       
    
      body.push(dataRow);        
  });
  }
  return body;
}


generateuniverseTable(data:any, columns:any){
  return {
    table: {
        //  headerRows: 1, 
         
        //  keepWithHeaderRows: true, 

        body: this.buildUniverseTable(data, columns)
    },
    
  };
}

buildUniverseTable(data:any, columns:any){
  var body:any = [];

  if(this.reportType=='BO')
  {
    data.forEach(function(row:any) {
      let dataRow:any = [];
       
      columns.forEach(function(column:any) {
        let commonheader = ['Path','Name','Formula','Data Type','Is Used','Where'];
        let joinHeader = ['Identifier','Left Table','Right Table','Formula']
        let folderHeader = [{'text':'Name','fillColor':'gray','fontSize': 16, 'bold': true},{'text':'Path','fillColor':'gray','fontSize': 16, 'bold': true}];
        let measureHeader = [];
        let dimentsionHeader = [];
        let attributesHeader = [];
        let filterHeader = [];
        let tableHeader = ['Table Name','Column Name','Data Type','Used']; 
        let tblHeader:any = [];
        let jheader = [];
  
        let folders = [];
        let measures = [];
        let dimensions = [];
        let attributes = [];
        let filters = [];
        let tableslist = [];
        let joins = []
        for(let h of commonheader){
         // folderHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          measureHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          dimentsionHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          attributesHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          filterHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          
        }
        folders.push(folderHeader)   
        measures.push(measureHeader)
        dimensions.push(dimentsionHeader)
        attributes.push(attributesHeader)
        filters.push(filterHeader)
        tableslist.push(tblHeader)
  
     
  //================================Folders======================================
            
        for(let f of row.folders){
  
          folders.push(f)
        }
  //================================measures======================================
       
        for(let f of row.measures){
          measures.push(f)
        }
  //================================dimensions======================================
       
        for(let f of row.dimensions){
          dimensions.push(f)
        }
  //================================attributes======================================   
     
        for(let f of row.attributes){
          attributes.push(f)
        }
  //================================filters=========================================
       
        for(let f of row.filters){
          filters.push(f)
        }
  //=================================Tables =========================================
        for(let t of tableHeader){
          tblHeader.push({'text':t,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        for(let t of row.tables){
          tableslist.push(t)
        }
       // console.log(tableslist)
  //===============================JOINS==============================================
        for(let t of joinHeader){
          jheader.push({'text':t,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        
        joins.push(jheader)
        for(let t of row.joins){
          joins.push(t)
        }
      //  console.log(joins)
  //===================================================================================
     
         dataRow.push({            
          style: 'tableExample',            
          table: {
            body: [
              [row.Name],
              [                
                [     
                  {'text':'Folders','fontSize': 16, 'bold': true},           
                  {
                    table: {
                      dontBreakRows: true,  
                      body:folders
                    }
                  },
                  {'text':'Measures','fontSize': 16, 'bold': true},
                  {
                    table: {
                      dontBreakRows: true,  
                      body: measures
                     
                    }
                  },
                  {'text':'Dimensions','fontSize': 16, 'bold': true},
                  {
                    table: {
                      dontBreakRows: true,  
                      body: dimensions
                    }
                  },
                  {'text':'Attributes','fontSize': 16, 'bold': true},
                  {
                    table: {
                      headerRows: 1, 
                      body:attributes
                      
                    }
                  },
                  {'text':'Filters','fontSize': 16, 'bold': true},
                  {
                    
                    table: {
                      dontBreakRows: true,  
                      body:filters
                      
                    }
                  },
                  {'text':'Tables','fontSize': 16, 'bold': true},
                  {
                    
                    table: {
                      dontBreakRows: true,  
                      body:tableslist
                      
                    }
                    },
                    {'text':'Joins','fontSize': 16, 'bold': true},
                    {
                      
                      table: {
                        dontBreakRows: true,  
                        body:joins
                        
                      }
                  }
                ]
              ]
            ]
          }
        })
    }) 
      body.push(dataRow);        
    });
  }

  else if(this.reportType=='COGNOS')
  { 
    data.forEach(function(row:any) {
      let dataRow:any = [];    
      columns.forEach(function(column:any) {
        let commonheader = ['Name','Formula','Data Type','Q Name'];
        let joinHeader = ['Identifier','Left Table','Right Table','Formula']
        let folderHeader = [{'text':'Name','fillColor':'gray','fontSize': 16, 'bold': true},{'text':'Path','fillColor':'gray','fontSize': 16, 'bold': true}];
        let variableHeader = [];
        let identifierHeader = [];
        let attributesHeader = [];
        let filterHeader = [];
        let factHeader =[];
        let tableHeader = ['Table Name','Column Name','Q Name']; 
        //let tblHeader = [];
        let jheader = [];
  
        let folders = [];
        let variables = [];
        let identifiers = [];
        let attributes = [];
        let filters = [];
        let facts =[];
       // let tableslist = [];
        let joins = []
        for(let h of commonheader){
         // folderHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          variableHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          identifierHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          attributesHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          filterHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
          factHeader.push({text:h,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        folders.push(folderHeader)   
        variables.push(variableHeader)
        identifiers.push(identifierHeader)
        attributes.push(attributesHeader)
        filters.push(filterHeader)
        facts.push(factHeader)
       // tableslist.push(tblHeader)
  
  //================================Folders======================================
            
        for(let f of row.folders){
          folders.push(f)
        }
  //================================variables======================================
       
        for(let f of row.variables){
          variables.push(f)
        }
  //================================identifiers======================================
       
        for(let f of row.identifiers){
          identifiers.push(f)
        }
  //================================attributes======================================   
     
        for(let f of row.attributes){
          attributes.push(f)
        }
  //================================filters=========================================
       
        for(let f of row.filters){
          filters.push(f)
        }
  
  //================================facts=========================================
       
         for(let f of row.facts){
          facts.push(f)
        } 
  //=================================Tables =========================================
        
        // for(let t of row.tables){
        //   tableslist.push(t)
        // }
       // console.log(tableslist)
  //===============================JOINS==============================================
        for(let t of joinHeader){
          jheader.push({'text':t,'fillColor':'gray','fontSize': 16, 'bold': true})
        }
        
        joins.push(jheader)
        for(let t of row.joins){
          joins.push(t)
        }
      //  console.log(joins)
  //===================================================================================
  
         dataRow.push({            
          style: 'tableExample',            
          table: {
            body: [
              [row.Name],
              [                
                [     
                  {'text':'Folders','fontSize': 16, 'bold': true},           
                  {
                    table: {
                      dontBreakRows: true,  
                      body:folders
                    }
                  },
                  {'text':'Variables','fontSize': 16, 'bold': true},
                  {
                    table: {
                      dontBreakRows: true,  
                      body: variables
                     
                    }
                  },
                  {'text':'Identifiers','fontSize': 16, 'bold': true},
                  {
                    table: {
                      dontBreakRows: true,  
                      body: identifiers
                    }
                  },
                  {'text':'Attributes','fontSize': 16, 'bold': true},
                  {
                    table: {
                      headerRows: 1, 
                      body:attributes
                      
                    }
                  },
                  {'text':'Filters','fontSize': 16, 'bold': true},
                  {
                    
                    table: {
                      dontBreakRows: true,  
                      body:filters
                      
                    }
                  },
                   {'text':'Facts','fontSize': 16, 'bold': true},
                  {
                    
                    table: {
                      dontBreakRows: true,  
                      body:facts
                      
                    }
                  }, 
                  /* {'text':'Tables','fontSize': 16, 'bold': true},
                  {
                    
                    table: {
                      dontBreakRows: true,  
                      body:tableslist
                      
                    }
                    }, */
                    {'text':'Joins','fontSize': 16, 'bold': true},
                    {
                      
                      table: {
                        dontBreakRows: true,  
                        body:joins
                        
                      }
                  }
                ]
              ]
            ]
          }
        })
    }) 
    //alert(dataRow);
      body.push(dataRow);        
    });
    
 }

console.log("Body:"+body);
  return body;
  
}

   showReportInfo(data:any) {
    
    // console.log(data.queryList);

    if(this.reportType=="BO")
    {
    this.fullReportDetails = data;
    this.reportName = data.reportName;
    this.queryList = [];
    this.reportData = [
      
      { 'name': 'Dimensions', 'expand': false, 'data': [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] },
      { 'name': 'Measures', 'expand': false, "data": [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] },
      { 'name': 'Attributes', 'expand': false, "data": [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] }
    ]

    this.totalSqlQueries = this.queryList.length;
    let querylength = JSON.parse(data.queryList).length;
    if(data.exceptionReport != ""){
      this.exceptionRptAvailable = true;
      this.exceptionReport = data.exceptionReport

    } 
    else{
      this.exceptionRptAvailable = false;
    }
    if (querylength != 0) {
      this.dataObjectsAvailable = true;
      this.queryList = JSON.parse(data.queryList);
    }
    else{
      this.dataObjectsAvailable = false;
    }

    if ( data.variableList != "NOT AVAILABLE") {      
      this.variableList = JSON.parse(data.variableList);
      this.queryListAvailable = true;
    }
    else{
      this.queryListAvailable = false;
    }

    if (data.tabList != "NOT AVAILABLE") {
      this.reportObjectAvailable = true;
      this.tabList = JSON.parse(data.tabList);
     // console.log(JSON.parse(data.tabList));
      
    }
    else{
      this.reportObjectAvailable = false;
    }
  
    for (let item of this.reportData) {
      switch (item.name) {
        // case 'SQL Queries': { 
        //     for(let data of this.queryList){
        //       item.data.push(data)
        //     }
        //    break; 
        // } 
        case 'Dimensions': {
          //Adding columns with dimention qualification
          for (let data of this.queryList) {
            if(data['boReportQueryColumns']){
              for (let col of data['boReportQueryColumns']) {
                col.queryName = data.queryName;
                if (col.columnQualification == "Dimension") {
  
                  for (let dt of item['data']) {
                    if (dt.type == 'Columns') {
                      dt.list.push(col)
                    }
                  }
                }
              }
            }        

          }
          //Adding variables with dimension qualification
          for (let data of this.variableList) {
            if (data.qualification == "Dimension") {
              for (let dt of item['data']) {
                if (dt.type == 'Variables') {
                  dt.list.push(data)
                }
              }
            }
          }
          break;
        }
        case 'Measures': {
          //Adding columns with measure qualification
          for (let data of this.queryList) {
            if(data['boReportQueryColumns']){
              for (let col of data['boReportQueryColumns']) {
                col.queryName = data.queryName;
                if (col.columnQualification == "Measure") {
  
                  for (let dt of item['data']) {
                    if (dt.type == 'Columns') {
                      dt.list.push(col)
                    }
                  }
                }
              }
            }    
          }
          //Adding variables with measure qualification
          for (let data of this.variableList) {
            if (data.qualification == "Measure") {
              for (let dt of item['data']) {
                if (dt.type == 'Variables') {
                  dt.list.push(data)
                }
              }
            }
          }
          break;
        }
        case 'Attributes': {
          //Adding columns with attribute qualification
          for (let data of this.queryList) {
            if(data['boReportQueryColumns']){
              for (let col of data['boReportQueryColumns']) {
                col.queryName = data.queryName;
                if (col.columnQualification == "Attribute") {  
                  for (let dt of item['data']) {
                    if (dt.type == 'Columns') {
                      dt.list.push(col)
                    }
                  }
                }
              }
            }    
          }
          //Adding variables with attribute qualification
          for (let data of this.variableList) {
            if (data.qualification == "Attribute") {
              for (let dt of item['data']) {
                if (dt.type == 'Variables') {
                  dt.list.push(data)
                }
              }
            }
          }
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
    }
     console.log(this.reportData)
    this.showTaskInfo = false;
    this.reportDetails = data
    }
    else if(this.reportType=='TABLEAU') 
    {
      this.fullReportDetails = data;
      this.reportName = data.reportName;
      this.queryList = [];
      this.reportData = [
        
        { 'name': 'Dimensions', 'expand': false, 'data': [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] },
        { 'name': 'Measures', 'expand': false, "data": [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] }
      ]

      this.columnInstanceData = [
        { 'name': 'columnInstance', 'expand': false, 'data': [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }] },
      ];

      this.totalSqlQueries = this.queryList.length;
      let querylength = JSON.parse(data.queryList).length;
      if(data.exceptionReport != ""){
        this.exceptionRptAvailable = true;
        this.exceptionReport = data.exceptionReport

      } 
      else{
        this.exceptionRptAvailable = false;
      }
      if (querylength != 0) {
        this.dataObjectsAvailable = true;
        this.queryList = JSON.parse(data.queryList);
      }
      else{
        this.dataObjectsAvailable = false;
      }
      if ( data.variableList != "NOT AVAILABLE") {      
        this.variableList = JSON.parse(data.variableList);
        this.queryListAvailable = true;
      }
      else{
        this.queryListAvailable = false;
      }
  
      if (data.tabList != "NOT AVAILABLE") {
        this.reportObjectAvailable = true;
        this.tabList = JSON.parse(data.tabList);
       // console.log(JSON.parse(data.tabList));
        
      }
      else{
        this.reportObjectAvailable = false;
      }

      for (let item of this.reportData) {
        switch (item.name) {
          case 'Dimensions': {
            for (let data of this.queryList) {
              if(data['tabReportQueryColumns']){
                for (let col of data['tabReportQueryColumns']) {
                  col.queryName = data.queryName;
                  if (col.columnQualification == "dimension") {
    
                    for (let dt of item['data']) {
                      if (dt.type == 'Columns') {
                        dt.list.push(col)
                      }
                    }
                  }
                }
              }
            }

            //variable list
            for (let data of this.variableList) {
              if (data.qualification == "dimension") {
                for (let dt of item['data']) {
                  if (dt.type == 'Variables') {
                    dt.list.push(data)
                  }
                }
              }
            }
            break;
          }
          case 'Measures': {
            //Adding columns with measure qualification
            for (let data of this.queryList) {
              if(data['tabReportQueryColumns']){
                for (let col of data['tabReportQueryColumns']) {
                  col.queryName = data.queryName;
                  if (col.columnQualification == "measure") {
    
                    for (let dt of item['data']) {
                      if (dt.type == 'Columns') {
                        dt.list.push(col)
                      }
                    }
                  }
                }
              }    
            }
            //Adding variables with measure qualification
            for (let data of this.variableList) {
              if (data.qualification == "measure") {
                for (let dt of item['data']) {
                  if (dt.type == 'Variables') {
                    dt.list.push(data)
                  }
                }
              }
            }
            break;
          }
          default: {
            //statements; 
            break;
          }
        }
      }

      for (let item of this.columnInstanceData) {
        switch(item.name) {
          case 'columnInstance': {
            for (let data of this.tabList) {
              if (data['tableauTableElements']) {
                for (let col of data['tableauTableElements']) {
                  for (let data of col['columnInstance']) {
                    for (let dt of item['data']) {
                      if (dt.type == 'Columns') {
                        dt.list.push(data)
                      }
                    }
                  }
                }
              }
            }
            break;
          }
          default: {
            break;
          }
        }
      }

      console.log(this.reportData)
      this.showWorkbookInfo = false;
      this.reportDetails = data
      
    }
    else if(this.reportType=="COGNOS")
    {
      this.fullReportDetails = data;
      this.reportName = data.reportName
      this.queryList = [];
      this.reportData = [
        
        { 'name': 'Dimensions', 'expand': false, 'data': [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] },
        { 'name': 'Measures', 'expand': false, "data": [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] },
        { 'name': 'Attributes', 'expand': false, "data": [{ 'type': 'Columns', 'expandcolumn': false, 'list': [] }, { 'type': 'Variables', 'expandvar': false, 'list': [] }] }
      ]

      this.queryListCognosDataFilter = [     
        { 'name': 'QueryData', 'expand': false, 'data': [{ 'type': 'QueryData', 'expandcolumn': false, 'list': [] }] },
        { 'name': 'FilterData', 'expand': false, "data": [{ 'type': 'FilterData', 'expandcolumn': false, 'list': [] }] }
      ]
  
      this.totalSqlQueries = this.queryList.length;
      let querylength = JSON.parse(data.queryList).length;
      if(data.exceptionReport != ""){
        this.exceptionRptAvailable = true;
        this.exceptionReport = data.exceptionReport
  
      } 
      else{
        this.exceptionRptAvailable = false;
      }
      if (querylength != 0) {
        this.dataObjectsAvailable = true;
        this.queryList = JSON.parse(data.queryList);
      }
      else{
        this.dataObjectsAvailable = false;
      }
  
      if ( data.queryList != "[]") {      
        this.queryListCognos = JSON.parse(data.queryList);
        this.queryListAvailable = true;
        for(let data of this.queryListCognos){
          data.expand = false;
        }

        for (let item of this.queryListCognosDataFilter) {
          switch (item.name) {
            case "QueryData": { 
              console.log(this.queryListCognos);            
              for (let data of this.queryListCognos)
              {
                if(data['dataItem'])
                {
                  for (let col of data['dataItem'])
                  {
                   // console.log(item[data]);
                    for (let dt of item['data'])
                    {
                      if (dt.type == 'QueryData') {
                        dt.list.push(col)
                      }
                    }

                  //  alert(item[data]);
                  } 

                }
              }
              break;
            }

            case 'FilterData': { 
              console.log(this.queryListCognos);            
              for (let data of this.queryListCognos)
              {
                if(data['filterSet'])
                {
                  for (let col of data['filterSet'])
                  {
                   // console.log(item[data]);
                    for (let dt of item['data'])
                    {
                      if (dt.type == 'FilterData') {
                        dt.list.push(col)
                      }
                    }

                  //  alert(item[data]);
                  } 

                }
              }
              break;
            }
            default: {
              //statements; 
              break;
            }

          }
        }

        console.log(this.queryListCognosDataFilter);
      }
      else{
        this.queryListAvailable = false;
      }

      if (data.tableSet != "[]") {
        this.reportObjectAvailable = true;
        this.tableSet = JSON.parse(data.tableSet);
        console.log("Table set:"+JSON.parse(data.tableSet));    
      }
      else{
        this.reportObjectAvailable = false;
      }
    
     //  console.log(this.reportData)
      this.showTaskInfo = false;
      this.reportDetails = data
    }
    
  }


  hideReportDetails() {
    this.showTaskInfo = true;
    // this.getCommanality();
    // this.getTaskDetails();
  }

  hideTableauReportDetails() {
    this.showWorkbookInfo = true;
  }

  hideWorksheetDetails() {
    this.showWorkbookInfo = false;
    this.showTaskInfo = true;
  }

  showUniverseObjects(data:any){
    console.log(data);
    this.showUniverseTable = false;
    this.universeMeasures = JSON.parse(data.items).measures;
    this.universeFolders = JSON.parse(data.items).folders;
    console.log("folders");
    console.log(data.items);
    this.universeFilters = JSON.parse(data.items).filters;
    this.universeAttributes = JSON.parse(data.items).attributes;
    this.universeDimensions =  JSON.parse(data.items).dimensions;
    this.universeTable =  JSON.parse(data.tables);
    // this.universeJoins =  JSON.parse(data.joins);

    //Code added for Cognos Variables data
    this.universeVariables = JSON.parse(data.items).variables;
    this.universeIdentifiers = JSON.parse(data.items).identifiers;
    this.universeFacts = JSON.parse(data.items).facts;
    for(let data of this.universeTable){
      data.expand = false;
    }
   
  }

  exportUniverseList(){
  //alert("export universe List Called")
  let fileName = "Universe_Details.xlsx";
  let workbook = new Excel.Workbook();
  //let project_details = workbook.addWorksheet('Project Details');
  let universe_details = workbook.addWorksheet('Universe Details');
  /* project_details.columns = [
    { header: 'Project Name', key: 'pname' },
    { header: 'Start Date', key: 'sdate' },
    { header: 'End Date', key: 'edate' },
    { header: 'Users', key: 'user' },
    { header: 'Status', key: 'status' },
    { header: 'Connections', key: 'conn' }

  ]; */
  universe_details.columns = [
    { header: 'Universe Source Id', key: 'id' },
    { header: 'Project Analysis Id', key: 'projid' },
    { header: 'Name', key: 'name' },
    { header: 'Description', key: 'desc' },
    { header: 'Items', key: 'item' },
    { header: 'Tables', key: 'tables' },
    { header: 'Joins', key: 'joins' }

  ];

 // let usernames = [];
  //let connections = [];
  //for (let user of this.projectDetails['users']) {
   // usernames.push(user['userProfile'].name)
  //}
  //for (let conn of this.projectDetails['projectReportCons']) {
   // connections.push(conn.name);
  //}
  //project_details.addRow([this.projectDetails['name'], this.projectDetails['startDate'].split("T")[0], this.projectDetails['endDate'].split("T")[0], usernames.toString(), this.projectDetails['status'].name, connections.toString()])
  //let header = project_details.getRow(1);
  //this.setExcelSheetHeaders(header);

  for(let data of this.universeData){
    universe_details.addRow([data.universeSourceId,data.prjRptAnalysisId,data.name,data.description,data.items.toString(),data.tables.toString(),data.joins.toString()])
  }
  let  universe_details_headers =  universe_details.getRow(1);
  this.setExcelSheetHeaders(universe_details_headers);
  workbook.xlsx.writeBuffer().then((data:any) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, fileName);
  });

  }

  exportToExcel() {
 // alert("Export to excel Called");

  let usernames = [];
  let connections = [];
  let fileName = this.taskName + "_Details.xlsx";
  let workbook = new Excel.Workbook();
  //let worksheet_project_Details = workbook.addWorksheet('Project Details');
  let worksheet_task_Details = workbook.addWorksheet('Task Details');
  let worksheet_commonality_Details = workbook.addWorksheet('Commanality');

  /* worksheet_project_Details.columns = [
    { header: 'Project Name', key: 'pname' },
    { header: 'Start Date', key: 'sdate' },
    { header: 'End Date', key: 'edate' },
    { header: 'Users', key: 'user' },
    { header: 'Status', key: 'status' },
    { header: 'Connections', key: 'conn' }

  ]; */

  //for (let user of this.projectDetails['users']) {
   // usernames.push(user['userProfile'].name)
 // }
  //for (let conn of this.projectDetails['projectReportCons']) {
   // connections.push(conn.name);
 // }

 // worksheet_project_Details.addRow([this.projectDetails['name'], this.projectDetails['startDate'].split("T")[0], this.projectDetails['endDate'].split("T")[0], usernames.toString(), this.projectDetails['status'].name, connections.toString()])
//  let header = worksheet_project_Details.getRow(1);
 // this.setExcelSheetHeaders(header);
  /////////////////Task Details///////////////////////////////////////////////////////////////////
 
  worksheet_task_Details.columns = [
    { header: 'ID', key: 'ID' },
    { header: 'Project Report Analysis Id', key: '' },
    { header: 'Report Id', key: '' },
    { header: 'Report Name', key: '' },
    { header: 'Report Type', key: '' },
    { header: 'Report CreationDate', key: '' },
    { header: 'Report Updated Date', key: '' },
    { header: 'Report User', key: '' },
    { header: 'Report Published', key: '' },
    { header: 'Report Scheduled', key: '' },
    { header: 'Actively Used', key: '' },
    { header: 'Average Runtime' },
    { header: 'Folder Path', key: '' },
    { header: 'Number Of Blocks', key: '' },
    { header: 'Number Of Columns', key: '' },
    { header: 'Number Of Conditional Blocks', key: '' },
    { header: 'Number Of Failures', key: '' },
    { header: 'Number Of Filters', key: '' },
    { header: 'Number Of Formulas', key: '' },
    { header: 'Number Of Instances', key: '' },
    { header: 'Number Of Query', key: '' },
    { header: 'Number Of Recurring Instances', key: '' },
    { header: 'Number Of ReportPages', key: '' },
    { header: 'Number Of Rows', key: '' },
    { header: 'Number Of Tabs', key: '' },
    { header: 'Number Of Variables', key: '' },
    { header: 'Number Of Images' },
    { header: 'Number Of Embedded Elements' },
    { header: 'Column names', key: '' },
    { header: 'Pivot Table Set', key: '' },
    { header: 'Query List', key: '' },
    { header: 'Chart Set', key: '' },
    { header: 'Table ColumnMap', key: '' },
    { header: 'Table Set', key: '' },
    { header: 'Tab List' },
    { header: 'Total Size', key: '' },
    { header: 'Total Universe Count', key: '' },
    { header: 'Universe Id', key: '' },
    { header: 'Universe Name', key: '' },
    { header: 'Universe Path', key: '' },
    { header: 'Commonality Factor', key: '' },
    { header: 'Complexity' },
    { header: 'Exceptions', key:''}
  ]
  for (let data of this.taskStatusInfo) {
    if (data.workbookName == this.selectedWorkbookName) {
      worksheet_task_Details.addRow([
        data.id, data.prjRptAnalysisId, data.reportId, data.reportName, data.reportType, data.reportCreationDate, data.reportUpdatedDate, data.reportUser,
        data.reportPublished, data.reportScheduled, data.activelyUsed, data.averageRunTime, data.folderPath, data.numberOfBlocks,
        data.numberOfColumns, data.numberOfConditionalBlocks, data.numberOfFailures,
        data.numberOfFilters, data.numberOfFormulas, data.numberOfInstances, data.numberOfQuery, data.numberOfRecurringInstances,
        data.numberOfReportPages, data.numberOfRows, data.numberOfTabs, data.numberOfVariables, data.numberOfImages, data.numberOfEmbeddedElements,
        data.columnNames, data.pivotTableSet, data.queryList, data.chartSet, data.ColumnMap, data.tableSet, data.tabList,
        data.totalSize, data.totalUniverseCount, data.universeId, data.universeName, data.universePath, data.commonalityFactor,data.complexity,data.exceptionReport])
    }
  }
  let headerrow1 = worksheet_task_Details.getRow(1);
  this.setExcelSheetHeaders(headerrow1)
  
  ////////////////////////////// ADD Comanility details /////////////////////////
  worksheet_commonality_Details.columns = [
    { header: 'Id' },
    { header: 'Report 1 Id' },
    { header: 'First Report Name', key: 'freport' },
    { header: 'Report 2 Id' },
    { header: 'Second Report Name', key: 'sreport' },
    { header: 'Commanality', key: 'commanality' },
    { header: 'Identical' }

  ];
  let headerrow2 = worksheet_commonality_Details.getRow(1);
  this.setExcelSheetHeaders(headerrow2)

  for (let data of this.commonalityData) {

    worksheet_commonality_Details.addRow([
      data.id,
      data.analysisReport1.id,
      data['analysisReport1'].reportName,
      data.analysisReport2.id,
      data['analysisReport2'].reportName,
      data.commonality,
      data.identical
    ])
  }
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

  exportReportDetails(){
    let data = this.fullReportDetails;
    let fileName = this.reportName + "_Details.xlsx";
    let workbook = new Excel.Workbook();
    let report_details = workbook.addWorksheet('Report Details');
    let dimensions_col = workbook.addWorksheet('Dimensions');
    let dimensions_var = workbook.addWorksheet('Dim-Variables');
    let measures_cols = workbook.addWorksheet('Measures');
    let measures_var = workbook.addWorksheet('Fact-Variables');
    let report_objects = workbook.addWorksheet('Report Objects');
    let query_list = workbook.addWorksheet('Ouery List');
  
    report_details.addRow(['Report Id', data['reportId']]);
    report_details.addRow(['Report Name', data['reportName']]);
    report_details.addRow(['Report Type', data['reportType']]);
    report_details.addRow(['Report Creation Date', data['reportCreationDate']]);
    report_details.addRow(['Report Updated Date', data['reportUpdatedDate']]);
    report_details.addRow(['Report User', data['reportUser']]);
    report_details.addRow(['Report Published', data['reportPublished']]);
    report_details.addRow(['Report Scheduled', data['reportScheduled']]);
    report_details.addRow(['Actively Used', data['activelyUsed']])
    report_details.addRow(['Average Runtime', data['averageRunTime']]);
    report_details.addRow(['Folder Path', data['folderPath']]);
    report_details.addRow(['Number Of Blocks', data['numberOfBlocks']]);
    report_details.addRow(['Number Of Columns', data['numberOfColumns']]);
    report_details.addRow(['Number Of Conditional Blocks', data['numberOfConditionalBlocks']]);
    report_details.addRow(['Number Of Failures', data['numberOfFailures']]);
    report_details.addRow(['Number Of Filters', data['numberOfFilters']]);
    report_details.addRow(['Number Of Formulas', data['numberOfFormulas']]);
    report_details.addRow(['Number Of Instances', data['numberOfInstances']]);
    report_details.addRow(['Number Of Query', data['numberOfQuery']]);
    report_details.addRow(['Number Of Recurring Instances', data['numberOfRecurringInstances']]);
    report_details.addRow(['Number Of ReportPages', data['numberOfReportPages']]);
    report_details.addRow(['Number Of Rows', data['numberOfRows']]);
    report_details.addRow(['Number Of Tabs', data['numberOfTabs']]);
    report_details.addRow(['Number Of Variables', data['numberOfVariables']]);
    report_details.addRow(['Number Of Images', data['numberOfImages']]);
    report_details.addRow(['Number Of Embedded Elements', data['numberOfEmbeddedElements']]);
    report_details.addRow(['Column names', data['columnNames']]);
    report_details.addRow(['Pivot Table Set', data['pivotTableSet']]);
   // report_details.addRow(['Query List', data['reportId']]);
    report_details.addRow(['Chart Set', data['chartSet']]);
    report_details.addRow(['Table ColumnMap', data['ColumnMap']]);
    report_details.addRow(['Table Set', data['tableSet']]);
    report_details.addRow(['Total Size', data['totalSize']]);
    report_details.addRow(['Total Universe Count', data['totalUniverseCount']]);
    report_details.addRow(['Universe Id', data['universeId']]);
    report_details.addRow(['Universe Name', data['universeName']]);
    report_details.addRow(['Universe Path', data['universePath']]);
    report_details.addRow(['Commonality Factor', data['commonalityFactor']]);
    report_details.addRow(['Complexity', data['complexity']]);
    // report_details.addRow(['Exceptions', data['exceptionReport']]);
    
    for(let i=0;i<42;i++){
      report_details.getRow(i).eachCell(function (cell:any, colNumber:any) {
        report_details.getRow(i).getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '074588' },
          color: { argb: 'FFFFFFFF' }
        };
        report_details.getRow(i).getCell(1).font = {
          color: { argb: 'FFFFFFFF' }
        }
        report_details.getRow(i).getCell(2).alignment  = 
          { vertical: 'top', horizontal: 'left' };
        
    })
  }
    
    //------------------ ------- ------ Adding data in dimensions columns tab ------------------ ------- ------
    dimensions_col.columns = [
      //{header:'Column Id',key:'colid'},
      {header:'Column Name',key:'name'},
      {header:'Column Description',key:'desc'},
      {header:'Data Type',key:'dt'},
      //{header:'Qualification',key:'qual'},
      {header:'Column Expression',key:'exp'},
      //{header:'Query',key:'query'},
      {header:'Aggregation Fuction',key:'aggfun'}
    ]
    for(let data of this.reportData){
      if(data.name == 'Dimensions'){
        for(let rows of data['data']){
          if(rows.type == 'Columns'){
            for(let d of rows['list']){
              dimensions_col.addRow([d.columnName,d.columnDescription,d.columnDataType,d.columnExpression,d.aggregateFunction])
            }
          }
        }
      }
    }
    let dimensions_col_header = dimensions_col.getRow(1);
    this.setExcelSheetHeaders(dimensions_col_header);

    //--------------------- ------- ------ Adding data in Measure columns tab ---------------------------------
     measures_cols.columns = [
      //{header:'Column Id',key:'colid'},
      {header:'Column Name',key:'name'},
      {header:'Column Description',key:'desc'},
      {header:'Data Type',key:'dt'},
      //{header:'Qualification',key:'qual'},
      {header:'Column Expression',key:'exp'},
      //{header:'Query',key:'query'},
      {header:'Aggregation Fuction',key:'aggfun'}
    ]
    for(let data of this.reportData){
      if(data.name == 'Measures'){
        for(let rows of data['data']){
          if(rows.type == 'Columns'){
            for(let d of rows['list']){
              measures_cols.addRow([d.columnName,d.columnDescription,d.columnDataType,d.columnExpression,d.aggregateFunction])
            }
          }
        }
      }
    }
    let measures_cols_header = measures_cols.getRow(1);
    this.setExcelSheetHeaders(measures_cols_header);

    //------------------------ ------- ------ Adding data in Dimension Variable tab ------------------------------------
    dimensions_var.columns = [
      //{header:'Id',key:'id'},
      {header:'Name',key:'name'},
      {header:'Data type',key:'dt'},
      {header:'Definition',key:'def'},
      //{header:'Qualification',key:'qual'},
      //{header:'Formula Language Id',key:''}
    ]
    for(let data of this.reportData){
      if(data.name == 'Dimensions'){
        for(let rows of data['data']){
          if(rows.type == 'Variables'){
            for(let d of rows['list']){
              dimensions_var.addRow([d.name,d.dataType,d.definition])
            }           
          }
        }
      }
    }
    let dimensions_var_header =  dimensions_var.getRow(1);
    this.setExcelSheetHeaders(dimensions_var_header)
    //------------------------ ------- ------ Adding data in Measures Variable tab ------------------------------------
    measures_var.columns = [
      //{header:'Id',key:'id'},
      {header:'Name',key:'name'},
      {header:'Data type',key:'dt'},
      {header:'Definition',key:'def'},
      // {header:'Qualification',key:'qual'},
      // {header:'Formula Language Id',key:''}
    ]
    for(let data of this.reportData){
      if(data.name == 'Measures'){
        for(let rows of data['data']){
          if(rows.type == 'Variables'){
            for(let d of rows['list']){
              measures_var.addRow([d.name,d.dataType,d.definition])
            }           
          }
        }
      }
    }
    let measures_var_header =  measures_var.getRow(1);
    this.setExcelSheetHeaders(measures_var_header)

    // ------------------ -------   Adding data in report tab --------------------------------------------------------
    report_objects.columns = [
      { header: 'Report Table Name', key: 'rpt_tbl_name' },
      { header: 'BO Table Type', key: 'bo_tbl_type' },
      { header: 'BO Table Name', key: 'bt_tbl_name' },
      { header: 'BO Table Column', key: 'bo_tbl_column' },     
    ];
    for(let row of this.tabList){
      for(let data of row['boTableElements']){
        report_objects.addRow([row.reportTabName,data.tableType,data.tableName,data.numberOfColumns])
      }
    }
    let report_objects_header = report_objects.getRow(1);
    this.setExcelSheetHeaders(report_objects_header);
    //------------------ -------  Adding data in querylist tab------------------ ------- ----------------------
    query_list.columns  = [{ header:'Query ID',key:'qid'},
                  { header:'Query Name',key:'qname'},
                  {header:'Query',key:'query'},
                  {header:'No of Formulas',key:'formula'},
                  {header:'No of prompts',key:'prompts'}]

    for(let q of this.queryList){
      if(q.query != null) {
        query_list.addRow([q.queryId,q.queryName,q.query,q.numberOfFormulas,q.numberOfPrompts])
      }
      if(q.queryStatements){
        for(let p of q.queryStatements) {
          query_list.addRow([q.queryId,q.queryName,p,q.numberOfFormulas,q.numberOfPrompts])
        }
      }
      
    }
    let query_list_header = query_list.getRow(1);
    this.setExcelSheetHeaders(query_list_header);
    //------------------------------------------ Adding Data in Exceptions Tab ----------------------------------

    
    // exceptions.columns = [
    //   { header: 'Exceptions', key: 'exce' }
     
    // ];
    // exceptions.addRow([this.exceptionReport])
    // let exceptions_headers = exceptions.getRow(1);
    // this.setExcelSheetHeaders(exceptions_headers);

  // =============================== Saving final excelsheet ====================================
    workbook.xlsx.writeBuffer().then((data:any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, fileName);
    });

  }

  exportReportDetailsCognos()
  {
    let data = this.fullReportDetails;
    let fileName = this.reportName + "_Details.xlsx";
    let workbook = new Excel.Workbook();
    let report_details = workbook.addWorksheet('Report Details');
    let report_objects = workbook.addWorksheet('Report Objects');

    let query_object = workbook.addWorksheet('query Objects');
    let filter_objects = workbook.addWorksheet('filter Objects');
    report_details.addRow(['Report Id', data['reportId']]);
    report_details.addRow(['Report Name', data['reportName']]);
    report_details.addRow(['Report Type', data['reportType']]);
    report_details.addRow(['Report Creation Date', data['reportCreationDate']]);
    report_details.addRow(['Report Updated Date', data['reportUpdatedDate']]);
    report_details.addRow(['Report User', data['reportUser']]);
    report_details.addRow(['Report Published', data['reportPublished']]);
    report_details.addRow(['Report Scheduled', data['reportScheduled']]);
    report_details.addRow(['Actively Used', data['activelyUsed']])
    report_details.addRow(['Average Runtime', data['averageRunTime']]);
    report_details.addRow(['Folder Path', data['folderPath']]);
    report_details.addRow(['Number Of Blocks', data['numberOfBlocks']]);
    report_details.addRow(['Number Of Columns', data['numberOfColumns']]);
    report_details.addRow(['Number Of Conditional Blocks', data['numberOfConditionalBlocks']]);
    report_details.addRow(['Number Of Failures', data['numberOfFailures']]);
    report_details.addRow(['Number Of Filters', data['numberOfFilters']]);
    report_details.addRow(['Number Of Formulas', data['numberOfFormulas']]);
    report_details.addRow(['Number Of Instances', data['numberOfInstances']]);
    report_details.addRow(['Number Of Query', data['numberOfQuery']]);
    report_details.addRow(['Number Of Recurring Instances', data['numberOfRecurringInstances']]);
    report_details.addRow(['Number Of ReportPages', data['numberOfReportPages']]);
    report_details.addRow(['Number Of Rows', data['numberOfRows']]);
    report_details.addRow(['Number Of Tabs', data['numberOfTabs']]);
    report_details.addRow(['Number Of Variables', data['numberOfVariables']]);
    report_details.addRow(['Number Of Images', data['numberOfImages']]);
    report_details.addRow(['Number Of Embedded Elements', data['numberOfEmbeddedElements']]);
    report_details.addRow(['Column names', data['columnNames']]);
    report_details.addRow(['Pivot Table Set', data['pivotTableSet']]);
   // report_details.addRow(['Query List', data['reportId']]);
    report_details.addRow(['Chart Set', data['chartSet']]);
    report_details.addRow(['Table ColumnMap', data['ColumnMap']]);
    report_details.addRow(['Table Set', data['tableSet']]);
    report_details.addRow(['Total Size', data['totalSize']]);
    report_details.addRow(['Total Universe Count', data['totalUniverseCount']]);
    report_details.addRow(['Universe Id', data['universeId']]);
    report_details.addRow(['Universe Name', data['universeName']]);
    report_details.addRow(['Universe Path', data['universePath']]);
    report_details.addRow(['Commonality Factor', data['commonalityFactor']]);
    report_details.addRow(['Complexity', data['complexity']]);

    for(let i=0;i<42;i++){
      report_details.getRow(i).eachCell(function (cell:any, colNumber:any) {
        report_details.getRow(i).getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '074588' },
          color: { argb: 'FFFFFFFF' }
        };
        report_details.getRow(i).getCell(1).font = {
          color: { argb: 'FFFFFFFF' }
        }
        report_details.getRow(i).getCell(2).alignment  = 
          { vertical: 'top', horizontal: 'left' };
        
    })
  }


      // ------------------ -------   Adding data in report tab --------------------------------------------------------
      report_objects.columns = [
        { header: 'Report Table Name', key: 'rpt_tbl_name' },
        { header: 'Report Table Columns', key: 'rpt_tbl_column' },     
      ];
      for(let row of this.tableSet){
        
          for(let col of row.columnNames)
          {
            report_objects.addRow([row.tableName,col])
          }
      }
      let report_objects_header = report_objects.getRow(1);
      this.setExcelSheetHeaders(report_objects_header);

        // ------------------ -------   Adding data in Query tab --------------------------------------------------------
      query_object.columns = [
        { header: 'Query Name', key: 'qry_name' },
        { header: 'aggregate', key: 'aggr' },
        { header: 'Expression', key: 'exprn' },
        { header: 'Name', key: 'nme' },
        { header: 'Roll Up Aggregate', key: 'rollup_aggr' },
        { header: 'Sort', key: 'sort' },     
      ];

      for(let row of this.queryListCognos){

        
         for(let col of row.dataItem)
        {
          query_object.addRow([row.queryName,col.aggregate,col.expression,col.name,col.rollupAggregate,col.sort])
        }
      }
      let query_objects_header = query_object.getRow(1);
      this.setExcelSheetHeaders(query_objects_header);


        // ------------------ -------   Adding data in Filter tab --------------------------------------------------------
        filter_objects.columns = [
          { header: 'Query Name', key: 'qry_name' },
          { header: 'Filter Expression', key: 'fltr_expr' },
          { header: 'Filter Name', key: 'fltr_name' },
          { header: 'Filter Value', key: 'fltr_value' },
          { header: 'Operator', key: 'oprt' },
          { header: 'Post Use Auto Aggregation', key: 'puAA' },  
          { header: 'Use', key: 'use' },    
        ];

        for(let row of this.queryListCognos){

           for(let col of row.filterSet)
          {
            filter_objects.addRow([row.queryName,col.filterExpression,col.filterName,col.filterValue,col.filterOperator,col.postAutoAggregation,col.use])
          }
        }
        let filter_objects_header = filter_objects.getRow(1);
        this.setExcelSheetHeaders(filter_objects_header);

      workbook.xlsx.writeBuffer().then((data:any) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, fileName);
      });
    
  }

  exportReportDetailsTableau() {
    let data = this.fullReportDetails;
    let fileName = this.reportName + "_Details.xlsx";
    let workbook = new Excel.Workbook();
    let report_details = workbook.addWorksheet('Report Details');
    let dimensions_col = workbook.addWorksheet('Dimensions');
    let dimensions_var = workbook.addWorksheet('Dim-Variables');
    let measures_cols = workbook.addWorksheet('Measures');
    let measures_var = workbook.addWorksheet('Fact-Variables');
    let report_objects = workbook.addWorksheet('Report Objects');
    let column_instance = workbook.addWorksheet('Column Instance');
    let query_filters = workbook.addWorksheet('Ouery Filters');

    report_details.addRow(['Report Id', data['reportId']]);
    report_details.addRow(['Report Name', data['reportName']]);
    report_details.addRow(['Report Type', data['reportType']]);
    report_details.addRow(['Report Creation Date', data['reportCreationDate']]);
    report_details.addRow(['Report Updated Date', data['reportUpdatedDate']]);
    report_details.addRow(['Report User', data['reportUser']]);
    report_details.addRow(['Report Published', data['reportPublished']]);
    report_details.addRow(['Report Scheduled', data['reportScheduled']]);
    report_details.addRow(['Actively Used', data['activelyUsed']])
    report_details.addRow(['Average Runtime', data['averageRunTime']]);
    report_details.addRow(['Folder Path', data['folderPath']]);
    report_details.addRow(['Number Of Blocks', data['numberOfBlocks']]);
    report_details.addRow(['Number Of Columns', data['numberOfColumns']]);
    report_details.addRow(['Number Of Conditional Blocks', data['numberOfConditionalBlocks']]);
    report_details.addRow(['Number Of Failures', data['numberOfFailures']]);
    report_details.addRow(['Number Of Filters', data['numberOfFilters']]);
    report_details.addRow(['Number Of Formulas', data['numberOfFormulas']]);
    report_details.addRow(['Number Of Instances', data['numberOfInstances']]);
    report_details.addRow(['Number Of Query', data['numberOfQuery']]);
    report_details.addRow(['Number Of Recurring Instances', data['numberOfRecurringInstances']]);
    report_details.addRow(['Number Of ReportPages', data['numberOfReportPages']]);
    report_details.addRow(['Number Of Rows', data['numberOfRows']]);
    report_details.addRow(['Number Of Tabs', data['numberOfTabs']]);
    report_details.addRow(['Number Of Variables', data['numberOfVariables']]);
    report_details.addRow(['Number Of Images', data['numberOfImages']]);
    report_details.addRow(['Number Of Embedded Elements', data['numberOfEmbeddedElements']]);
    report_details.addRow(['Column names', data['columnNames']]);
    report_details.addRow(['Pivot Table Set', data['pivotTableSet']]);
   // report_details.addRow(['Query List', data['reportId']]);
    report_details.addRow(['Chart Set', data['chartSet']]);
    report_details.addRow(['Table ColumnMap', data['ColumnMap']]);
    report_details.addRow(['Table Set', data['tableSet']]);
    report_details.addRow(['Total Size', data['totalSize']]);
    report_details.addRow(['Total Universe Count', data['totalUniverseCount']]);
    report_details.addRow(['Universe Id', data['universeId']]);
    report_details.addRow(['Universe Name', data['universeName']]);
    report_details.addRow(['Universe Path', data['universePath']]);
    report_details.addRow(['Commonality Factor', data['commonalityFactor']]);
    report_details.addRow(['Complexity', data['complexity']]);
    // report_details.addRow(['Exceptions', data['exceptionReport']]);

    for(let i=0;i<42;i++){
      report_details.getRow(i).eachCell(function (cell:any, colNumber:any) {
        report_details.getRow(i).getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '074588' },
          color: { argb: 'FFFFFFFF' }
        };
        report_details.getRow(i).getCell(1).font = {
          color: { argb: 'FFFFFFFF' }
        }
        report_details.getRow(i).getCell(2).alignment  = 
          { vertical: 'top', horizontal: 'left' };
        
      })
    }

    //------------------ ------- ------ Adding data in dimensions columns tab ------------------ ------- ------
    dimensions_col.columns = [
      //{header:'Column Id',key:'colid'},
      {header:'Column Name',key:'name'},
      {header:'Column Type',key:'ct'},
      {header:'Data Type',key:'dt'},
      //{header:'Qualification',key:'qual'},
      {header:'Column Expression',key:'exp'},
      //{header:'Query',key:'query'},
      {header:'Aggregation Fuction',key:'aggfun'}
    ]
    for(let data of this.reportData){
      if(data.name == 'Dimensions'){
        for(let rows of data['data']){
          if(rows.type == 'Columns'){
            for(let d of rows['list']){
              dimensions_col.addRow([d.columnName,d.columnType,d.columnDataType,d.columnExpression,d.aggregateFunction])
            }
          }
        }
      }
    }
    let dimensions_col_header = dimensions_col.getRow(1);
    this.setExcelSheetHeaders(dimensions_col_header);

    //--------------------- ------- ------ Adding data in Measure columns tab ---------------------------------
    measures_cols.columns = [
      //{header:'Column Id',key:'colid'},
      {header:'Column Name',key:'name'},
      {header:'Column Type',key:'ct'},
      {header:'Data Type',key:'dt'},
      //{header:'Qualification',key:'qual'},
      {header:'Column Expression',key:'exp'},
      //{header:'Query',key:'query'},
      {header:'Aggregation Fuction',key:'aggfun'}
    ]
    for(let data of this.reportData){
      if(data.name == 'Measures'){
        for(let rows of data['data']){
          if(rows.type == 'Columns'){
            for(let d of rows['list']){
              measures_cols.addRow([d.columnName,d.columnType,d.columnDataType,d.columnExpression,d.aggregateFunction])
            }
          }
        }
      }
    }
    let measures_cols_header = measures_cols.getRow(1);
    this.setExcelSheetHeaders(measures_cols_header);

    //------------------------ ------- ------ Adding data in Dimension Variable tab ------------------------------------
    dimensions_var.columns = [
      //{header:'Id',key:'id'},
      {header:'Name',key:'name'},
      {header:'Data type',key:'dt'},
      {header:'Definition',key:'def'},
      {header:'Class name',key:'cn'}
      //{header:'Qualification',key:'qual'},
      //{header:'Formula Language Id',key:''}
    ]
    for(let data of this.reportData){
      if(data.name == 'Dimensions'){
        for(let rows of data['data']){
          if(rows.type == 'Variables'){
            for(let d of rows['list']){
              dimensions_var.addRow([d.name,d.dataType,d.definition,d.className])
            }           
          }
        }
      }
    }
    let dimensions_var_header =  dimensions_var.getRow(1);
    this.setExcelSheetHeaders(dimensions_var_header)

    //------------------------ ------- ------ Adding data in Measures Variable tab ------------------------------------
    measures_var.columns = [
      //{header:'Id',key:'id'},
      {header:'Name',key:'name'},
      {header:'Data type',key:'dt'},
      {header:'Definition',key:'def'},
      {header:'Class name',key:'cn'}
      // {header:'Qualification',key:'qual'},
      // {header:'Formula Language Id',key:''}
    ]
    for(let data of this.reportData){
      if(data.name == 'Measures'){
        for(let rows of data['data']){
          if(rows.type == 'Variables'){
            for(let d of rows['list']){
              measures_var.addRow([d.name,d.dataType,d.definition,d.className])
            }           
          }
        }
      }
    }
    let measures_var_header =  measures_var.getRow(1);
    this.setExcelSheetHeaders(measures_var_header)

    // ------------------ -------   Adding data in Column instance tab --------------------------------------------------------
    column_instance.columns = [
      { header: 'Column', key: 'col' },
      { header: 'Derivation', key: 'drv' },
      { header: 'Name', key: 'name' },
      { header: 'Pivot', key: 'pivot' },
      { header: 'Type', key: 'type' },
      { header: 'Tableau Table Name', key: 'tableau_tbl_name' },
    ];
    for (let row of this.tabList) {
      for (let data of row['tableauTableElements']) {
        for (let ele of data['columnInstance']) {
          column_instance.addRow([ele.column, ele.derivation, ele.columnName, ele.pivot, ele.type, data.tableName])
        }
      }
    }
    let column_instance_header = column_instance.getRow(1);
    this.setExcelSheetHeaders(column_instance_header);

    // ------------------ -------   Adding data in report tab --------------------------------------------------------
    report_objects.columns = [
      { header: 'Report Table Name', key: 'rpt_tbl_name' },
      { header: 'Tableau Table Caption', key: 'tableau_tbl_caption' },
      { header: 'Number of Columns', key: 'tableau_no_of_cols' },  
    ];
    for(let row of this.tabList){
      for(let data of row['tableauTableElements']){
        report_objects.addRow([data.tableName,data.caption,data.numberOfColumns])
      }
    }
    let report_objects_header = report_objects.getRow(1);
    this.setExcelSheetHeaders(report_objects_header);

     //------------------ -------  Adding data in query filters tab------------------ ------- ----------------------
    query_filters.columns  = [
      { header:'Class Name',key:'q_cn'},
      { header:'Column',key:'q_col'},
      {header:'Context',key:'q_con'},
      {header:'Filter Group',key:'q_fg'},
      {header:'Kind',key:'q_kind'}
    ];

    for(let row of this.tabList){
      for(let data of row['queryFilters']){
        query_filters.addRow([data.className, data.column, data.context, data.filterGroup, data.kind]);
      }
    }

    let query_filters_header = query_filters.getRow(1);
    this.setExcelSheetHeaders(query_filters_header);

    // =============================== Saving final excelsheet ====================================
    workbook.xlsx.writeBuffer().then((data:any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, fileName);
    });

  }


  hideUnvObjects(){
    this.showUniverseTable = true;
  }

  exportUniverseData(){ 
    //alert("Export universe Data Called")
    let fileName = this.taskName + "_Details.xlsx";
    let workbook = new Excel.Workbook();
   // let worksheet_project_Details = workbook.addWorksheet('Project Details');

    let measures:any;
    let folders:any;
    let filters:any;
    let attributes:any;
    let dimensions:any;
    let tables:any;
    let joins:any;
    let variables:any;
    let identifiers:any;
    let facts:any;

    if(this.reportType=='BO')
    {
      measures = workbook.addWorksheet('Measures');
      folders = workbook.addWorksheet('Folders');
      filters = workbook.addWorksheet('Filters');
      attributes = workbook.addWorksheet('Attributes');
      dimensions = workbook.addWorksheet('Dimensions');
      tables = workbook.addWorksheet('Tables');
      joins = workbook.addWorksheet('Joins');
    }
    else if (this.reportType=='COGNOS')
    {
      tables = workbook.addWorksheet('Tables');
      joins = workbook.addWorksheet('Joins');
      folders = workbook.addWorksheet('Folders');
      attributes = workbook.addWorksheet('Attributes');
      variables = workbook.addWorksheet('Variables');
      filters = workbook.addWorksheet('Filters');
      identifiers = workbook.addWorksheet('Identifiers');
      facts = workbook.addWorksheet('Facts');
    }

    
   /*  worksheet_project_Details.columns = [
      { header: 'Project Name', key: 'pname' },
      { header: 'Start Date', key: 'sdate' },
      { header: 'End Date', key: 'edate' },
      { header: 'Users', key: 'user' },
      { header: 'Status', key: 'status' },
      { header: 'Connections', key: 'conn' }

    ]; */
    /* let usernames = [];
    let connections = [];
    for (let user of this.projectDetails['users']) {
      usernames.push(user['userProfile'].name)
    }
    for (let conn of this.projectDetails['projectReportCons']) {
      connections.push(conn.name);
    }
    worksheet_project_Details.addRow([this.projectDetails['name'], this.projectDetails['startDate'].split("T")[0], this.projectDetails['endDate'].split("T")[0], usernames.toString(), this.projectDetails['status'].name, connections.toString()])
    let header = worksheet_project_Details.getRow(1);
    this.setExcelSheetHeaders(header); */
   
    //path,name,seect,projectionfun,datatype,iused,where

    //Bo Universe export data
    if(this.reportType=='BO')
    {
      measures.columns = [
        { header: 'Path', key: 'path' },
        { header: 'Name', key: 'pname' },
        { header: 'Formula', key: 'select' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Where', key: 'whr' },
        { header: 'Is Used', key: 'used' }
      ]
      folders.columns = [
        { header: 'Path', key: 'path' },
        { header: 'Name', key: 'pname' },
        { header: 'Formula', key: 'select' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Where', key: 'whr' },
        { header: 'Is Used', key: 'used' }
      ];
      filters.columns = [
        { header: 'Path', key: 'path' },
        { header: 'Name', key: 'pname' },
        { header: 'Formula', key: 'select' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Where', key: 'whr' },
        { header: 'Is Used', key: 'used' }
      ];
      dimensions.columns = [
        { header: 'Path', key: 'path' },
        { header: 'Name', key: 'pname' },
        { header: 'Formula', key: 'select' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Where', key: 'whr' },
        { header: 'Is Used', key: 'used' }
      ];
      attributes.columns = [
        { header: 'Path', key: 'path' },
        { header: 'Name', key: 'pname' },
        { header: 'Formula', key: 'select' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Where', key: 'whr' },
        { header: 'Is Used', key: 'used' }
      ];
      tables.columns = [
        {header:'Table Name',key:'tablname'},
        {header:'Column Name',key:'colname'},
        {header:'Data Type',key:'dt'},
        { header: 'Is Used', key: 'used' }
      ];
      joins.columns = [
        {header:'Identifier',key:'identifier'},
        {header:'Left Table',key:'leftTable'},
        {header:'Right Table',key:'outerType'},
        {header:'Formula',key:'rightTable'}
      ];
    }
    else if (this.reportType=='COGNOS')
    {
      variables.columns = [
        { header: 'Name', key: 'pname' },
        { header: 'Formula', key: 'select' },
        { header: 'Q Name', key: 'qName' }
      ];
      folders.columns = [
        { header: 'Name', key: 'pname' }
      ];
      filters.columns = [
        { header: 'Name', key: 'pname' },
        { header: 'Formula', key: 'select' },     
        { header: 'Q Name', key: 'qName' }
      ];
      identifiers.columns = [
        { header: 'Name', key: 'pname' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Q Name', key: 'qName' }
      ];
      attributes.columns = [
        { header: 'Name', key: 'pname' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Q Name', key: 'qName' }
      ];
      tables.columns = [
        {header:'Table Name',key:'tablname'},
        //{header:'Column Name',key:'colname'},
        { header: 'Q Name', key: 'qName' }
      ];
      joins.columns = [
      
        {header:'Identifier',key:'identifier'},
        {header:'Left Table',key:'leftTable'},
        {header:'Right Table',key:'rightTable'},
        {header:'Formula',key:'outerType'}
      ];
      facts.columns = [
        { header: 'Name', key: 'pname' },
        { header: 'Data Type', key: 'dtype' },     
        { header: 'Q Name', key: 'qName' }
      ];
    }
    
    if(this.reportType=='BO')
    {
      this.addRows(measures,this.universeMeasures);
      let measures_header = measures.getRow(1);
      this.setExcelSheetHeaders(measures_header);
  
      this.addRows(folders,this.universeFolders);
      let folders_header = folders.getRow(1);
      this.setExcelSheetHeaders(folders_header);
  
      this.addRows(filters,this.universeFilters);
      let filter_header = filters.getRow(1);
      this.setExcelSheetHeaders(filter_header);
  
      this.addRows(dimensions,this.universeDimensions);
      let dimention_header = dimensions.getRow(1);
      this.setExcelSheetHeaders(dimention_header);
  
  
      this.addRows(attributes,this.universeAttributes);
      let attribute_header = attributes.getRow(1);
      this.setExcelSheetHeaders(attribute_header);
  
      for(let data of this.universeTable){
        tables.addRow([data.name,'','']);
        for(let col of data.columns){
          tables.addRow(['',col.name,col.dataType,col.isUsed]);
        }
      }
      let tables_header = tables.getRow(1);
      this.setExcelSheetHeaders(tables_header);
  
      for(let data of this.universeJoins){
        joins.addRow([data.identifier,data.leftTable,data.rightTable,data.expression]);
      }
      let joins_header = joins.getRow(1);
      this.setExcelSheetHeaders(joins_header);
    }
    else if(this.reportType=='COGNOS')
    {
      this.addRowsCognosVariables(variables,this.universeVariables);
      let variables_header = variables.getRow(1);
      this.setExcelSheetHeaders(variables_header);
  
      this.addRowsCognosFolder(folders,this.universeFolders);
      let folders_header = folders.getRow(1);
      this.setExcelSheetHeaders(folders_header);
  
      this.addRowsCognosVariables(filters,this.universeFilters);
      let filter_header = filters.getRow(1);
      this.setExcelSheetHeaders(filter_header);
  
      this.addRowsCognosUniverse(identifiers,this.universeIdentifiers);
      let identifiers_header = identifiers.getRow(1);
      this.setExcelSheetHeaders(identifiers_header);
  
  
      this.addRowsCognosUniverse(attributes,this.universeAttributes);
      let attribute_header = attributes.getRow(1);
      this.setExcelSheetHeaders(attribute_header);
      

      this.addRowsCognosUniverse(facts,this.universeFacts);
      let facts_header = facts.getRow(1);
      this.setExcelSheetHeaders(facts_header);

      for(let data of this.universeTable){
        tables.addRow([data.name,data.qName]);
      }
      let tables_header = tables.getRow(1);
      this.setExcelSheetHeaders(tables_header);
      
      for(let data of this.universeJoins){
        joins.addRow([data.name,data.leftTable,data.rightTable,data.condition]);
      }
      let joins_header = joins.getRow(1);
      this.setExcelSheetHeaders(joins_header);
    }

    workbook.xlsx.writeBuffer().then((data:any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, fileName);
    });
  }


  addRows(tabname:any,array:any){
    if(array){
      for(let m of array){
       // path,name,seect,projectionfun,datatype,iused,where
        tabname.addRow([m.path,m.name,m.select,m.dataType,m.where,m.isUsed])
      }
    }    
  }

  addRowsCognosUniverse(tabname:any,array:any)
  {
    if(array){
      for(let m of array){
       // path,name,seect,projectionfun,datatype,iused,where
        tabname.addRow([m.name,m.dataType,m.qName])
      }
    }    
  }

  addRowsCognosFolder(tabname:any,array:any)
  {
    if(array){
      for(let m of array){
       // path,name,seect,projectionfun,datatype,iused,where
        tabname.addRow([m.name])
      }
    }    
  }

  addRowsCognosVariables(tabname:any,array:any)
  {
    if(array){
      for(let m of array){
       // path,name,seect,projectionfun,datatype,iused,where
        tabname.addRow([m.name,m.expression,m.qName])
      }
    }    
  }

  exportCompleteRptInfo() {
    let fileName = "Report(s)_Information.xlsx";
    let workbook = new Excel.Workbook();
    let report_details = workbook.addWorksheet();

    report_details.columns = [
      {header: 'Workbook Name', key: 'wrkbk_name'},
      { header: 'Worksheet Name', key: 'wrksht_name' },
      { header: 'Column Name', key: 'col_name' },
      { header: 'Datatype', key: 'datatype' },
      { header: 'Expression', key: 'expr' },
      { header: 'Datasource Name', key: 'ds_name' },
      { header: 'Table Name', key: 'table_name' },
    ];

    for (let data of this.exportDataList) {
      report_details.addRow([data.workbookName,'','', '', '', '', '']);
      for (let wrkshtInfo of data.workbookInfo) {
        report_details.addRow(['',wrkshtInfo.worksheetName,'', '', '', '', '']);
        for (let col of wrkshtInfo.columnsInfo) {
          report_details.addRow(['','', col.columnName, col.dataType, col.expression, col.datasourceName, col.tableName]);
        }
      }
    }

    let headerrow1 = report_details.getRow(1);
    this.setExcelSheetHeaders(headerrow1)

    workbook.xlsx.writeBuffer().then((data:any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, fileName);
    });

  }



}


